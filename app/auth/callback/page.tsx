"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "../../store/profile";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import {
  isPromoWindowActive,
  MARCH_OFFER_DIALOG_SESSION_KEY,
} from "@/constants/marchOffer";
import { ensurePromoAppSetting } from "@/functions/app-setting";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePgnStore } from "@/app/store/zustandStore";
import { trackCustomEvent } from "@/app/utils/facebookPixel";

export default function SSOCallbackPage() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const { setProfile, setSessionId,  } = useProfileStore();
  const {setProfileShow,providerType } = usePgnStore()
  const router = useRouter();
  const baseUrl = process.env.BASE_URL;

  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
    setIsProcessing(false);
  };

  const closeAlert = () => {
    setAlertDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleAlertConfirm = () => {
    if (alertDialog.onConfirm) {
      alertDialog.onConfirm();
    }
    closeAlert();
  };

  useEffect(() => {
    const processSSO = async () => {
      try {
        let hash = window.location.hash;

        if (!hash && window.location.pathname === "/auth/callback") {
          hash = window.location.hash;
        }

        if (!hash) {
          showAlert(
            "Authentication Error",
            "No authentication data received. Please try again.",
            () => router.push("/login")
          );
          return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const isNew = params.get("is_new");
        if(isNew){
          trackCustomEvent("CompleteRegistration", { sso: providerType});
        }
        if (!accessToken) {
          showAlert(
            "Authentication Error",
            "Invalid authentication data. Please try again.",
            () => router.push("/login")
          );
          return;
        }

        const statusResponse = await fetch(`${baseUrl}/profile/status`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!statusResponse.ok) {
          showAlert(
            "Authentication Failed",
            "Authentication failed. Please try again.",
            () => router.push("/login")
          );
          return;
        }

        const statusData = await statusResponse.json();

        if (statusData.success && statusData.data) {
          const { isActive, canLogin } = statusData.data;

          if (!isActive && !canLogin) {
            try {
              await fetch(`${baseUrl}/auth/logout`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              });
            } catch (logoutError) {
              console.error("Error during SSO logout:", logoutError);
            }

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("token");
            setPersistedCookie("token", "", 0);
            setSessionId("");

            showAlert(
              "Account Deactivated",
              "Account has been deactivated. Please use account reactivation or contact support.",
              () => router.push("/login")
            );
            return;
          }

          setPersistedCookie("token", accessToken, 365);
          setSessionId(accessToken);

          try {
            const profileResponse = await fetch(`${baseUrl}/profile`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });

            

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              const normalizedProfile = profileData.data ?? profileData;
              setProfile(normalizedProfile);
              setProfileShow(profileData)
              try {
                // Await the backend promo window in case it is still loading.
                if (isPromoWindowActive(await ensurePromoAppSetting())) {
                  window.sessionStorage.setItem(MARCH_OFFER_DIALOG_SESSION_KEY, "true");
                }
              } catch (error) {
                console.error("Error preparing March offer dialog:", error);
              }
              
              const userUsername =
                profileData.data?.username || profileData.username;
              const userOnboardElo =
                profileData.data?.onboard_elo ?? profileData.onboard_elo;
              // Prefer the explicit chess.com connection flag; fall back to the
              // legacy "has a username" heuristic while the backend field rolls out.
              const userIsChesscomConnected =
                profileData.data?.is_chesscom_connected ??
                profileData.is_chesscom_connected ??
                Boolean(userUsername && userUsername.trim() !== "");

              if (userIsChesscomConnected) {
                // Connected → skip onboarding entirely, ignoring onboard_elo.
                router.push("/playground/play-vs-ai");
              } else if (!userOnboardElo) {
                // Not connected and no level set yet → show the knowledge screen.
                router.push("/chess-knowledge");
              } else {
                router.push("/playground/play-vs-ai");
              }
            } else {
              router.push("/playground/play-vs-ai");
            }
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
            router.push("/playground/play-vs-ai");
          }
        } else {
          showAlert(
            "Verification Failed",
            "Failed to verify account status. Please try again.",
            () => router.push("/login")
          );
        }
      } catch (error) {
        console.error("Error processing SSO login:", error);
        showAlert(
          "Login Failed",
          "Failed to process login. Please try again.",
          () => router.push("/login")
        );
      }
    };

    processSSO();
  }, [baseUrl, providerType, router, setProfile, setProfileShow, setSessionId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing your sign-in...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={alertDialog.isOpen} onOpenChange={closeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertConfirm}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "../../store/profile";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const { setSessionId } = useProfileStore();
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
              const userUsername =
                profileData.data?.username || profileData.username;

              if (userUsername && userUsername.trim() !== "") {
                router.push("/my-game-history");
              } else {
                router.push("/analysis");
              }
            } else {
              router.push("/analysis");
            }
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
            router.push("/analysis");
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
  }, [baseUrl, router, setSessionId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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

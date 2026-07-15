"use client";

import { Loader2, Lock, LogOut, Mail, Info, User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePgnStore } from "@/app/store/zustandStore";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { supabase } from "@/lib/supabase";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog";
import ProfileAvatarUpload from "@/components/v2/profile-avatar-upload";
import InitialAvatar from "@/components/avatar/InitialAvatar";
import { toast } from "sonner";
import { ChessApiService } from "@/components/analysis/onboarding/store/APIService";
import { usePlayerStatsStore } from "@/components/analysis/onboarding/store/usePlayerStatsStore";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { formatTimePgn } from "@/functions/format-date";

interface ProfileAccountCardProps {
  handleUsernameClicked: () => void;
  onConnectClicked: () => void;
  onLogoutStart: () => void;
}

const KnightIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#221AE9"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 22H5v-2h14v2zm-2.5-3H7.5c-.28 0-.5-.22-.5-.5 0-2.5 1.4-4.2 2.9-5.2-.9-.7-1.4-1.6-1.4-2.8 0-.7.2-1.3.5-1.9-.6-.4-1-1-1-1.8C7.5 5.8 8.3 5 9.3 5c.5 0 1 .2 1.3.6C11.1 4.6 11.5 4 12 4c1.7 0 3 2.5 3.5 4.5.3 1.2.5 2.7.5 4.3 0 2.6-1.1 4.2-2.5 5.2.9.4 1.5.9 1.5 1.5 0-.28-.22-.5-.5-.5z" />
  </svg>
);

/**
 * Revamped "My Account" section for the /profile page (avatar header, account
 * fields and the Chess.com linked info / connect banner).
 */
const ProfileAccountCard = ({
  onLogoutStart,
  handleUsernameClicked,
  onConnectClicked,
}: ProfileAccountCardProps) => {
  const { logOut, isLoading, updateProfileUsername, checkUsernameAvailability } =
    useApiClient();
  const {
    profile,
    clearAll: clearProfile,
    sessionId,
    setAlreadyFetchProfile,
    setAlreadyFetch,
  } = useProfileStore();
  const { setCallFetch } = useProfileFetch();
  const router = useRouter();
  const { username, clearAll, providerType } = usePgnStore();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isUpdatingGameType, setIsUpdatingGameType] = useState(false);
  const [form, setForm] = useState<any>({
    email: profile.email ?? "",
    defaultUsername: username,
    password: "",
  });

  const {
    gameTypesData,
    selectedGameType,
    setPlayerData,
    setSelectedGameType,
    clearPlayerStats,
  } = usePlayerStatsStore();

  const isEmailProvider = providerType === "email";
  // Prefer the explicit flag from the profile response; fall back to the
  // legacy "has a username" heuristic while the backend field rolls out.
  const isConnected = profile?.isChessComConnected ?? Boolean(username);

  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const usernameCheckSeq = useRef(0);

  useEffect(() => {
    setForm({
      email: profile.email ?? "",
      defaultUsername: username,
      password: "",
    });
  }, [profile, username]);

  useEffect(() => {
    const loadUserGameTypes = async () => {
      if (username && sessionId) {
        try {
          const response = await ChessApiService.checkPlayerStats(
            username,
            sessionId
          );
          if (
            response.success &&
            response.data &&
            Array.isArray(response.data)
          ) {
            setPlayerData(username, response.data);
          }
        } catch (error) {
          clearPlayerStats();
        }
      }
    };

    loadUserGameTypes();
  }, [username, sessionId, setPlayerData, clearPlayerStats]);

  const handleOnChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Debounced availability check while the user types a desired username
  // (only when the account is not linked to Chess.com).
  useEffect(() => {
    if (isConnected) return;
    const desired = (form.defaultUsername ?? "").trim();
    if (!desired || desired === (username ?? "")) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    const seq = ++usernameCheckSeq.current;
    const timer = setTimeout(async () => {
      try {
        const response: any = await checkUsernameAvailability(desired);
        if (seq !== usernameCheckSeq.current) return;
        const data = response?.data ?? response;
        const available =
          data === true || data?.available === true || data?.isAvailable === true;
        setUsernameStatus(available ? "available" : "unavailable");
      } catch {
        if (seq === usernameCheckSeq.current) setUsernameStatus("unavailable");
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.defaultUsername, isConnected, username]);

  const canSaveUsername =
    !isConnected && usernameStatus === "available" && !isSavingUsername;

  const handleSaveUsername = async () => {
    const desired = (form.defaultUsername ?? "").trim();
    if (!canSaveUsername || !desired) return;

    setIsSavingUsername(true);
    try {
      await updateProfileUsername({ username: desired });
      toast.success("Username updated");
      setUsernameStatus("idle");
      setAlreadyFetch(false);
      setAlreadyFetchProfile(false);
      setCallFetch(formatTimePgn());
    } catch (error: any) {
      toast.error(error.message || "Failed to update username");
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleChangePassword = () => {
    router.push("/forgot-password");
  };

  useEffect(() => {
    const gameData = gameTypesData.find(
      (game) => game.game_type === profile.gameType
    );
    if (gameData) {
      setSelectedGameType(gameData.game_type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameTypesData]);

  const handleGameTypeChange = async (newGameType: string) => {
    if (!sessionId) {
      toast.error("Authentication required");
      return;
    }

    if (!username) {
      toast.error("Username not found");
      return;
    }

    const gameData = gameTypesData.find(
      (game) => game.game_type === newGameType
    );
    if (!gameData) {
      toast.error("Invalid game type selected");
      return;
    }

    setIsUpdatingGameType(true);

    try {
      await ChessApiService.setUsername(
        username,
        gameData.game_type,
        gameData.elo,
        sessionId
      );
      setAlreadyFetch(false);
      setAlreadyFetchProfile(false);
      setCallFetch(formatTimePgn());
      setSelectedGameType(newGameType);
      toast.success(`Game type updated to ${gameData.label}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update game type");
    } finally {
      setIsUpdatingGameType(false);
    }
  };

  const handleLogout = async () => {
    onLogoutStart();
    clearAll();
    clearProfile();
    handleSignOut();
  };

  const handleSignOut = async () => {
    logOut({ sessionId })
      .then(() => {})
      .finally(() => {
        clearAll();
        localStorage.removeItem("sessionId");
        localStorage.removeItem("token");
        localStorage.removeItem("background-analysis-storage");
        localStorage.removeItem("training_schedule");
        localStorage.removeItem("training_topics");
        localStorage.removeItem("pgn-local-storage");
        setPersistedCookie("token", "", 365);
        window.location.href = "/login";
      });
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  const displayName = profile?.username || username || "";
  const selectedGameData = gameTypesData.find(
    (game) => game.game_type === selectedGameType
  );

  return (
    <div className={`flex flex-col gap-4`}>
      {/* Section title — desktop only, per mobile mockup */}
      <div className="hidden md:flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1">
        <span className="text-[18px] font-semibold">My Account</span>
      </div>

      {/* Avatar header — desktop */}
      <div className="hidden md:flex flex-row items-center justify-between gap-4 border-0 border-b border-b-[#E2E8F0] pb-4">
        <div className="flex flex-row items-center gap-4">
          <ProfileAvatarUpload
            showEditBadge
            className="w-[80px] h-[80px] rounded-full border-2 border-[#221AE9] bg-[#E6F7FE]"
            fallback={
              <Image
                src="/icons/pawn-icon-alt-black.png"
                alt="Profile avatar"
                width={48}
                height={48}
                className="object-contain"
              />
            }
          />
          <div className="flex flex-col">
            <span className="text-[18px] font-semibold text-black">
              {displayName}
            </span>
            <span className="text-[14px] text-gray-500">{profile.email}</span>
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={handleLogout}
          className="btn-danger rounded-full flex flex-row items-center justify-center w-[160px] h-[44px] p-[10px] gap-1"
        >
          <LogOut size={18} />
          <span>Sign-out</span>
        </button>
      </div>

      {/* Avatar header — mobile: compact identity row + centered upload avatar */}
      <div className="flex md:hidden flex-col gap-4 border-0 border-b border-b-[#E2E8F0] pb-4">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center gap-3 min-w-0">
            {profile?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.imageUrl}
                alt="Profile picture"
                className="w-[40px] h-[40px] rounded-full object-cover shrink-0"
              />
            ) : (
              <InitialAvatar
                name={displayName || "Anonymous"}
                className="w-[40px] h-[40px] shrink-0"
              />
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[16px] font-semibold text-black truncate">
                {displayName}
              </span>
              <span className="text-[13px] text-gray-500 truncate">
                {profile.email}
              </span>
            </div>
          </div>

          <button
            disabled={isLoading}
            onClick={handleLogout}
            className="btn-danger rounded-full flex flex-row items-center justify-center h-[40px] px-[16px] gap-1 shrink-0"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <div className="flex justify-center">
          <ProfileAvatarUpload
            showEditBadge
            className="w-[96px] h-[96px] rounded-full border-2 border-[#221AE9] bg-[#E6F7FE]"
            fallback={
              <Image
                src="/icons/pawn-icon-alt-black.png"
                alt="Profile avatar"
                width={56}
                height={56}
                className="object-contain"
              />
            }
          />
        </div>
      </div>

      {/* Account fields */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] items-start gap-3">
        <div className="space-y-2 w-full">
          <label
            htmlFor="email"
            className="flex flex-row items-center gap-2 text-[14px] font-normal"
          >
            <Mail size={20} /> Email
          </label>
          <Input
            disabled={true}
            id="email"
            name="email"
            type="email"
            placeholder="Type here..."
            className={`w-full shadow-sm min-h-[44px] bg-[#C0CED4] border ${
              form.email.length > 0 ? `border-[#737c7f]` : `border-[#C0CED4]`
            } px-[16px] py-[12px]`}
            value={form.email}
            onChange={handleOnChange}
          />
        </div>

        <div className="space-y-2 w-full">
          <label
            htmlFor="username"
            className="flex flex-row items-center gap-2 text-[14px] font-normal"
          >
            <User size={20} /> Username
          </label>
          <div className="relative">
            <Input
              readOnly={isConnected}
              id="username"
              name="defaultUsername"
              type="text"
              placeholder="Type here..."
              className={`w-full shadow-sm min-h-[44px] border px-[16px] py-[12px] ${
                !isConnected && usernameStatus === "available"
                  ? "bg-[#F4FBF7] border-[#1B8354] pr-[160px]"
                  : !isConnected && usernameStatus === "unavailable"
                  ? "bg-[#FFF5F5] border-[#D92D20] pr-[140px]"
                  : `bg-[#FAFDFF] ${
                      (form.defaultUsername ?? "").length > 0
                        ? "border-[#737c7f]"
                        : "border-[#C0CED4]"
                    } ${usernameStatus === "checking" ? "pr-[44px]" : ""}`
              }`}
              value={form.defaultUsername}
              onChange={handleOnChange}
              onClick={() => {
                if (isConnected && !form.defaultUsername) {
                  handleUsernameClicked();
                }
              }}
            />
            {!isConnected && usernameStatus === "checking" && (
              <span className="absolute right-[12px] top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-[#221AE9]" />
              </span>
            )}
            {!isConnected && usernameStatus === "available" && (
              <span className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Image
                  src="/images/v2/profile/check 1.png"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                />
                <span className="text-[12px] font-medium text-[#1B8354] whitespace-nowrap">
                  Username available
                </span>
              </span>
            )}
            {!isConnected && usernameStatus === "unavailable" && (
              <span className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#D92D20] whitespace-nowrap">
                Username taken
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 w-full">
          <label
            htmlFor="password"
            className="flex flex-row items-center gap-2 text-[14px] font-normal"
          >
            <Lock size={20} /> Password
          </label>
          <Input
            disabled={true}
            id="password"
            name="password"
            type="password"
            placeholder="Type here..."
            className={`w-full text-xl shadow-sm min-h-[44px] bg-[#C0CED4] border border-[#C0CED4] px-[16px] py-[12px]`}
            value={"••••••••"}
            onChange={handleOnChange}
          />
          {isEmailProvider && (
            <button
              onClick={handleChangePassword}
              className="w-full flex justify-end"
            >
              <span className="font-normal text-[14px] text-[#221AE9] underline">
                Change Password
              </span>
            </button>
          )}
        </div>

        <div className="w-full md:w-auto md:pt-[30px]">
          <button
            disabled={!canSaveUsername}
            onClick={handleSaveUsername}
            className={`w-full md:w-[150px] h-[44px] rounded-full text-white font-medium transition-colors ${
              canSaveUsername
                ? "bg-[#221AE9] hover:bg-[#2d25ea]"
                : "bg-[#C0CED4] cursor-not-allowed"
            }`}
          >
            {isSavingUsername ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {isConnected ? (
        <>
          <div className="flex items-center justify-center gap-2">
            <KnightIcon />
            <span className="text-[14px] text-black">
              Your Chess.com account is linked.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="w-full">
              <Input
                readOnly={true}
                id="chesscom-username"
                name="chesscomUsername"
                type="text"
                className="w-full shadow-sm min-h-[44px] bg-[#C0CED4] border border-[#737c7f] px-[16px] py-[12px]"
                value={username}
                onChange={() => {}}
              />
            </div>
            <div className="w-full">
              <Select
                value={selectedGameType || ""}
                onValueChange={handleGameTypeChange}
                disabled={isUpdatingGameType || gameTypesData.length === 0}
              >
                <SelectTrigger
                  className={`w-full shadow-sm min-h-[44px] bg-[#C0CED4] border border-[#737c7f] px-[16px] py-[12px] ${
                    isUpdatingGameType ? "opacity-50" : ""
                  }`}
                >
                  <SelectValue placeholder={profile.gameType}>
                    {selectedGameData
                      ? `${selectedGameData.label} - ELO ${selectedGameData.elo}`
                      : profile.gameType}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {gameTypesData.map((gameData) => (
                    <SelectItem
                      key={gameData.game_type}
                      value={gameData.game_type}
                    >
                      {gameData.label} - ELO {gameData.elo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-x-1 text-blue-base mt-1">
                <Info className="w-3 h-3 flex-shrink-0 -mt-0.5" />
                <p className="text-[12px]">
                  Changing your Game Type will affect the Game History and
                  Training Plan
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="relative w-full overflow-hidden bg-[linear-gradient(to_right,#25CADC,#2327EB)] border-b-[6px] border-[#102299] flex flex-col lg:flex-row items-center justify-between p-[16px] md:py-[20px] md:px-[32px] gap-[12px] rounded-[16px]">
          <Image
            src="/images/union.svg"
            alt=""
            width={237}
            height={75}
            className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          />
          <div className="flex items-center gap-[12px]">
            <Image
              src="/icons/account-not-connected.svg"
              alt=""
              width={102}
              height={75}
              className="w-[64px] h-[47px] md:w-[86px] md:h-[63px]"
            />
            <h3 className="text-[16px] md:text-[18px] font-semibold text-white leading-[130%]">
              Analyze your Chess.com Games
            </h3>
          </div>

          <button
            type="button"
            onClick={onConnectClicked}
            className="relative z-10 flex w-full lg:w-auto items-center justify-center gap-[8px] py-[12px] px-[32px] text-white text-[15px] font-semibold rounded-full bg-[rgba(255,255,255,.2)] hover:bg-[rgba(255,255,255,.3)]"
          >
            <span>Connect Chess.com Account</span>
            <svg
              width="19"
              height="16"
              viewBox="0 0 19 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.4209 8.67476L11.6709 15.4248C11.4596 15.6361 11.1729 15.7548 10.8741 15.7548C10.5752 15.7548 10.2885 15.6361 10.0772 15.4248C9.86584 15.2134 9.74711 14.9268 9.74711 14.6279C9.74711 14.329 9.86584 14.0424 10.0772 13.831L14.9062 9.00383H1.125C0.826631 9.00383 0.540483 8.8853 0.329505 8.67432C0.118526 8.46334 0 8.1772 0 7.87883C0 7.58046 0.118526 7.29431 0.329505 7.08333C0.540483 6.87235 0.826631 6.75383 1.125 6.75383H14.9062L10.0791 1.92383C9.86772 1.71248 9.74899 1.42584 9.74899 1.12695C9.74899 0.828065 9.86772 0.541421 10.0791 0.330076C10.2904 0.118732 10.5771 3.14928e-09 10.8759 0C11.1748 -3.14928e-09 11.4615 0.118732 11.6728 0.330076L18.4228 7.08008C18.5277 7.18473 18.6109 7.30908 18.6676 7.44598C18.7243 7.58288 18.7534 7.72963 18.7532 7.87781C18.7531 8.02599 18.7236 8.17267 18.6666 8.30944C18.6096 8.4462 18.5261 8.57035 18.4209 8.67476Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      )}

      {isEmailProvider && (
        <ChangePasswordDialog
          isOpen={isPasswordDialogOpen}
          onClose={() => setIsPasswordDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileAccountCard;

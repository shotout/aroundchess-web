import { Lock, LogOut, Mail, Info } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePgnStore } from "@/app/store/zustandStore";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { supabase } from "@/lib/supabase";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import DotSpinner from "../game-history/Spinner";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { toast } from "sonner";
import { ChessApiService } from "../analysis/onboarding/store/APIService";
import { usePlayerStatsStore } from "../analysis/onboarding/store/usePlayerStatsStore";

const MyAccount = () => {
  const { getProfile, logOut, isLoading } = useApiClient();
  const {
    profile,
    setProfile,
    clearAll: clearProfile,
    sessionId,
  } = useProfileStore();
  const router = useRouter();
  const { username, setUsername, clearAll } = usePgnStore();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isUpdatingGameType, setIsUpdatingGameType] = useState(false);
  const [form, setForm] = useState<any>({
    email: profile.email ?? "",
    defaultUsername: username,
    password: "",
  });

  const {
    username: storeUsername,
    gameTypesData,
    selectedGameType,
    setPlayerData,
    setSelectedGameType,
    getSelectedGameData,
    clearPlayerStats,
  } = usePlayerStatsStore();

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

  const handleChangePassword = () => {
    router.push("/forgot-password");
  };

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
      setSelectedGameType(newGameType);
      toast.success(`Game type updated to ${gameData.label}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update game type");
    } finally {
      setIsUpdatingGameType(false);
    }
  };

  const handleLogout = async () => {
    clearAll();
    clearProfile();
    localStorage.removeItem("token");
    handleSignOut();
  };

  const handleSignOut = async () => {
    logOut({ sessionId })
      .then(() => {})
      .finally(() => {
        clearAll();
        localStorage.removeItem("token");
        setPersistedCookie("token", "", 365);
        window.location.href = "/login";
      });
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1">
        <span className="text-[18px] font-semibold">My Account</span>
        <button
          disabled={isLoading}
          onClick={handleLogout}
          className="btn-danger rounded-full flex flex-row items-center justify-center w-[160px] h-[44px] p-[10px] gap-1"
        >
          {isLoading ? (
            <DotSpinner size={5} />
          ) : (
            <>
              {" "}
              <LogOut size={18} />
              <span>Sign-out</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <div className="space-y-2 w-full">
          <label
            htmlFor="email"
            className="flex flex-row gap-2 text-[14px] font-normal"
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
            htmlFor="password"
            className="flex flex-row gap-2 text-[14px] font-normal"
          >
            <Lock size={20} /> Password
          </label>
          <Input
            disabled={true}
            id="password"
            name="password"
            type="password"
            placeholder="Type here..."
            className={`w-full text-xl shadow-sm min-h-[44px] bg-[#FAFDFF] border ${
              form.password.length > 0 ? `border-[#737c7f]` : `border-[#C0CED4]`
            } px-[16px] py-[12px]`}
            value={"••••••••"}
            onChange={handleOnChange}
          />
          <button
            onClick={handleChangePassword}
            className="w-full flex justify-end"
          >
            <span className="font-normal text-[14px] text-[#221AE9] underline">
              Change Password
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <div className="space-y-2 w-full">
          <label
            htmlFor="username"
            className="flex flex-row gap-2 text-[14px] font-normal"
          >
            <Image
              src="/icons/hero-section.png"
              alt="chess"
              width={100}
              height={100}
              className="w-[16px] h-[20px] relative z-10"
              priority
            />{" "}
            Default Chess.com Username
          </label>
          <Input
            disabled={true}
            id="username"
            name="defaultUsername"
            type="text"
            placeholder="Type here..."
            className={`w-full shadow-sm min-h-[44px] bg-[#C0CED4] border ${
              form.defaultUsername.length > 0
                ? `border-[#737c7f]`
                : `border-[#C0CED4]`
            } px-[16px] py-[12px]`}
            value={form.defaultUsername}
            onChange={handleOnChange}
          />
        </div>
        <div className="space-y-2 w-full">
          <label
            htmlFor="gameType"
            className="flex flex-row gap-2 text-[14px] font-normal"
          >
            Game Type
          </label>
          <Select
            value={selectedGameType || ""}
            onValueChange={handleGameTypeChange}
            disabled={isUpdatingGameType || gameTypesData.length === 0}
          >
            <SelectTrigger
              className={`w-full shadow-sm min-h-[44px] bg-[#FAFDFF] border ${
                selectedGameType ? `border-[#737c7f]` : `border-[#C0CED4]`
              } px-[16px] py-[12px] ${isUpdatingGameType ? "opacity-50" : ""}`}
            >
              <SelectValue
                placeholder={
                  gameTypesData.length > 0 ? "Select Game Type" : "Loading..."
                }
              />
            </SelectTrigger>
            <SelectContent>
              {gameTypesData.map((gameData) => (
                <SelectItem key={gameData.game_type} value={gameData.game_type}>
                  {gameData.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-x-1 text-blue-base mt-1">
            <Info className="w-3 h-3 flex-shrink-0 -mt-0.5" />
            <p className="text-xs">
              Changing your Game Type will affect the Game History and Training
              Plan
            </p>
          </div>
        </div>
      </div>

      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />
    </div>
  );
};

export default MyAccount;

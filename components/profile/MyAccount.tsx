import { Lock, LogOut, Mail } from "lucide-react";
import Image from "next/image";
import { FC, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { usePgnStore } from "@/app/store/zustandStore";
import { usechangePassword } from "@/app/store/changePassword";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import useLocalStorage from "@/hooks/useLocalStorage";

const MyAccount = () => {
  const { user } = useAuth();
  const { getProfile, logOut } = useApiClient();
  const { open, setOpen } = usechangePassword();
  const { profile, setProfile } = useProfileStore();
  const router = useRouter();
  const [sessionId, setToken] = useLocalStorage<string>("token", "");
  const { username, setUsername } = usePgnStore();
  const [form, setForm] = useState<any>({
    email: profile.email ?? "",
    defaultUsername: username,
    password: "",
  });
  useEffect(() => {
    getProfile({}).then((response) => {
      let data = response.data;
      console.log("getProfile", data);
      setProfile(data);
      setUsername(data.username);
    });
  }, []);
  const handleOnChange = (e: any) => {
    console.log("handleOnChange", e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangePassword = () => {
    router.push("/change-password");
  };
  const handleSignOut = async () => {
    logOut({ sessionId }).then(() => {
      localStorage.removeItem("token");
      document.cookie = `token=; path=/`;
      router.push("/login");
    });
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      throw error;
    }
  };
  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1">
        <span className="text-[18px] font-semibold">My Account</span>
        <button
          onClick={handleSignOut}
          className="btn-danger rounded-full flex flex-row items-center justify-center w-[160px] h-[44px] p-[10px] gap-1"
        >
          <LogOut size={18} />
          <span>Sign-out</span>
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
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
            htmlFor="email"
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
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
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
            className={`w-full shadow-sm min-h-[44px] bg-[#FAFDFF] border ${
              form.password.length > 0 ? `border-[#737c7f]` : `border-[#C0CED4]`
            } px-[16px] py-[12px]`}
            value={form.password}
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
        <div className="space-y-2 w-full"></div>
      </div>
    </div>
  );
};

export default MyAccount;

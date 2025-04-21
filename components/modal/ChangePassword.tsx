"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Lock, Mail, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { subjectForm } from "@/app/store/constants";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { usechangePassword } from "@/app/store/changePassword";

export function ChangePassword() {
  const router = useRouter();
  const { open, setOpen } = usechangePassword();
  const [status, setStatus] = useState(""); //sent, onchange
  const [form, setForm] = useState<any>({
    newPassword: "",
    confirmPassword: "",
    email: "",
  });
  const handleOnChange = (e: any) => {
    console.log("handleOnChange", e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleSendEmail = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setStatus("sent");
  };
  const handleSavePassword = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-[16px] max-w-sm sm:max-w-[640px] bg-white max-h-[90%]">
        <DialogHeader className="flex flex-col justify-center items-center z-20">
          <DialogTitle>
            <span className="font-medium text-[18px]">Change Password</span>
          </DialogTitle>
          <DialogDescription>
            <span className="font-normal text-[14px] ">
              Enter your Email Address and get a link to reset your Password.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center z-20 gap-4 overflow-auto p-2 pt-0 lg:p-[32px]:pt-0 ">
          {status == "" && (
            <>
              <div className="space-y-2 w-full">
                <label
                  htmlFor="email"
                  className="flex flex-row gap-2 text-[14px] font-medium"
                >
                  <Mail size={20} /> Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your Email Address"
                  className={`w-full shadow-sm min-h-[44px] bg-[#F2FBFE] border ${
                    form.email.length > 0
                      ? `border-[#2E3133]`
                      : `border-[#C0CED4]`
                  } px-[16px] py-[12px]`}
                  value={form.email}
                  onChange={handleOnChange}
                />
              </div>
              <button
                onClick={handleSendEmail}
                className="mt-2 btn-primary rounded-full min-h-[48px] min-w-[333px] flex flex-row items-center justify-center gap-2"
              >
                <span className="text-[8px] sm:text-[11px] lg:text-[16px]">
                  Send Email
                </span>
              </button>
            </>
          )}
          {status == "onchange" && (
            <>
              <div className="space-y-2 w-full">
                <label
                  htmlFor="newPassword"
                  className="flex flex-row gap-2 text-[14px] font-medium"
                >
                  <Lock size={20} /> New Password
                </label>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  placeholder="Enter your new Password"
                  className={`w-full shadow-sm min-h-[44px] bg-[#F2FBFE] border ${
                    form.newPassword.length > 0
                      ? `border-[#2E3133]`
                      : `border-[#C0CED4]`
                  } px-[16px] py-[12px]`}
                  value={form.newPassword}
                  onChange={handleOnChange}
                />
              </div>
              <div className="space-y-2 w-full">
                <label
                  htmlFor="confirmPassword"
                  className="flex flex-row gap-2 text-[14px] font-medium"
                >
                  <Lock size={20} /> Confirm Password
                </label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your new Password"
                  className={`w-full shadow-sm min-h-[44px] bg-[#F2FBFE] border ${
                    form.confirmPassword.length > 0
                      ? `border-[#2E3133]`
                      : `border-[#C0CED4]`
                  } px-[16px] py-[12px]`}
                  value={form.confirmPassword}
                  onChange={handleOnChange}
                />
              </div>
              <button
                onClick={handleSavePassword}
                className="mt-2 btn-primary rounded-full min-h-[48px] min-w-[333px] flex flex-row items-center justify-center gap-2"
              >
                <span className="text-[8px] sm:text-[11px] lg:text-[16px]">
                  Save Password
                </span>
              </button>
            </>
          )}
          {status == "sent" && (
            <>
              <div className="space-y-2 my-2 w-full flex flex-col items-center justify-center px-[32px]">
                <Image
                  alt="email-sent"
                  src="/icons/email-sent.png"
                  width={188}
                  height={160}
                />
                <span className="block font-normal text-[18px] text-center">
                  We have sent you a Link to reset your Password. Please check
                  your Inbox and Spam Folder.
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="btn-primary rounded-full min-h-[48px] min-w-[333px] flex flex-row items-center justify-center gap-2"
              >
                <span className="text-[8px] sm:text-[11px] lg:text-[16px]">
                  Back to Profile
                </span>
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

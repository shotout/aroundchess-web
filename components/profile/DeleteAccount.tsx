import React, { useState } from "react";
import { Info, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DeleteAccount = () => {
  const route = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteAccount = () => {
    route.push("/delete-account");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1"></div>

      {/* Info box with fixed background opacity */}
      <div className="flex border border-blue-500 bg-blue-50 bg-opacity-8 rounded-md p-3 items-center gap-x-2">
        <Info className="w-5 h-5 text-blue-500" />
        <h1 className="text-[13px] text-gray-700">
          Please note that account deletion is permanent and cannot be undone.
          Once your account is deleted, all of your data, activity history,
          preferences, and Tokens cannot be recovered. Please make sure you are
          absolutely certain before proceeding.
        </h1>
      </div>

      <div className="flex justify-center items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="rounded-full border border-[#C01B1B] px-16 py-2 hover:bg-red-50 transition-colors">
              <h1 className="text-[#C01B1B] font-medium">Delete Account</h1>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader className="text-center">
              {/* Chess knight icon with red X */}
              <div className="flex justify-center mb-4">
                <Image
                  src={"/images/delete-knight.png"}
                  alt=""
                  width={100}
                  height={100}
                />
              </div>

              <DialogTitle className="text-xl font-semibold text-gray-900">
                Are you sure you want to delete your account?
              </DialogTitle>

              <DialogDescription className="text-gray-600 mt-2">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {/* Warning info box inside modal */}
            <div className="flex border border-blue-500 bg-blue-50 rounded-md p-3 items-center gap-x-2 my-4">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700">
                Please note that account deletion is{" "}
                <strong>permanent and cannot be undone</strong>. Once your
                account is deleted, all of your data, activity history,
                preferences, and Tokens cannot be recovered. Please make sure
                you are absolutely certain before proceeding.
              </p>
            </div>

            <DialogFooter className="flex gap-3 sm:gap-3">
              <button
                className="flex-1 border border-red-600 text-red-600 bg-white hover:bg-red-50 px-4 py-2 rounded-full transition-colors"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
              <button
                className="flex-1 bg-red-600 text-white hover:bg-red-700 border-red-600 px-4 py-2 rounded-full transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeleteAccount;

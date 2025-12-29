import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useProfileStore } from "@/app/store/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DotSpinner from "../game-history/Spinner";
import WhiteSpinner from "../SpinnerWhite";

const baseUrl = process.env.BASE_URL;

const ChangePasswordDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { sessionId } = useProfileStore();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!form.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!form.newPassword) {
      setError("New password is required");
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}/auth/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          newPassword: form.newPassword,
        }),
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData?.message || "Failed to update password");
      }
    } catch (err) {
      const errorMessage =
        (err as any).response?.data?.message ||
        (err instanceof Error ? err.message : "An error occurred");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl rounded-lg p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold text-center">
            Change your Password
          </DialogTitle>
          <p className="text-center text-[14px] --xs text-muted-foreground">
            Enter a new Password to login to AroundChess
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-[14px] --sm font-medium leading-none flex items-center gap-2">
              <Lock size={14} /> Current Password
            </label>
            <div className="relative">
              <Input
                name="currentPassword"
                type={passwordVisibility.current ? "text" : "password"}
                placeholder="Enter your Current Password"
                className="pr-10 bg-[#F2FBFE]" // Add padding for the eye icon
                value={form.currentPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2  transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {passwordVisibility.current ? (
                  <EyeOff size={18} className="text-blue-base" />
                ) : (
                  <Eye size={18} className="text-blue-base" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-[14px] --sm font-medium leading-none flex items-center gap-2">
              <Lock size={14} /> New Password
            </label>
            <div className="relative">
              <Input
                name="newPassword"
                type={passwordVisibility.new ? "text" : "password"}
                placeholder="Enter your new Password"
                className="pr-10 bg-[#F2FBFE]"
                value={form.newPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {passwordVisibility.new ? (
                  <EyeOff size={18} className="text-blue-base" />
                ) : (
                  <Eye size={18} className="text-blue-base" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[14px] --sm font-medium leading-none flex items-center gap-2">
              <Lock size={14} /> Confirm Password
            </label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={passwordVisibility.confirm ? "text" : "password"}
                placeholder="Confirm your new Password"
                className="pr-10 bg-[#F2FBFE]"
                value={form.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {passwordVisibility.confirm ? (
                  <EyeOff size={18} className="text-blue-base" />
                ) : (
                  <Eye size={18} className="text-blue-base" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-[14px] --sm text-destructive font-medium">{error}</div>
          )}

          {success && (
            <div className="text-[14px] --sm text-green-600 font-medium">
              Password changed successfully!
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full btn-primary rounded-full font-medium py-2 px-4 transition-colors h-10 flex items-center justify-center"
          >
            {isLoading ? <WhiteSpinner size={10} /> : "Save Password"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;

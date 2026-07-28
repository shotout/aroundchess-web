import { create } from "zustand";

/**
 * Drives the 3-step change-password flow, which spans a navigation:
 *   /profile  modal "Change Password"     (step "email")
 *      -> /change-password/verify page    (OTP)
 *   /profile  modal "Change your Password" (step "password")
 *
 * The verified email/token are held here so the final step can call
 * /auth/set-new-password after coming back. Client-side navigation keeps this
 * store alive; a hard reload drops it, and the guard on the verify page sends
 * the user back to step one.
 */
interface changePasswordState {
  open: boolean;
  setOpen: (open: any) => void;
  /** Which modal state /profile should show when `open`. */
  step: "email" | "password";
  setStep: (step: "email" | "password") => void;
  /** Address the reset code was sent to. */
  email: string;
  setEmail: (email: string) => void;
  /** OTP confirmed by /auth/verify-token-reset-password. */
  token: string;
  setToken: (token: string) => void;
  /** Back to a clean step-one state. */
  reset: () => void;
}

export const usechangePassword = create<changePasswordState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  step: "email",
  setStep: (step) => set({ step }),
  email: "",
  setEmail: (email) => set({ email }),
  token: "",
  setToken: (token) => set({ token }),
  reset: () => set({ open: false, step: "email", email: "", token: "" }),
}));

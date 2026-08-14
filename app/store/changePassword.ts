import { create } from "zustand";

interface changePasswordState {
  open: boolean;
  setOpen: (open: any) => void;
  step: "email" | "password";
  setStep: (step: "email" | "password") => void;
  email: string;
  setEmail: (email: string) => void;
  token: string;
  setToken: (token: string) => void;
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

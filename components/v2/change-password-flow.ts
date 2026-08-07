
export const VERIFY_ROUTE = "/change-password/verify";

export const OTP_LENGTH = 6;

export const RESEND_COOLDOWN_SECONDS = 40;

export interface PasswordCondition {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}

export const PASSWORD_CONDITIONS: PasswordCondition[] = [
  {
    id: "minLength",
    text: "Minimum 8 characters",
    validator: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    text: "At least 1 uppercase letter (A-Z)",
    validator: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    text: "At least 1 number (0-9)",
    validator: (password) => /\d/.test(password),
  },
  {
    id: "lowercase",
    text: "At least 1 lowercase letter (a-z)",
    validator: (password) => /[a-z]/.test(password),
  },
];

/** Shared bits of the change-password flow, used by both the /profile modal
 *  and the OTP verification page so the rules can't drift apart. */

/** Where step 1 hands off to collect the emailed code. */
export const VERIFY_ROUTE = "/change-password/verify";

/** Length of the code sent by /auth/reset-password. */
export const OTP_LENGTH = 6;

/** Seconds before "Resend code" becomes available again. */
export const RESEND_COOLDOWN_SECONDS = 40;

export interface PasswordCondition {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}

/** Same four rules the /forgot-password page enforces. */
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

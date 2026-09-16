// Internal Next.js API routes — auth (login/logout) is handled separately by
// NextAuth's own signIn()/signOut() helpers, not through this client.
export const baseURL = "/api";

export const endpoints = {
  REGISTER: "/register",
  SKIN_ANALYSIS: "/analysis/skin",
  HAIR_ANALYSIS: "/analysis/hair",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

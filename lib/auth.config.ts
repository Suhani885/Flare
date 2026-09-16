import type { NextAuthConfig } from "next-auth";

const VALID_AUDIENCES = ["WOMEN", "MEN", "UNISEX"];

const THIRTY_DAYS = 30 * 24 * 60 * 60;

export const authConfig: NextAuthConfig = {
  // 30 days is the persistent ("remember me") duration. When a user leaves
  // "remember me" unchecked, /api/auth/persist-session downgrades this same
  // cookie to a browser-session cookie right after sign-in — see
  // components/forms/login-form.tsx.
  session: { strategy: "jwt", maxAge: THIRTY_DAYS },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;
        token.audiencePreference = user.audiencePreference;
      }

      // Triggered by useSession().update(...) after a user changes their
      // theme preference. Only ever trust a value we recognize — this
      // payload comes from the client and must be treated as untrusted
      // input, not applied blindly to the token.
      if (trigger === "update" && session?.audiencePreference !== undefined) {
        token.audiencePreference = VALID_AUDIENCES.includes(session.audiencePreference)
          ? session.audiencePreference
          : null;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.subscriptionTier = token.subscriptionTier;
        session.user.audiencePreference = token.audiencePreference;
      }
      return session;
    },
  },
};

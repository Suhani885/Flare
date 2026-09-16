import type { NextAuthConfig } from "next-auth";

const VALID_AUDIENCES = ["WOMEN", "MEN", "UNISEX"];

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
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

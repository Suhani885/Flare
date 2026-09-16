import type { Role, Tier, Audience } from "@/lib/generated/prisma/enums";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: Role;
    subscriptionTier: Tier;
    audiencePreference: Audience | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      subscriptionTier: Tier;
      audiencePreference: Audience | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    subscriptionTier: Tier;
    audiencePreference: Audience | null;
  }
}

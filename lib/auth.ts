import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { authConfig } from "@/lib/auth.config";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Precomputed bcrypt hash of a random string. Compared against on every
// failed lookup so authorize() takes roughly the same time whether or not
// the email exists — otherwise response timing would leak which emails are
// registered.
const DUMMY_PASSWORD_HASH =
  "$2b$12$sfPi/nfRtARCzqx18CSI1.rqQs7HteVHSoJ5caqLCW9OIsZMZwzR6";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const ip = getClientIp(request);

        // Rate-limit by email+IP so a single caller can't hammer one
        // account's password (or the DB) indefinitely.
        const attempt = rateLimit(`login:${email.toLowerCase()}:${ip}`, 5, 15 * 60 * 1000);
        if (!attempt.allowed) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        const isValidPassword = await bcrypt.compare(
          password,
          user?.password ?? DUMMY_PASSWORD_HASH
        );

        if (!user || !user.password || !isValidPassword) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Auth.js only auto-links an OAuth sign-in to an existing account
      // when this is explicitly enabled. Leaving it off (the default) is
      // the safe choice: someone can't take over an existing email/password
      // account just by signing in with Google using the same address.
      allowDangerousEmailAccountLinking: false,
    }),
  ],
});

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.RESEND_FROM_EMAIL ?? "Flare <onboarding@resend.dev>";

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  // Always log — cheap fallback and useful during local dev regardless of
  // whether a real provider is configured.
  console.log(`Password reset link for ${email}: ${resetLink}`);

  if (!resend) {
    console.warn(
      "RESEND_API_KEY not set — password reset email was only logged, not sent. See .env.example."
    );
    return { sent: false };
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your Flare password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #292524;">Reset your password</h2>
        <p style="color: #57534e; line-height: 1.6;">
          Someone requested a password reset for your Flare account. If this
          was you, click the button below to choose a new password. This
          link expires in 1 hour.
        </p>
        <a href="${resetLink}"
           style="display: inline-block; margin: 24px 0; padding: 12px 28px;
                  background: #db2d6e; color: #ffffff; text-decoration: none;
                  border-radius: 999px; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #a8a29e; font-size: 13px;">
          If you didn't request this, you can safely ignore this email —
          your password won't be changed.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return { sent: false };
  }

  return { sent: true };
}

import { Resend } from "resend";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

const getBaseUrl = () => {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
};

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
};

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY is missing. Email was not sent.");
    return { sent: false, reason: "missing_resend_key" };
  }

  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("Resend email accepted:", {
      to,
      subject,
      id: response?.data?.id,
    });

    return { sent: true, id: response?.data?.id };
  } catch (error) {
    console.error("Resend email failed:", { to, subject, error });
    return { sent: false, reason: "resend_send_failed" };
  }
};

export const sendVerificationEmail = async (email: string, rawToken: string) => {
  const verificationUrl = `${getBaseUrl()}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(email)}`;

  return sendEmail({
    to: email,
    subject: "Verify your Vogueish account",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
        <h2>Verify your email</h2>
        <p>Click the button below to verify your Vogueish account.</p>
        <p>
          <a href="${verificationUrl}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
            Verify email
          </a>
        </p>
        <p>This link expires in 30 minutes.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, rawToken: string) => {
  const resetUrl = `${getBaseUrl()}/api/auth/reset-password?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(email)}`;

  return sendEmail({
    to: email,
    subject: "Reset your Vogueish password",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
        <h2>Password reset request</h2>
        <p>Click the button below to set a new password for your Vogueish account.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
            Reset password
          </a>
        </p>
        <p>This link expires in 30 minutes.</p>
      </div>
    `,
  });
};

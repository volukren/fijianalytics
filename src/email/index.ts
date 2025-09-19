import type { ReactElement } from "react";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendEmail = async ({
  to,
  from,
  subject,
  react,
}: {
  to: string;
  subject: string;
  from?: string;
  react: ReactElement;
}) => {
  if (!resend) {
    console.info(
      "RESEND_API_KEY is not set in the .env. Skipping sending email.",
    );
    return;
  }

  const { data, error } = await resend.emails.send({
    to: to,
    from: from || "Fiji Analytics <system@fijianalytics.com>",
    replyTo: "support@fijianalytics.com",
    subject: subject,
    react: react,
  });

  if (error) {
    console.error(
      `Resend returned error when sending email: ${error.name} ${error.message}`,
    );
    // todo: notify
    throw error;
  }

  return data;
};

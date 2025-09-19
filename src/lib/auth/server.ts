import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, organization } from "better-auth/plugins";
import { sendEmail } from "@/email";
import LoginLink from "@/email/templates/login-link";
import { prisma } from "../prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
    magicLink({
      sendMagicLink: async ({ email, url, token }, request) => {
        await sendEmail({
          to: email,
          subject: `Welcome to Fiji Analytics`,
          react: LoginLink(url),
        });
      },
    }),
  ],
});

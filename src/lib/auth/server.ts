import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, organization } from "better-auth/plugins";
import { sendEmail } from "@/email";
import DeleteAccountVerification from "@/email/templates/delete-account";
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
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Confirm Account Deletion - Fiji Analytics",
          react: DeleteAccountVerification(url),
        });
      },
      afterDelete: async (user, request) => {
        try {
          const result = await prisma.organization.deleteMany({
            where: {
              members: {
                none: {},
              },
            },
          });

          console.log(
            `Deleted ${result.count} empty organizations after user ${user.id} account deletion`
          );
        } catch (error) {
          console.error(
            "Failed to clean up members after user deletion: ",
            error
          );
          // todo: alert admins
        }
      },
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

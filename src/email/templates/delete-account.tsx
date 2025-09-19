import {
  Body,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function DeleteAccountVerification(url: string) {
  return (
    <Html>
      <Head />
      <Preview>Confirm Account Deletion - Fiji Analytics</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Heading className="text-xl font-medium text-red-600">
            Account Deletion Request
          </Heading>
          <Text className="text-sm">
            We received a request to delete your Fiji Analytics account.
          </Text>
          <Section className="rounded-lg p-4 my-4">
            <Text className="text-sm font-semibold text-red-900">
              ⚠️ Warning: This action is permanent
            </Text>
            <Text className="text-sm text-red-800">
              Deleting your account will permanently remove:
            </Text>
            <ul className="text-sm text-red-800 mt-2">
              <li>• All your personal data</li>
              <li>• Access to all organizations</li>
              <li>• All analytics data you own</li>
              <li>• Your account settings and preferences</li>
            </ul>
            <Text className="text-sm text-red-800 font-semibold mt-2">
              This action cannot be undone.
            </Text>
          </Section>
          <Text className="text-sm">
            If you want to proceed with deleting your account, click the button
            below:
          </Text>
          <Section className="my-8">
            <Link
              className="rounded-lg bg-red-600 px-6 py-3 text-white no-underline"
              href={url}
            >
              Confirm Account Deletion
            </Link>
          </Section>
          <Text className="text-sm text-gray-600">
            If you didn't request this, please ignore this email. Your account
            will remain safe.
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}

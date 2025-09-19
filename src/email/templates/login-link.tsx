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

export default function LoginLink(url: string) {
  return (
    <Html>
      <Head />
      <Preview>Your Fiji Analytics Login Link</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Heading className="text-xl font-medium">Your Login Link</Heading>
          <Text className="text-sm">Welcome to Fiji Analytics</Text>
          <Text className="text-sm">
            Please click the magic link below to sign in to your account.
          </Text>
          <Section className="my-8">
            <Link
              className="rounded-lg bg-black px-6 py-3 text-white no-underline"
              href={url}
            >
              Sign in
            </Link>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}

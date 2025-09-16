import type { Metadata } from "next";
import Link from "next/link";
import GoogleSignInButton from "@/components/auth/google-signin-button";
import SignInForm from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Sign In - Fiji Analytics",
};

export default async function SignInPage() {
  return (
    <div className="space-y-4">
      <GoogleSignInButton />
      <div className="flex items-center gap-2">
        <div className="border-b border-gray-300 flex-1" />
        <div className="text-gray-500">OR</div>
        <div className="border-b border-gray-300 flex-1" />
      </div>
      <SignInForm />
      <div className="text-center text-sm">
        <span className="text-gray-500">Don't have an account? </span>
        <Link href="/signup" className="text-blue-600 underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}

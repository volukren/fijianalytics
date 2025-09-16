import type { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up - Fiji Analytics",
};

export default async function SignUpPage() {
  return (
    <div className="space-y-4">
      <SignUpForm />
      <div className="text-center text-sm">
        <span className="text-gray-500">Already have an account? </span>
        <Link href="/signin" className="text-blue-600 underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

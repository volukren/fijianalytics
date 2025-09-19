import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: `Login to Fiji Analytics`,
};

export default function LoginPage() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="font-bold text-2xl">Welcome to Fiji Analytics</h1>
      </div>
      <LoginForm />
    </div>
  );
}

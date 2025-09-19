import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Goodbye - Fiji Analytics",
  description: "Your account has been successfully deleted",
};

export default function GoodbyePage() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center shadow-none">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 text-6xl">😢</div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              We're sorry to see you go
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-gray-600">
              <p className="text-lg">
                Your Fiji Analytics account has been successfully deleted.
              </p>
              <p>
                We're genuinely sorry to see you leave. Your data meant a lot to
                us, and we'll miss having you as part of our community.
              </p>
              <p className="text-sm font-medium">
                We hope our paths will cross again in the future. 💙
              </p>
            </div>

            <div className="pt-6 border-t">
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  If you change your mind, you're always welcome to create a new
                  account.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href="/">Return to Homepage</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Link href="/login">Create New Account</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 text-xs text-gray-400">
              <p>
                Thank you for being part of Fiji Analytics.
                <br />
                We'll miss you! 🌊
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

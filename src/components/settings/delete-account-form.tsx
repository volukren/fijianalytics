"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/client";

export default function DeleteAccountForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      await authClient.deleteUser({
        callbackURL: "/goodbye",
      });

      toast.success(
        "Account deletion request sent. Please check your email to confirm.",
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to request account deletion. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="border-red-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-red-600">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800 font-medium mb-2">
              ⚠️ This action is permanent and cannot be undone
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• All your personal data will be deleted</li>
              <li>• You will lose access to all organizations</li>
              <li>• All analytics data you own will be removed</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-red-200">
          <span className="text-sm text-red-600">
            This requires email confirmation
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="pt-3">
              Are you absolutely sure you want to delete your account? This
              action is permanent and cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 my-2">
            <p className="text-sm text-red-800">
              We will send you an email to confirm this action. You must click
              the link in the email to complete the account deletion process.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Sending email..." : "Send Confirmation Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

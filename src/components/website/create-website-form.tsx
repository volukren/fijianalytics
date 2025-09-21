"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { createWebsiteAction } from "@/lib/actions/website/create-website";
import { authClient } from "@/lib/auth/client";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CreateWebsiteForm() {
  const [domain, setDomain] = useState("");
  const [showScriptInstructions, setShowScriptInstructions] = useState(false);
  const [addedDomain, setAddedDomain] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const router = useRouter();

  const { executeAsync, isPending } = useAction(createWebsiteAction, {
    onSuccess: () => {
      toast.success("Website added successfully");
      setAddedDomain(domain);
      setShowScriptInstructions(true);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Failed to add website");
    },
  });

  const handleCopyScript = () => {
    const scriptUrl = `${window.location.origin}/script.js`;
    const scriptTag = `<script defer data-domain="${addedDomain}" src="${scriptUrl}"></script>`;
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Script copied to clipboard");
  };

  const handleGoToWebsites = () => {
    router.push('/websites');
  };

  if (!activeOrganization) {
    return <div>No active organization</div>;
  }

  if (showScriptInstructions) {
    const scriptUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/script.js`;
    const scriptTag = `<script defer data-domain="${addedDomain}" src="${scriptUrl}"></script>`;

    return (
      <div className="grid gap-4 max-w-2xl mx-auto">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Website Added Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Copy this tracking script and add it to the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">&lt;head&gt;</code> section of your website:
              </p>
            </div>
            <div className="relative">
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 pr-12 overflow-x-auto">
                <code className="text-xs text-gray-800">{scriptTag}</code>
              </pre>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleCopyScript}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              <p>The tracking script will:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Track page views automatically</li>
                <li>Respect user privacy</li>
                <li>Work with single-page applications</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGoToWebsites} className="w-full cursor-pointer">
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        executeAsync({
          domain: domain,
          organizationId: activeOrganization.id,
        });
      }}
      className="grid gap-4 max-w-2xl mx-auto"
    >
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Add a new website</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="domain">
              Domain <span className="text-red-600">*</span>
            </Label>
            <Input
              id="domain"
              name="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="google.com"
              required
              disabled={isPending}
            />
            <p className="text-xs text-gray-500">
              Only the domain, without https
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full cursor-pointer">
            Add website
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

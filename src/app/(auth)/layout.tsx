import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Button asChild variant="ghost" className="absolute left-5 top-5">
        <Link href="/">
          <ArrowLeftIcon size={15} />
          Home
        </Link>
      </Button>
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-2xl text-center text-gray-700">
              Welcome to Fiji Analytics
            </h1>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

import type React from "react";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="px-5 py-3 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto">
          <Header />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-5 py-10">{children}</div>
    </>
  );
}

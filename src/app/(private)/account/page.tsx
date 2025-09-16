import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <>
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Account Settings</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:hidden col-span-1"></div>
        <div className="col-span-4"></div>
      </div>
    </>
  );
}

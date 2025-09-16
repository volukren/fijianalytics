import PrivateHeader from "@/components/private-header";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="px-5 py-3 border-b border-gray-200">
        <PrivateHeader organizations={[]} />
      </div>
      <div className="max-w-7xl mx-auto px-5 py-10">{children}</div>
    </>
  );
}

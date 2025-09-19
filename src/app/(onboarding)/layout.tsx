export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="w-full max-w-md space-y-6 text-center">{children}</div>
    </div>
  );
}

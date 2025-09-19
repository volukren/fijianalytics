import AppSidebar from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-3">
        <div className="sticky top-0 left-0 w-full flex items-center">
          <SidebarTrigger />
        </div>
        <div className="flex-1 px-5 py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

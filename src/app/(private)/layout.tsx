import AppSidebar from "@/components/app-sidebar";
import Breadcrumbs from "@/components/breadcrumbs";
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
        <div className="sticky top-0 left-0 w-full flex items-center gap-4">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border" />
          <Breadcrumbs />
        </div>
        <div className="flex-1 px-5 py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

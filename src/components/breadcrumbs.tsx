"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;

    return { href, segment, isLast };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem key={item.href}>
              {item.isLast ? (
                <BreadcrumbPage>{item.segment}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.segment}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

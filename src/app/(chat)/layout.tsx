import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieStore] = await Promise.all([cookies()]);
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";
  return (
    <>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className="absolute left-2 top-2 z-50 size-9" />
          <ThemeToggle />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

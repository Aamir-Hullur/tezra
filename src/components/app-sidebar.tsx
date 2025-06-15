"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronsUpDown, PlusIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-lg font-semibold px-2 rounded-md cursor-pointer">
              Tezra
            </span>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  onClick={() => {
                    setOpenMobile(false);
                  }}
                  className="flex flex-row gap-3 w-full items-center"
                >
                  <Button
                    variant="default"
                    type="button"
                    className="p-2 h-fit w-full cursor-pointer"
                    onClick={() => {
                      setOpenMobile(false);
                      router.push("/");
                      router.refresh();
                    }}
                  >
                    <PlusIcon size={16} />
                    New Chat
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                className="bg-accent text-accent-foreground"
                sideOffset={4}
              >
                <p>CMD + O</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenuButton className="w-full justify-between gap-3 h-12">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 rounded-md" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">
                  john@example.com
                </span>
              </div>
            </div>
            <ChevronsUpDown className="h-5 w-5 rounded-md" />
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}

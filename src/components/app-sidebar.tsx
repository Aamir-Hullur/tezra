"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
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
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 rounded-md cursor-pointer">
                Tezra
              </span>
            </Link>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
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
      <SidebarFooter />
    </Sidebar>
  );
}

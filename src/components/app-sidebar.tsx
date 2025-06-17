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
import {
  ArrowBigUp,
  ChevronsUpDown,
  Command,
  PlusIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import React, { memo, useCallback } from "react";
import { useRef } from "react";
import { createHotkey, useGlobalHotkeys } from "@/hooks/use-global-hotkeys";

export const AppSidebar = memo(() => {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  const newChatBtnRef = useRef<HTMLButtonElement>(null);

  const handleLinkClick = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  const handleNewChat = useCallback(() => {
    setOpenMobile(false);
    router.push("/");
    router.refresh();
  }, [setOpenMobile, router]);

  useGlobalHotkeys([
    createHotkey("o", handleNewChat, {
      meta: true,
      shift: true,
      description: "New Chat",
    }),
    // Add more hotkeys here as needed
    // createHotkey('k', handleSearch, {
    //   meta: true,
    //   description: 'Search'
    // }),
  ]);

  return (
    <Sidebar>
      <SidebarHeader
        onFocusCapture={(e) => {
          e.stopPropagation();
        }}
      >
        <SidebarMenu>
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="cursor-pointer rounded-md px-2 text-lg font-semibold">
              Tezra
            </span>
            <Link
              href="/"
              onClick={handleLinkClick}
              className="flex w-full flex-row items-center gap-3"
            >
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <Button
                    ref={newChatBtnRef}
                    variant="default"
                    type="button"
                    className="h-fit w-full cursor-pointer p-2"
                    onClick={handleNewChat}
                  >
                    <PlusIcon size={16} />
                    New Chat
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  className="bg-accent/50 text-accent-foreground m-0 rounded-[10px] px-2 py-1 text-xs"
                  sideOffset={5}
                >
                  <span className="flex items-center gap-1">
                    <Command className="text-primary h-4 w-4" />
                    <ArrowBigUp className="text-primary h-5 w-5" />
                    <span className="text-primary text-lg font-medium">O</span>
                  </span>
                </TooltipContent>
              </Tooltip>
            </Link>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenuButton className="h-12 w-full justify-between gap-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 rounded-md" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-muted-foreground text-xs">
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
});

AppSidebar.displayName = "AppSidebar";

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
import { useEffect, useRef } from "react";

export const AppSidebar = memo(() => {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  // Extract the Link onClick callback
  const handleLinkClick = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  // Wrap handleNewChat with useCallback
  const handleNewChat = useCallback(() => {
    setOpenMobile(false);
    router.push("/");
    router.refresh();
  }, [setOpenMobile, router]);

  return (
    <Sidebar>
      <SidebarHeader
        onFocusCapture={(e) => {
          e.stopPropagation();
        }}
      >
        <SidebarMenu>
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-lg font-semibold px-2 rounded-md cursor-pointer">
              Tezra
            </span>

            {(() => {
              // Ref for the button
              const newChatBtnRef = useRef<HTMLButtonElement>(null);

              // Register global hotkey
              useEffect(() => {
                const onKeyDown = (e: KeyboardEvent) => {
                  // Cmd+Shift+O (Mac) or Ctrl+Shift+O (Win)
                  const isCmd = navigator.platform.includes("Mac")
                    ? e.metaKey
                    : e.ctrlKey;
                  if (isCmd && e.shiftKey && (e.key === "o" || e.key === "O")) {
                    e.preventDefault();
                    // Prefer calling the handler directly for SPA navigation
                    handleNewChat();
                  }
                };
                window.addEventListener("keydown", onKeyDown);
                return () => window.removeEventListener("keydown", onKeyDown);
              }, []);

              return (
                <Link
                  href="/"
                  onClick={handleLinkClick}
                  className="flex flex-row gap-3 w-full items-center"
                >
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                      <Button
                        ref={newChatBtnRef}
                        variant="default"
                        type="button"
                        className="p-2 h-fit w-full cursor-pointer"
                        onClick={handleNewChat}
                      >
                        <PlusIcon size={16} />
                        New Chat
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="bg-accent/50 text-accent-foreground px-2 py-1 m-0 rounded-[10px] text-xs"
                      sideOffset={5}
                    >
                      <span className="flex items-center gap-1">
                        <Command className="w-4 h-4 text-primary" />
                        <ArrowBigUp className="w-5 h-5 text-primary" />
                        <span className="text-lg text-primary font-medium">
                          O
                        </span>
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              );
            })()}
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
});

AppSidebar.displayName = "AppSidebar";

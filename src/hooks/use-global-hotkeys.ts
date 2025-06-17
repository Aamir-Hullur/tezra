import { useEffect, useCallback } from "react";

export interface HotkeyConfig {
  key: string;
  modifiers: {
    ctrl?: boolean;
    cmd?: boolean;
    shift?: boolean;
    alt?: boolean;
  };
  handler: () => void;
  description?: string;
}

export const useGlobalHotkeys = (hotkeys: HotkeyConfig[]) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const hotkey of hotkeys) {
        const { key, modifiers, handler } = hotkey;

        const keyMatches = e.key.toLowerCase() === key.toLowerCase();

        // Only check modifier if it's explicitly set, otherwise ignore
        const shiftMatches =
          modifiers.shift === undefined
            ? true
            : e.shiftKey === !!modifiers.shift;
        const altMatches =
          modifiers.alt === undefined ? true : e.altKey === !!modifiers.alt;

        // Special handling for cmd/ctrl - if neither is specified, ignore both
        let cmdCtrlMatches = true;
        if (modifiers.cmd !== undefined || modifiers.ctrl !== undefined) {
          cmdCtrlMatches =
            (modifiers.cmd === undefined || e.metaKey === !!modifiers.cmd) &&
            (modifiers.ctrl === undefined || e.ctrlKey === !!modifiers.ctrl);
        }

        if (keyMatches && cmdCtrlMatches && shiftMatches && altMatches) {
          e.preventDefault();
          handler();
          break;
        }
      }
    },
    [hotkeys],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

// Utility function to detect platform
export const isMac = () => {
  return typeof navigator !== "undefined" && navigator.platform.includes("Mac");
};

// Helper function to create cross-platform hotkeys
export const createHotkey = (
  key: string,
  handler: () => void,
  options: {
    meta?: boolean; // Will use cmd on Mac, ctrl on others
    shift?: boolean;
    alt?: boolean;
    description?: string;
  } = {},
): HotkeyConfig => {
  return {
    key,
    modifiers: {
      cmd: options.meta ? isMac() : undefined,
      ctrl: options.meta ? !isMac() : undefined,
      shift: options.shift,
      alt: options.alt,
    },
    handler,
    description: options.description,
  };
};

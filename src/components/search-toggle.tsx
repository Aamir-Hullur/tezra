"use client";

import { memo, useCallback } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface SearchToggleProps {
  showSearch: boolean;
  onToggle: (value: boolean) => void;
}

export const SearchToggle = memo(
  ({ showSearch, onToggle }: SearchToggleProps) => {
    const handleToggle = useCallback(() => {
      onToggle(!showSearch);
    }, [showSearch, onToggle]);

    return (
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all",
          showSearch
            ? "bg-foreground/15 border-foreground text-foreground"
            : "text-muted-foreground hover:text-foreground border-transparent bg-transparent",
        )}
      >
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
          <motion.div
            animate={{
              rotate: showSearch ? 360 : 0,
              scale: showSearch ? 1.1 : 1,
            }}
            whileHover={{
              rotate: showSearch ? 360 : 15,
              scale: 1.1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 10,
              },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <Globe
              className={cn(
                "h-4 w-4",
                showSearch ? "text-[#1EAEDB]" : "text-inherit",
              )}
            />
          </motion.div>
        </div>
        <AnimatePresence>
          {showSearch && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 overflow-hidden text-xs whitespace-nowrap text-[#1EAEDB]"
            >
              Search
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  },
);

SearchToggle.displayName = "SearchToggle";

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
          "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
          showSearch
            ? "bg-foreground/15 border-foreground text-foreground"
            : "bg-transparent border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
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
                "w-4 h-4",
                showSearch ? "text-[#1EAEDB]" : "text-inherit"
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
              className="text-xs overflow-hidden whitespace-nowrap text-[#1EAEDB] flex-shrink-0"
            >
              Search
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }
);

SearchToggle.displayName = "SearchToggle";

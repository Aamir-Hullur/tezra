"use client";

import { useCallback } from "react";
import { handleError } from "@/lib/utils";

export function useErrorHandler() {
  const handleErrorWithToast = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      handleError(error, fallbackMessage);
    },
    [],
  );

  return { handleError: handleErrorWithToast };
}

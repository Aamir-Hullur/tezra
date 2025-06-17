import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { ChatSDKError, visibilityBySurface, type ErrorCode } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

// Client-side error handler with toast notifications
export function handleError(error: unknown, fallbackMessage?: string) {
  console.error("Error occurred:", error);

  if (error instanceof ChatSDKError) {
    // For client-side errors, show toast based on visibility settings
    const visibility = visibilityBySurface[error.surface];

    if (visibility === "response") {
      toast.error(error.message);
    } else if (visibility === "log") {
      toast.error(
        fallbackMessage || "Something went wrong. Please try again later.",
      );
    }
    return;
  }

  // Handle network/offline errors
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    toast.error("You're offline. Please check your internet connection.");
    return;
  }

  // Generic error fallback
  toast.error(
    fallbackMessage || "An unexpected error occurred. Please try again.",
  );
}

// Enhanced fetch with error handling and toast notifications
export async function fetchWithErrorHandling(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const { code, cause } = errorData;
      throw new ChatSDKError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new ChatSDKError("offline:chat");
    }
    throw error;
  }
}

// Wrapper for API calls with automatic error handling
export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  errorContext?: string,
): Promise<T> {
  try {
    return await apiFunction();
  } catch (error) {
    handleError(error, errorContext);
    throw error; // Re-throw so components can handle loading states
  }
}

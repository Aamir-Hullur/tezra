"use server";

import { generateUUID } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function createChatAction(formData: FormData) {
  const message = formData.get("message") as string;

  if (!message?.trim()) {
    return;
  }

  const chatId = generateUUID();

  // Store the initial message in a way that the chat page can access it
  redirect(`/chat/${chatId}?message=${encodeURIComponent(message)}`);
}

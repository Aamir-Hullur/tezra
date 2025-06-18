"use client";

import { useChat } from "@ai-sdk/react";
import { memo, useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Message } from "@ai-sdk/react";
import MainInput from "./main-input";
import { toast } from "sonner";
import { saveSelectedModel } from "@/lib/model-storage";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MessageListProps {
  messages: Message[];
  status: "submitted" | "streaming" | "ready" | "error";
}

const MessageList = memo(({ messages, status }: MessageListProps) => {
  return (
    <div className="z-10 flex w-full flex-col gap-6">
      {messages.map((m) => (
        <div key={m.id} className={`flex w-full justify-between`}>
          {m.role === "user" ? (
            <div className="flex-1 text-right">
              <span className="bg-primary text-primary-foreground inline-block rounded-lg px-4 py-2 whitespace-pre-wrap">
                {m.content}
              </span>
            </div>
          ) : (
            <div className="flex-1 text-left whitespace-pre-wrap">
              {m.content}
            </div>
          )}
        </div>
      ))}
      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && (
          <div className="flex-1 text-left">
            <div className="text-muted-foreground inline-flex items-center gap-1">
              <div className="flex gap-1">
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-current"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-current"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-current"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
    </div>
  );
});

MessageList.displayName = "MessageList";

interface ChatInputProps {
  chatId: string;
  initialMessages: Message[];
  initialModelData: modelData;
}

interface modelData {
  model: string;
  provider: string;
}

export default function ChatInput({
  chatId,
  initialMessages,
  initialModelData,
}: ChatInputProps) {
  const [currentModelData, setCurrentModelData] =
    useState<modelData>(initialModelData);
  const [isActiveConversation, setIsActiveConversation] = useState(false);

  const currentModelDataRef = useRef(currentModelData);

  const convexData = useQuery(api.chats.getByUuid, { uuid: chatId });
  const createChat = useMutation(api.chats.create);

  useEffect(() => {
    currentModelDataRef.current = currentModelData;
  }, [currentModelData]);

  const {
    messages,
    input,
    // setInput,
    handleSubmit,
    status,
    // stop,
    append,
    handleInputChange,
    error,
    setMessages,
  } = useChat({
    id: chatId,
    initialMessages,
    // Custom fetch: sends chat data to /api/chat/route.ts
    fetch: async (url, options) => {
      const body = JSON.parse(options?.body as string);
      const enhancedBody = {
        ...body,
        id: chatId,
        model: currentModelDataRef.current.model,
        provider: currentModelDataRef.current.provider,
      };

      // This POSTs to /api/chat/route.ts, which runs the AI and streams the response
      return fetch(url, {
        ...options,
        body: JSON.stringify(enhancedBody),
      });
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error("Failed to fetch chat history");
    },
  });

  // Track when conversation is active (submitting or streaming)
  useEffect(() => {
    const isActive = status === "submitted" || status === "streaming";
    setIsActiveConversation(isActive);
  }, [status]);

  // Sync messages from Convex to local state (with race condition protection)
  useEffect(() => {
    if (!convexData?.messages) return;

    const convexMessages = convexData.messages.map((msg) => ({
      id: msg.uuid,
      role: msg.role,
      content: msg.content,
      createdAt: new Date(msg.createdAt),
    }));

    // During active conversation, don't sync to avoid conflicts
    if (isActiveConversation) {
      return;
    }

    // Simple sync - always update unless actively processing
    setMessages(convexMessages);
  }, [convexData?.messages, setMessages, isActiveConversation]);

  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      append({
        role: "user",
        content: query,
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${chatId}`);
    }
  }, [query, append, hasAppendedQuery, chatId]);

  // Handles user submitting a message:
  // - Ensures chat exists in Convex
  // - Triggers AI response via /api/chat/route.ts (which will save both user and assistant messages)
  const handleSubmitWithRedirect = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement>,
      modelData: { model: string; provider: string },
    ) => {
      e.preventDefault();

      if (!input.trim()) return;

      window.history.replaceState({}, "", `/chat/${chatId}`);
      setCurrentModelData(modelData);
      currentModelDataRef.current = modelData;
      saveSelectedModel(modelData.model);

      // Ensure chat exists before submitting
      if (!convexData?.chat) {
        try {
          await createChat({
            uuid: chatId,
            title: input.slice(0, 50) + (input.length > 50 ? "..." : ""),
          });
        } catch (error) {
          console.error("Failed to create chat:", error);
          toast.error("Failed to create chat");
          return;
        }
      }

      // Let AI SDK handle the message flow and save to Convex via API route
      handleSubmit(e);
    },
    [input, handleSubmit, createChat, chatId, convexData?.chat],
  );
  console.log("messages", messages);
  console.log("error", error);
  return (
    <div className="relative mx-auto h-screen w-full max-w-3xl">
      <div className="mt-16 overflow-y-auto px-4 pb-48 sm:px-6 lg:px-8">
        <MessageList messages={messages} status={status} />
      </div>
      <div className="fixed bottom-0 z-10 mb-4 w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <MainInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmitWithRedirect}
          disabled={status === "submitted" || status === "streaming"}
          placeholder="Ask me anything..."
          status={status}
          currentModel={currentModelData.model}
        />
      </div>
      <div className="bg-background fixed bottom-0 z-0 h-8 w-full max-w-3xl" />
    </div>
  );
}

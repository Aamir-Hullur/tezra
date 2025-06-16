"use client";

import { useChat } from "@ai-sdk/react";
import { memo, useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Message } from "@ai-sdk/react";
import MainInput from "./main-input";
import { toast } from "sonner";

interface MessageListProps {
  messages: Message[];
  status: "submitted" | "streaming" | "ready" | "error";
}

const MessageList = memo(({ messages, status }: MessageListProps) => {
  return (
    <div className="flex flex-col gap-6 w-full z-10">
      {messages.map((m) => (
        <div key={m.id} className={`flex w-full justify-between`}>
          {m.role === "user" ? (
            <div className="flex-1 text-right">
              <span className="inline-block bg-primary text-primary-foreground rounded-lg px-4 py-2 whitespace-pre-wrap">
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
            <div className="inline-flex items-center gap-1 text-muted-foreground">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
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
}

export default function ChatInput({ chatId, initialMessages }: ChatInputProps) {
  // Use a ref to store the current model data
  const currentModelDataRef = useRef<{
    model: string;
    provider: string;
  }>({
    model: "gpt-4o",
    provider: "openai",
  });

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    append,
    handleInputChange,
    error,
  } = useChat({
    id: chatId,
    initialMessages,
    // Use a custom fetch function to include dynamic model data
    fetch: async (url, options) => {
      const body = JSON.parse(options?.body as string);
      const enhancedBody = {
        ...body,
        id: chatId,
        model: currentModelDataRef.current.model,
        provider: currentModelDataRef.current.provider,
      };

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

  const handleSubmitWithRedirect = useCallback(
    (
      e: React.FormEvent<HTMLFormElement>,
      modelData: { model: string; provider: string }
    ) => {
      window.history.replaceState({}, "", `/chat/${chatId}`);
      currentModelDataRef.current = modelData;
      console.log("Submitting with model data:", modelData);
      handleSubmit(e);
    },
    [handleSubmit]
  );

  return (
    <div className="relative w-full max-w-3xl h-screen mx-auto">
      <div className="overflow-y-auto mt-16 pb-48 px-4 sm:px-6 lg:px-8">
        <MessageList messages={messages} status={status} />
      </div>
      <div className="fixed bottom-0 w-full max-w-3xl mb-4 z-10 px-4 sm:px-6 lg:px-8">
        <MainInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmitWithRedirect}
          disabled={status === "submitted" || status === "streaming"}
          placeholder="Ask me anything..."
          status={status}
        />
      </div>
      <div className="fixed bottom-0 w-full max-w-3xl z-0 h-8 bg-background" />
    </div>
  );
}

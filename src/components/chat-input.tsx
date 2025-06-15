"use client";

import MainInput from "./main-input";
import { useChat } from "@ai-sdk/react";
import { memo } from "react";
import type { Message } from "@ai-sdk/react";

interface MessageListProps {
  messages: Message[];
}

const MessageList = memo(({ messages }: MessageListProps) => {
  return (
    <div className="flex flex-col items-start gap-2">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}
    </div>
  );
});

MessageList.displayName = "MessageList";

export default function ChatInput() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      <MessageList messages={messages} />

      <div className="fixed bottom-0 w-full max-w-2xl">
        <MainInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          placeholder="Say something..."
        />
      </div>
    </div>
  );
}

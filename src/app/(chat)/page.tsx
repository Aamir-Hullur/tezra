import ChatInput from "@/components/chat-input";
import { generateUUID } from "@/lib/utils";

export default function Home() {
  const id = generateUUID();
  return (
    <div className="h-screen max-h-screen flex justify-center">
      <ChatInput chatId={id} initialMessages={[]} />
    </div>
  );
}

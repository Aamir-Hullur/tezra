import ChatInput from "@/components/chat-input";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // TODO: Add database logic to fetch existing messages
  // const messages = await getMessagesByChatId({ id });

  return (
    <div className="h-screen flex justify-center">
      <ChatInput chatId={id} initialMessages={[]} />
    </div>
  );
}

import ChatInput from "@/components/chat-input";
import { getSelectedModelServer } from "@/lib/model-storage";
import { getProviderByModelId } from "@/lib/ai/models";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Read the user's preferred model from cookies on the server
  const selectedModel = await getSelectedModelServer();
  const selectedProvider = getProviderByModelId(selectedModel);

  const initialModelData = {
    model: selectedModel,
    provider: selectedProvider,
  };

  // TODO: Add database logic to fetch existing messages
  // const messages = await getMessagesByChatId({ id });

  return (
    <div className="flex h-screen justify-center">
      <ChatInput
        chatId={id}
        initialMessages={[]}
        initialModelData={initialModelData}
      />
    </div>
  );
}

import ChatInput from "@/components/chat-input";
import { getSelectedModelServer } from "@/lib/model-storage";
import { getProviderByModelId } from "@/lib/ai/models";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const selectedModel = await getSelectedModelServer();
  const selectedProvider = getProviderByModelId(selectedModel);

  const initialModelData = {
    model: selectedModel,
    provider: selectedProvider,
  };

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

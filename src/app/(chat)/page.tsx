import ChatInput from "@/components/chat-input";
import { generateUUID } from "@/lib/utils";
import { getSelectedModelServer } from "@/lib/model-storage";
import { getProviderByModelId } from "@/lib/ai/models";

export default async function Home() {
  const id = generateUUID();

  // Read the user's preferred model from cookies on the server
  const selectedModel = await getSelectedModelServer();
  const selectedProvider = getProviderByModelId(selectedModel);

  const initialModelData = {
    model: selectedModel,
    provider: selectedProvider,
  };

  return (
    <div className="flex h-screen max-h-screen justify-center">
      <ChatInput
        chatId={id}
        initialMessages={[]}
        initialModelData={initialModelData}
      />
    </div>
  );
}

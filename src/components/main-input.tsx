"use client";
import {
  AIInput,
  AIInputButton,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/ai-input";
import { GlobeIcon, MicIcon, PlusIcon, ArrowUp } from "lucide-react";
import { type FormEventHandler, useState } from "react";
const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "google" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "openai" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "openai" },
];
const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    console.log("Submitted message:", message);
  };
  return (
    <AIInput onSubmit={handleSubmit} className=" border">
      <AIInputTextarea placeholder="Ask me anything..." />
      <AIInputToolbar>
        <AIInputTools>
          <AIInputButton>
            <PlusIcon size={16} />
          </AIInputButton>
          <AIInputButton>
            <MicIcon size={16} />
          </AIInputButton>
          <AIInputButton>
            <GlobeIcon size={16} />
            <span>Search</span>
          </AIInputButton>
          <AIInputModelSelect value={model} onValueChange={setModel}>
            <AIInputModelSelectTrigger>
              <AIInputModelSelectValue />
            </AIInputModelSelectTrigger>
            <AIInputModelSelectContent>
              {models.map((model) => (
                <AIInputModelSelectItem key={model.id} value={model.id}>
                  {model.name}
                </AIInputModelSelectItem>
              ))}
            </AIInputModelSelectContent>
          </AIInputModelSelect>
        </AIInputTools>
        <AIInputSubmit
          variant="secondary"
          size="icon"
          className="rounded-full hover:bg-muted-foreground cursor-pointer"
          disabled={!model}
        >
          <ArrowUp size={24} />
        </AIInputSubmit>
      </AIInputToolbar>
    </AIInput>
  );
};
export default Example;

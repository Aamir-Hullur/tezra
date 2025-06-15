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
import { type FormEventHandler, useState, memo, useCallback } from "react";

const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "google" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "openai" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "openai" },
];

interface InputToolbarProps {
  model: string;
  onModelChange: (value: string) => void;
  disabled: boolean;
}

const InputToolbar = memo(
  ({ model, onModelChange, disabled }: InputToolbarProps) => {
    const handlePlusClick = useCallback(() => {
      // Handle plus button click
    }, []);

    const handleMicClick = useCallback(() => {
      // Handle mic button click
    }, []);

    const handleSearchClick = useCallback(() => {
      // Handle search button click
    }, []);

    return (
      <AIInputToolbar>
        <AIInputTools>
          <AIInputButton onClick={handlePlusClick}>
            <PlusIcon size={16} />
          </AIInputButton>
          <AIInputButton onClick={handleMicClick}>
            <MicIcon size={16} />
          </AIInputButton>
          <AIInputButton onClick={handleSearchClick}>
            <GlobeIcon size={16} />
            <span>Search</span>
          </AIInputButton>
          <AIInputModelSelect value={model} onValueChange={onModelChange}>
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
          disabled={disabled || !model}
        >
          <ArrowUp size={24} />
        </AIInputSubmit>
      </AIInputToolbar>
    );
  }
);

InputToolbar.displayName = "InputToolbar";

interface MainInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  placeholder?: string;
  disabled?: boolean;
}

const MainInput = ({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Ask me anything...",
  disabled = false,
}: MainInputProps) => {
  const [model, setModel] = useState<string>(models[0].id);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (onSubmit) {
        onSubmit(event);
      } else {
        const formData = new FormData(event.currentTarget);
        const message = formData.get("message");
        console.log("Submitted message:", message);
      }
    },
    [onSubmit]
  );

  return (
    <AIInput onSubmit={handleSubmit} className="border bg-card">
      <AIInputTextarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <InputToolbar
        model={model}
        onModelChange={setModel}
        disabled={disabled}
      />
    </AIInput>
  );
};

export default MainInput;

"use client";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/ai-input";
import { PlusIcon, ArrowUp, Square } from "lucide-react";
import { type FormEventHandler, useState, memo, useCallback } from "react";
import { ModelSelector } from "@/components/model-selector";
import { SearchToggle } from "@/components/search-toggle";

// The new ModelSelector manages its own model data and provider logic internally.

interface InputToolbarProps {
  model: string;
  onModelChange: (value: string) => void;
  disabled: boolean;
  status?: "submitted" | "streaming" | "ready" | "error";
  hasContent: boolean;
}

const InputToolbar = memo(
  ({
    model,
    onModelChange,
    disabled,
    status,
    hasContent,
  }: InputToolbarProps) => {
    const [showSearch, setShowSearch] = useState(false);
    const handlePlusClick = useCallback(() => {
      // Handle plus button click
    }, []);

    // The submit button is only disabled if not streaming and no content, or if disabled prop is true and not streaming
    const isSubmitDisabled =
      status === "streaming" ? false : disabled || !hasContent;

    return (
      <AIInputToolbar>
        <AIInputTools>
          <AIInputButton onClick={handlePlusClick}>
            <PlusIcon size={16} />
          </AIInputButton>
          <SearchToggle showSearch={showSearch} onToggle={setShowSearch} />
          <ModelSelector selectedModel={model} onModelChange={onModelChange} />
          {/* <AIInputModelSelect value={model} onValueChange={onModelChange}>
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
          </AIInputModelSelect> */}
        </AIInputTools>
        <AIInputSubmit
          variant="default"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-primary/80 cursor-pointer disabled:cursor-not-allowed bg-primary disabled:bg-primary/50"
          disabled={isSubmitDisabled}
        >
          {status === "streaming" ? (
            <Square
              size={24}
              fill="currentColor"
              className="text-primary-foreground"
            />
          ) : (
            <ArrowUp size={24} className="text-primary-foreground" />
          )}
        </AIInputSubmit>
      </AIInputToolbar>
    );
  }
);

InputToolbar.displayName = "InputToolbar";

interface MainInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // onSubmit?: FormEventHandler<HTMLFormElement>;
  onSubmit?: (
    e: React.FormEvent<HTMLFormElement>,
    modelData: { model: string; provider: string }
  ) => void;

  placeholder?: string;
  disabled?: boolean;
  status?: "submitted" | "streaming" | "ready" | "error";
}

const DEFAULT_MODEL_ID = "gpt-4o";

// Helper to extract provider from model id
function getProviderFromModel(modelId: string): string | null {
  if (modelId.startsWith("gemini-")) return "google";
  if (modelId.startsWith("gpt-") || modelId.startsWith("o1-")) return "openai";
  if (modelId.startsWith("claude-")) return "claude";
  if (modelId.startsWith("deepseek-")) return "deepseek";
  return null;
}

const MainInput = memo(
  ({
    value = "",
    onChange,
    onSubmit,
    placeholder = "Ask me anything...",
    disabled = false,
    status,
  }: MainInputProps) => {
    const [model, setModel] = useState<string>(DEFAULT_MODEL_ID);

    const hasContent = status === "streaming" ? true : value.trim() !== "";
    const provider = getProviderFromModel(model);

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
      (event) => {
        event.preventDefault();
        console.log("provider:", provider);
        console.log("model:", model);
        if (onSubmit) {
          onSubmit(event, { model, provider: provider || "openai" });
        } else {
          const formData = new FormData(event.currentTarget);
          const message = formData.get("message");
          console.log("Submitted message:", message);
        }
      },
      [onSubmit, model, provider]
    );

    const handleModelChange = useCallback((newModel: string) => {
      setModel(newModel);
      const provider = getProviderFromModel(newModel);
      console.log("Model changed:", { model: newModel, provider });
    }, []);

    return (
      <AIInput
        onSubmit={handleSubmit}
        className="border !bg-background/90 backdrop-blur-lg p-2 overflow-visible"
      >
        <AIInputTextarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="!text-base !text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <InputToolbar
          model={model}
          onModelChange={handleModelChange}
          disabled={disabled}
          status={status}
          hasContent={hasContent}
        />
      </AIInput>
    );
  }
);

MainInput.displayName = "MainInput";

export default MainInput;

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
import {
  type FormEventHandler,
  useState,
  memo,
  useCallback,
  useEffect,
} from "react";
import { ModelSelector } from "@/components/model-selector";
import { SearchToggle } from "@/components/search-toggle";
import { getProviderByModelId } from "@/lib/ai/models";
import { saveSelectedModel, getSelectedModel } from "@/lib/model-storage";

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
          className="hover:bg-primary/80 bg-primary disabled:bg-primary/50 h-8 w-8 cursor-pointer rounded-full disabled:cursor-not-allowed"
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
  },
);

InputToolbar.displayName = "InputToolbar";

interface MainInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // onSubmit?: FormEventHandler<HTMLFormElement>;
  onSubmit?: (
    e: React.FormEvent<HTMLFormElement>,
    modelData: { model: string; provider: string },
  ) => void;

  placeholder?: string;
  disabled?: boolean;
  status?: "submitted" | "streaming" | "ready" | "error";
  currentModel?: string;
}

const DEFAULT_MODEL_ID = "gemini-2.0-flash";

const MainInput = memo(
  ({
    value = "",
    onChange,
    onSubmit,
    placeholder = "Ask me anything...",
    disabled = false,
    status,
    currentModel,
  }: MainInputProps) => {
    const [model, setModel] = useState<string>(() => {
      return currentModel || DEFAULT_MODEL_ID;
    });
    // useEffect(() => {
    //   const savedModel = getSelectedModel();
    //   if (savedModel !== model) {
    //     setModel(savedModel);
    //   }
    // }, [model]);

    useEffect(() => {
      if (currentModel) {
        setModel(currentModel);
      }
    }, [currentModel]);

    const hasContent = status === "streaming" ? true : value.trim() !== "";
    const provider = getProviderByModelId(model);

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
      (event) => {
        event.preventDefault();
        console.log("provider:", provider);
        console.log("model:", model);
        if (onSubmit) {
          onSubmit(event, { model, provider });
        } else {
          const formData = new FormData(event.currentTarget);
          const message = formData.get("message");
          console.log("Submitted message:", message);
        }
      },
      [onSubmit, model, provider],
    );

    const handleModelChange = useCallback((newModel: string) => {
      setModel(newModel);
      saveSelectedModel(newModel);
      const provider = getProviderByModelId(newModel);
      console.log("Model changed:", { model: newModel, provider });
    }, []);

    return (
      <AIInput
        onSubmit={handleSubmit}
        className="!bg-background/90 overflow-visible border p-2 backdrop-blur-lg"
      >
        <AIInputTextarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="!text-foreground !text-base disabled:cursor-not-allowed disabled:opacity-50"
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
  },
);

MainInput.displayName = "MainInput";

export default MainInput;

"use client";

import {
  memo,
  useCallback,
  useState,
  useRef,
  useEffect,
  createElement,
  useMemo,
} from "react";
import {
  ChevronDown,
  Sparkles,
  Brain,
  MessageSquare,
  Zap,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const modelData = {
  google: {
    name: "Google",
    icon: Sparkles,
    color: "#4285F4",
    models: [
      {
        id: "gemini-flash-2.0",
        name: "Gemini Flash 2.0",
        description: "Fast and efficient",
      },
      {
        id: "gemini-pro-2.0",
        name: "Gemini Pro 2.0",
        description: "Advanced reasoning",
      },
      {
        id: "gemini-ultra-2.0",
        name: "Gemini Ultra 2.0",
        description: "Most capable",
      },
    ],
  },
  openai: {
    name: "OpenAI",
    icon: Brain,
    color: "#10A37F",
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "Omni-modal model" },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        description: "Faster and cheaper",
      },
      {
        id: "o1-preview",
        name: "o1 Preview",
        description: "Advanced reasoning",
      },
      { id: "o1-mini", name: "o1 Mini", description: "Reasoning model" },
    ],
  },
  claude: {
    name: "Claude",
    icon: MessageSquare,
    color: "#FF6B35",
    models: [
      {
        id: "claude-3-5-sonnet",
        name: "Claude 3.5 Sonnet",
        description: "Balanced performance",
      },
      {
        id: "claude-3-5-haiku",
        name: "Claude 3.5 Haiku",
        description: "Fast and efficient",
      },
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        description: "Most capable",
      },
    ],
  },
  deepseek: {
    name: "DeepSeek",
    icon: Zap,
    color: "#8B5CF6",
    models: [
      {
        id: "deepseek-chat",
        name: "DeepSeek Chat",
        description: "Conversational AI",
      },
      {
        id: "deepseek-coder",
        name: "DeepSeek Coder",
        description: "Code generation",
      },
      {
        id: "deepseek-math",
        name: "DeepSeek Math",
        description: "Mathematical reasoning",
      },
    ],
  },
};

// Separate component for provider item to avoid hooks in map
interface ProviderItemProps {
  providerId: string;
  provider: typeof modelData.google;
  isSelected: boolean;
  isCurrentProvider: boolean;
  onProviderClick: (providerId: string) => void;
}

const ProviderItem = memo(
  ({
    providerId,
    provider,
    isSelected,
    isCurrentProvider,
    onProviderClick,
  }: ProviderItemProps) => {
    const handleClick = useCallback(() => {
      onProviderClick(providerId);
    }, [providerId, onProviderClick]);

    const ProviderIcon = provider.icon;

    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-3 p-3 !rounded-xl transition-all text-left group",
          isSelected
            ? "bg-background text-foreground border border-border"
            : "border-transparent hover:bg-background/50 text-muted-foreground hover:text-foreground"
        )}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${provider.color}20` }}
        >
          <ProviderIcon className="w-5 h-5" style={{ color: provider.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{provider.name}</span>
            {isCurrentProvider && (
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {provider.models.length} model
            {provider.models.length !== 1 ? "s" : ""}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform flex-shrink-0 text-muted-foreground",
            isSelected ? "rotate-90" : "rotate-0"
          )}
        />
      </button>
    );
  }
);

ProviderItem.displayName = "ProviderItem";

// Separate component for model item
interface ModelItemProps {
  model: { id: string; name: string; description: string };
  selectedModel: string;
  provider: typeof modelData.google;
  selectedProvider: string;
  onModelSelect: (modelId: string) => void;
}

const ModelItem = memo(
  ({ model, selectedModel, provider, onModelSelect }: ModelItemProps) => {
    const handleClick = useCallback(() => {
      onModelSelect(model.id);
    }, [model.id, onModelSelect]);

    const isCurrentModel = selectedModel === model.id;
    const ProviderIcon = provider.icon;

    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "relative p-2 w-full !rounded-xl transition-all text-left border group",
          "bg-background hover:bg-background/50",
          isCurrentModel
            ? "border-border ring-1 ring-green-500/20"
            : "border-border hover:border-border"
        )}
      >
        {/* Header with icon and status */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${provider.color}20`,
              }}
            >
              <ProviderIcon
                className="w-4 h-4"
                style={{ color: provider.color }}
              />
            </div>
            {isCurrentModel && (
              <div className="flex items-center gap-1">
                <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-green-500" />
              </div>
            )}
          </div>

          {/* Model info */}
          <div className="px-2">
            <h3 className="font-semibold text-foreground text-balance text-sm leading-tight text-center">
              {model.name}
            </h3>
          </div>

          <div className="flex items-center justify-center gap-1">
            {/* Capability badges */}
            <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
              <Brain className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
            </div>
            {(model.id.includes("vision") ||
              model.id.includes("4o") ||
              model.id.includes("gemini")) && (
              <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                <Globe className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
        {/* Selection overlay */}
        {/* {isCurrentModel && (
          <div className="absolute inset-0 rounded-xl bg-green-500/5 pointer-events-none" />
        )} */}
      </button>
    );
  }
);

ModelItem.displayName = "ModelItem";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSelector = memo(
  ({ selectedModel, onModelChange }: ModelSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(
      null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Memoize the current provider and model lookup
    const { provider: currentProvider, model: currentModel } = useMemo(() => {
      for (const [providerId, provider] of Object.entries(modelData)) {
        const model = provider.models.find((m) => m.id === selectedModel);
        if (model) {
          return { provider: providerId, model };
        }
      }
      return { provider: "google", model: modelData.google.models[0] };
    }, [selectedModel]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSelectedProvider(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640); // sm breakpoint
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleToggleOpen = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    const handleProviderClick = useCallback((providerId: string) => {
      setSelectedProvider((prev) => (prev === providerId ? null : providerId));
    }, []);

    const handleModelSelect = useCallback(
      (modelId: string) => {
        onModelChange(modelId);
        setIsOpen(false);
        setSelectedProvider(null);
      },
      [onModelChange]
    );

    // Memoize the current icon to avoid recreation
    const CurrentIcon = useMemo(() => {
      return (
        modelData[currentProvider as keyof typeof modelData]?.icon || Sparkles
      );
    }, [currentProvider]);

    // Memoize the current color
    const currentColor = useMemo(() => {
      return modelData[currentProvider as keyof typeof modelData]?.color;
    }, [currentProvider]);

    // Memoize the provider entries to avoid recreation
    const providerEntries = useMemo(() => Object.entries(modelData), []);

    return (
      <div className="relative z-[60]" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleToggleOpen}
          className={cn(
            "rounded-xl transition-all flex items-center gap-2 px-3 py-1 border h-8 min-w-0 ",
            "bg-transparent border-border text-foreground hover:text-foreground hover:border-border"
          )}
        >
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <CurrentIcon className="w-4 h-4" style={{ color: currentColor }} />
          </div>
          <span className="text-xs truncate max-w-20">
            {currentModel?.name}
          </span>
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform flex-shrink-0",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute bottom-full mb-2 left-0 z-[59] bg-background border border-border rounded-xl shadow-none overflow-hidden"
              )}
              style={{
                // width: selectedProvider
                //   ? "min(720px, calc(100vw - 16px))"
                //   : "min(320px, calc(100vw - 16px))",
                height: isMobile ? "40vh" : "min(60vh, 345px)",
                maxHeight: "60vh",
                overflowY: "auto",
                // left: "max(16px, min(0px, calc(100vw - min(600px, calc(100vw - 32px)) - 16px)))",
              }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Providers List */}
                {(!isMobile || !selectedProvider) && (
                  <div className="flex-shrink-0 p-4 w-full sm:w-60 border-border">
                    <div className="text-xs text-muted-foreground px-2 py-1 font-medium mb-3">
                      Select Provider
                    </div>
                    <div className="space-y-2">
                      {providerEntries.map(([providerId, provider]) => (
                        <ProviderItem
                          key={providerId}
                          providerId={providerId}
                          provider={provider}
                          isSelected={selectedProvider === providerId}
                          isCurrentProvider={currentProvider === providerId}
                          onProviderClick={handleProviderClick}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* Models Grid */}
                <AnimatePresence mode="wait">
                  {selectedProvider && (
                    <motion.div
                      key={selectedProvider}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 p-4 h-full overflow-y-auto border-t sm:border-t-0 border-border"
                      style={{
                        minWidth: isMobile ? "250px" : "300px",
                        maxHeight: "calc(100% - 60px)",
                        height: isMobile ? "40vh" : "min(60vh, 340px)",
                      }}
                    >
                      {isMobile && (
                        <button
                          onClick={() => setSelectedProvider(null)}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 p-2 -m-2 rounded-lg hover:bg-background/50 transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 rotate-90" />
                          Back to Providers
                        </button>
                      )}

                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: `${
                              modelData[
                                selectedProvider as keyof typeof modelData
                              ]?.color
                            }20`,
                          }}
                        >
                          {createElement(
                            modelData[
                              selectedProvider as keyof typeof modelData
                            ]?.icon,
                            {
                              className: "w-4 h-4",
                              style: {
                                color:
                                  modelData[
                                    selectedProvider as keyof typeof modelData
                                  ]?.color,
                              },
                            }
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {
                            modelData[
                              selectedProvider as keyof typeof modelData
                            ]?.name
                          }{" "}
                          Models
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {modelData[
                          selectedProvider as keyof typeof modelData
                        ]?.models.map((model) => (
                          <ModelItem
                            key={model.id}
                            model={model}
                            selectedModel={selectedModel}
                            provider={
                              modelData[
                                selectedProvider as keyof typeof modelData
                              ]
                            }
                            selectedProvider={selectedProvider}
                            onModelSelect={handleModelSelect}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ModelSelector.displayName = "ModelSelector";

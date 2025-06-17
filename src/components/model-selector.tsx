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
import { modelData } from "@/lib/ai/models";

// Update the provider type to be more flexible
type ProviderIcon = React.ComponentType<any>;

// Update the ProviderItemProps interface
interface ProviderItemProps {
  providerId: string;
  provider: {
    name: string;
    icon: ProviderIcon;
    color: string;
    models: { id: string; name: string; description: string }[];
  };
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
          "group flex w-full items-center gap-3 !rounded-xl p-3 text-left transition-all",
          isSelected
            ? "bg-background text-foreground border-border border"
            : "hover:bg-background/50 text-muted-foreground hover:text-foreground border-transparent",
        )}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${provider.color}20` }}
        >
          <ProviderIcon className="h-5 w-5" style={{ color: provider.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{provider.name}</span>
            {isCurrentProvider && (
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
            )}
          </div>
          <div className="text-muted-foreground mt-0.5 text-xs">
            {provider.models.length} model
            {provider.models.length !== 1 ? "s" : ""}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "text-muted-foreground h-4 w-4 flex-shrink-0 transition-transform",
            isSelected ? "rotate-90" : "rotate-0",
          )}
        />
      </button>
    );
  },
);

ProviderItem.displayName = "ProviderItem";

// Update the ModelItemProps interface
interface ModelItemProps {
  model: { id: string; name: string; description: string };
  selectedModel: string;
  provider: {
    name: string;
    icon: ProviderIcon;
    color: string;
    models: { id: string; name: string; description: string }[];
  };
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
          "group relative w-full !rounded-xl border p-2 text-left transition-all",
          "bg-background hover:bg-background/50",
          isCurrentModel
            ? "border-border ring-1 ring-green-500/20"
            : "border-border hover:border-border",
        )}
      >
        {/* Header with icon and status */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${provider.color}20`,
              }}
            >
              <ProviderIcon
                className="h-4 w-4"
                style={{ color: provider.color }}
              />
            </div>
            {isCurrentModel && (
              <div className="flex items-center gap-1">
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500" />
              </div>
            )}
          </div>

          {/* Model info */}
          <div className="px-2">
            <h3 className="text-foreground text-center text-sm leading-tight font-semibold text-balance">
              {model.name}
            </h3>
          </div>

          <div className="flex items-center justify-center gap-1">
            {/* Capability badges */}
            <div className="bg-background flex h-6 w-6 items-center justify-center rounded-full">
              <Brain className="text-muted-foreground h-3 w-3" />
            </div>
            <div className="bg-background flex h-6 w-6 items-center justify-center rounded-full">
              <MessageSquare className="text-muted-foreground h-3 w-3" />
            </div>
            {(model.id.includes("vision") ||
              model.id.includes("4o") ||
              model.id.includes("gemini")) && (
              <div className="bg-background flex h-6 w-6 items-center justify-center rounded-full">
                <Globe className="text-muted-foreground h-3 w-3" />
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
  },
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
      null,
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
      [onModelChange],
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
            "flex h-8 min-w-0 items-center gap-2 rounded-xl border px-3 py-1 transition-all",
            "border-border text-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
            <CurrentIcon className="h-4 w-4" style={{ color: currentColor }} />
          </div>
          <span className="max-w-20 truncate text-xs">
            {currentModel?.name}
          </span>
          <ChevronDown
            className={cn(
              "h-3 w-3 flex-shrink-0 transition-transform",
              isOpen && "rotate-180",
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
                "bg-background border-border absolute bottom-full left-0 z-[59] mb-2 overflow-hidden rounded-xl border shadow-none",
              )}
              style={{
                // width: selectedProvider
                //   ? "min(720px, calc(100vw - 16px))"
                //   : "min(320px, calc(100vw - 16px))",
                // height: isMobile ? "40vh" : "min(60vh, 345px)",
                // maxHeight: "",
                overflowY: "auto",
                // left: "max(16px, min(0px, calc(100vw - min(600px, calc(100vw - 32px)) - 16px)))",
              }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Providers List */}
                {(!isMobile || !selectedProvider) && (
                  <div className="border-border w-full flex-shrink-0 p-4 sm:w-60">
                    <div className="text-muted-foreground mb-3 px-2 py-1 text-xs font-medium">
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
                      className="border-border h-full flex-1 overflow-y-auto border-t p-4 sm:border-t-0"
                      style={{
                        minWidth: isMobile ? "250px" : "300px",
                        maxHeight: "calc(100% - 60px)",
                        height: isMobile ? "40vh" : "min(60vh, 340px)",
                      }}
                    >
                      {isMobile && (
                        <button
                          onClick={() => setSelectedProvider(null)}
                          className="text-muted-foreground hover:text-foreground hover:bg-background/50 -m-2 mb-4 flex items-center gap-2 rounded-lg p-2 text-sm transition-colors"
                        >
                          <ChevronDown className="h-4 w-4 rotate-90" />
                          Back to Providers
                        </button>
                      )}

                      <div className="mb-4 flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-md"
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
                            },
                          )}
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          {
                            modelData[
                              selectedProvider as keyof typeof modelData
                            ]?.name
                          }{" "}
                          Models
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
  },
);

ModelSelector.displayName = "ModelSelector";

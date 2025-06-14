export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  maxTokens?: number;
  description?: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  // OpenAI Models
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    maxTokens: 128000,
    description: "Most capable GPT-4 model",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    maxTokens: 128000,
    description: "Faster, cheaper GPT-4 model",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    maxTokens: 16385,
    description: "Fast and efficient model",
  },

  // Anthropic Models
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    maxTokens: 200000,
    description: "Most capable Claude model",
  },
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    maxTokens: 200000,
    description: "Fastest Claude model",
  },

  // Google Models
  {
    id: "gemini-1.5-pro-latest",
    name: "Gemini 1.5 Pro",
    provider: "google",
    maxTokens: 2000000,
    description: "Google's most capable model",
  },
  {
    id: "gemini-1.5-flash-latest",
    name: "Gemini 1.5 Flash",
    provider: "google",
    maxTokens: 1000000,
    description: "Fast and efficient Google model",
  },
];

export interface ProviderKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
}

export function getModelProvider(modelId: string): string {
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }
  return model.provider;
}

export function validateModel(modelId: string): ModelConfig {
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
  if (!model) {
    throw new Error(`Model ${modelId} is not supported`);
  }
  return model;
}

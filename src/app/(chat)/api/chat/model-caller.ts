import { deepseek, google, openai, openrouter } from "./services";
import { generateObject, generateText, LanguageModel } from "ai";
import { modelData, ALLOWED_MODELS } from "@/lib/ai/models";

// Define allowed models per provider

type Provider = (typeof ALLOWED_MODELS)[number]["provider"];
type AllowedModel = (typeof ALLOWED_MODELS)[number]["models"][number];

export const getModelInstance = (
  provider: string,
  model: string,
): LanguageModel => {
  // Find the provider entry in ALLOWED_MODELS
  const providerEntry = ALLOWED_MODELS.find(
    (entry) => entry.provider === provider,
  );

  if (!providerEntry) {
    throw new Error(`Invalid provider: ${provider}`);
  }

  if (!(providerEntry.models as readonly string[]).includes(model)) {
    throw new Error(`Invalid model ${model} for provider ${provider}`);
  }

  switch (provider) {
    case "openai":
      return openai(model);
    case "openrouter":
      return openrouter(model);
    case "google":
      return google(model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};

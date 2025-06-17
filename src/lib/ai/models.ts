import OpenAI from "@/components/ui/openai";
import Gemini from "@/components/ui/gemini";
// import Claude from "@/components/ui/claude";
import Openrouter from "@/components/ui/openrouter";

export const modelData = {
  google: {
    name: "Google",
    icon: Gemini,
    color: "#4285F4",
    models: [
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Fast and efficient",
      },
      {
        id: "gemini-2.0-flash-lite",
        name: "Gemini 2.0 Flash Lite",
        description: "Advanced reasoning",
      },
      // {
      //   id: "gemini-2.5-pro-preview-06-05",
      //   name: "Gemini 2.5 Pro",
      //   description: "Most capable",
      // },
    ],
  },
  openai: {
    name: "OpenAI",
    icon: OpenAI,
    color: "#10A37F",
    models: [
      { id: "gpt-4o", name: "GPT 4o", description: "Omni-modal model" },
      {
        id: "o4-mini",
        name: "GPT o4 Mini",
        description: "Faster and cheaper",
      },
      {
        id: "gpt-4.1",
        name: "GPT 4.1",
        description: "Advanced reasoning",
      },
    ],
  },
  // claude: {
  //   name: "Claude",
  //   icon: Claude,
  //   color: "#FF6B35",
  //   models: [
  //     {
  //       id: "claude-3-5-sonnet",
  //       name: "Claude 3.5 Sonnet",
  //       description: "Balanced performance",
  //     },
  //     {
  //       id: "claude-3-5-haiku",
  //       name: "Claude 3.5 Haiku",
  //       description: "Fast and efficient",
  //     },
  //     {
  //       id: "claude-3-opus",
  //       name: "Claude 3 Opus",
  //       description: "Most capable",
  //     },
  //   ],
  // },
  openrouter: {
    name: "OpenRouter",
    icon: Openrouter,
    color: "#8B5CF6",
    models: [
      {
        id: "deepseek/deepseek-r1-0528:free",
        name: "Deepseek R1-0528",
        description: "Conversational AI",
      },
      {
        id: "google/gemini-2.5-pro-exp-03-25",
        name: "Gemini 2.5 Pro",
        description: "Code generation",
      },
      {
        id: "sarvamai/sarvam-m:free",
        name: "Sarvam-M",
        description: "Mathematical reasoning",
      },
    ],
  },
};

export const ALLOWED_MODELS = [
  {
    provider: "openai",
    models: ["gpt-4o", "gpt-4.1", "o4-mini"],
  },
  {
    provider: "google",
    models: [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      // "gemini-2.5-pro-preview-06-05",
    ],
  },
  {
    provider: "openrouter",
    models: [
      "deepseek/deepseek-r1-0528:free",
      "google/gemini-2.5-pro-exp-03-25",
      "sarvamai/sarvam-m:free",
    ],
  },
] as const;

export function getProviderByModelId(
  modelId: string,
): (typeof ALLOWED_MODELS)[number]["provider"] {
  for (const entry of ALLOWED_MODELS) {
    if ((entry.models as readonly string[]).includes(modelId)) {
      return entry.provider;
    }
  }
  throw new Error(`Provider not found for modelId: ${modelId}`);
}

export function getModelProvider(
  modelId: (typeof ALLOWED_MODELS)[number]["models"][number],
): (typeof ALLOWED_MODELS)[number]["provider"] {
  for (const entry of ALLOWED_MODELS) {
    if ((entry.models as readonly string[]).includes(modelId)) {
      return entry.provider;
    }
  }
  throw new Error(`Model ${modelId} not found`);
}

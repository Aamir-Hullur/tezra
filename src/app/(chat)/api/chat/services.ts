import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
// import Exa from "exa-js";
import { createDeepSeek } from "@ai-sdk/deepseek";

export const openai = createOpenAI({
  baseURL: process.env.AZURE_OPENAI_ENDPOINT || "",
  apiKey: process.env.GITHUB_API_KEY || "",
  compatibility: "compatible",
});

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// export const exa = new Exa(process.env.EXA_SEARCH_API_KEY || "");

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export const deepseek = createDeepSeek({
  baseURL: process.env.AZURE_OPENAI_ENDPOINT || "",
  apiKey: process.env.GITHUB_API_KEY || "",
  // compatibility: 'compatible'
});

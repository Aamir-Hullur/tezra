import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const openai = createOpenAI({
  baseURL: process.env.AZURE_OPENAI_ENDPOINT || "",
  apiKey: process.env.GITHUB_API_KEY || "",
  compatibility: "compatible",
});

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

import { streamText, tool } from "ai";
import { z } from "zod";
import { getModelInstance } from "./model-caller";
import { ChatSDKError } from "@/lib/errors";

export const maxDuration = 30;

// function getModelProvider() {
// 	switch ()
// }

export async function POST(req: Request) {
  try {
    const { messages, id, model, provider } = await req.json();

    console.log("Chat ID:", id);
    console.log("provider:", provider);
    console.log("model:", model);
    console.log("Messages:", messages);

    if (!model || !provider) {
      throw new ChatSDKError(
        "bad_request:api",
        "Model and provider are required",
      );
    }
    const modelInstance = getModelInstance(provider, model);

    const result = streamText({
      model: modelInstance,
      messages,
      tools: {
        weather: tool({
          description: "Get the weather in a location (fahrenheit)",
          parameters: z.object({
            location: z
              .string()
              .describe("The location to get the weather for"),
          }),
          execute: async ({ location }) => {
            const temperature = Math.round(Math.random() * (90 - 32) + 32);
            return {
              location,
              temperature,
            };
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    // Handle unexpected errors
    const chatError = new ChatSDKError(
      "bad_request:api",
      "Failed to process chat request",
    );
    return chatError.toResponse();
  }
}

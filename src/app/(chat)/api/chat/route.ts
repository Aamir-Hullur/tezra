import { smoothStream, streamText, tool } from "ai";
import { z } from "zod";
import { getModelInstance } from "./model-caller";
import { ChatSDKError } from "@/lib/errors";
import { api } from "../../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { generateUUID } from "@/lib/utils";

export const maxDuration = 30;

// function getModelProvider() {
// 	switch ()
// }
const processedCompletions = new Set<string>();

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

    // Save the user message to Convex (the latest message from the user)
    const userMessage = messages[messages.length - 1];
    if (userMessage && userMessage.role === "user") {
      try {
        const userMessageUuid = userMessage.id || generateUUID();
        await fetchMutation(api.messages.upsert, {
          chatUuid: id,
          uuid: userMessageUuid,
          role: "user",
          content: userMessage.content,
          modelId: model,
          modelProvider: provider,
        });
        console.log("User message saved to Convex");
      } catch (convexError) {
        console.error("Failed to save user message to Convex:", convexError);
      }
    }

    const modelInstance = getModelInstance(provider, model);

    const result = streamText({
      model: modelInstance,
      messages,
      experimental_transform: smoothStream({
        chunking: "word",
        delayInMs: null,
      }),
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
      onFinish: async (result) => {
        // Prevent duplicate saves by using the completion ID
        const completionKey = `${id}-${result.text.slice(0, 50)}`;
        if (processedCompletions.has(completionKey)) {
          console.log("Assistant message already processed, skipping save");
          return;
        }
        processedCompletions.add(completionKey);

        try {
          const assistantMessageUuid = generateUUID();
          await fetchMutation(api.messages.upsert, {
            chatUuid: id, // Chat UUID from the request
            uuid: assistantMessageUuid,
            role: "assistant",
            content: result.text,
            modelId: model,
            modelProvider: provider,
          });
          console.log("Assistant message saved to Convex");
        } catch (convexError) {
          console.error(
            "Failed to save assistant message to Convex:",
            convexError,
          );
        }
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

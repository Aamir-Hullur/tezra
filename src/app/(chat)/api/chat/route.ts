import { streamText, tool } from "ai";
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
    // const completionId = generateUUID();
    const assistantMessageUuid = generateUUID();
    let hasFinished = false;

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
      onFinish: async (result) => {
        // Prevent duplicate saves
        if (hasFinished) {
          console.log("onFinish already called, skipping duplicate save");
          return;
        }
        hasFinished = true;

        try {
          console.log("Saving assistant message to Convex...");
          await fetchMutation(api.messages.upsert, {
            chatUuid: id,
            uuid: assistantMessageUuid,
            role: "assistant",
            content: result.text,
            modelId: model,
            modelProvider: provider,
          });
          console.log("Assistant message saved successfully");
        } catch (convexError) {
          console.error(
            "Failed to save assistant message to Convex:",
            convexError,
          );
        }
      },

      // onFinish: async (result) => {
      //   if (processedCompletions.has(completionId)) {
      //     console.log("Completion already processed, skipping:", completionId);
      //     return;
      //   }

      //   processedCompletions.add(completionId);

      //   // Clean up old completion IDs (keep only last 100)
      //   if (processedCompletions.size > 100) {
      //     const oldestIds = Array.from(processedCompletions).slice(0, 50);
      //     oldestIds.forEach((id) => processedCompletions.delete(id));
      //   }

      //   try {
      //     console.log("Saving assistant message to Convex...");
      //     const assistantMessageUuid = generateUUID();

      //     await fetchMutation(api.messages.upsert, {
      //       chatUuid: id,
      //       uuid: assistantMessageUuid,
      //       role: "assistant",
      //       content: result.text,
      //       modelId: model,
      //       modelProvider: provider,
      //     });

      //     console.log(
      //       "Assistant message saved successfully with UUID:",
      //       assistantMessageUuid,
      //     );
      //   } catch (convexError) {
      //     console.error(
      //       "Failed to save assistant message to Convex:",
      //       convexError,
      //     );
      //   }
      // },
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

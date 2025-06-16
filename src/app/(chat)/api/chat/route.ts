import { google } from "./services";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

// function getModelProvider() {
// 	switch ()
// }

export async function POST(req: Request) {
  const { messages, id, model, provider } = await req.json();

  console.log("Chat ID:", id);
  console.log("provider:", provider);
  console.log("model:", model);
  console.log("Messages:", messages);

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    tools: {
      weather: tool({
        description: "Get the weather in a location (fahrenheit)",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
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
}

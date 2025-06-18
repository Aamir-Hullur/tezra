import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - stores user profile data from Clerk
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    tokenIdentifier: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  // Chats table - each user can have multiple chats with UUID for fast routing
  chats: defineTable({
    uuid: v.string(), // Client-generated UUID for URLs (performance)
    title: v.string(),
    userId: v.optional(v.id("users")),
    visibility: v.union(v.literal("private"), v.literal("public")),
    parentChatId: v.optional(v.id("chats")), // For fork functionality
    isAnonymous: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_uuid", ["uuid"]) // Fast UUID → Convex ID lookup
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  // Messages table - each chat can have multiple messages with UUID for fast edits
  messages: defineTable({
    uuid: v.string(), // Client-generated UUID (from AI SDK)
    chatId: v.id("chats"), // Foreign key to chats table
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    content: v.string(),
    parts: v.array(
      v.object({
        type: v.union(v.literal("text"), v.literal("image"), v.literal("file")),
        content: v.string(),
        metadata: v.optional(
          v.object({
            fileName: v.optional(v.string()),
            fileSize: v.optional(v.number()),
            mimeType: v.optional(v.string()),
            url: v.optional(v.string()),
          }),
        ),
      }),
    ),
    attachments: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          size: v.number(),
          type: v.string(),
          url: v.string(),
        }),
      ),
    ),
    modelId: v.string(), // LLM model used
    modelProvider: v.string(), // Provider (openai, anthropic, etc.)
    isEdited: v.boolean(),
    originalMessageId: v.optional(v.id("messages")), // For edit history
    tokenCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_uuid", ["uuid"]) // Fast UUID → Convex ID lookup for edits
    .index("by_chat", ["chatId"]) // Get all messages for a chat
    .index("by_created_at", ["createdAt"]),

  // User preferences (no API keys - stored client-side)
  userSettings: defineTable({
    userId: v.id("users"),
    defaultModel: v.string(),
    defaultProvider: v.string(),
    theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
    preferences: v.object({
      codeHighlighting: v.boolean(),
      autoTitle: v.boolean(),
      streamingEnabled: v.boolean(),
      shortcutsEnabled: v.boolean(),
    }),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});

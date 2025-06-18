import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get messages by chat UUID
export const getByChatUuid = query({
  args: { chatUuid: v.string() },
  handler: async (ctx, { chatUuid }) => {
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_uuid", (q) => q.eq("uuid", chatUuid))
      .unique();

    if (!chat) return [];

    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
      .order("asc")
      .collect();
  },
});

// Upsert message (create or update for real-time sync)
export const upsert = mutation({
  args: {
    chatUuid: v.string(),
    uuid: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    content: v.string(),
    modelId: v.string(),
    modelProvider: v.string(),
  },
  handler: async (ctx, args) => {
    // Get chat by UUID
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_uuid", (q) => q.eq("uuid", args.chatUuid))
      .unique();

    if (!chat) throw new Error("Chat not found");

    // Check if message exists (for edits)
    const existing = await ctx.db
      .query("messages")
      .withIndex("by_uuid", (q) => q.eq("uuid", args.uuid))
      .unique();

    const messageData = {
      chatId: chat._id,
      role: args.role,
      content: args.content,
      parts: [{ type: "text" as const, content: args.content }],
      modelId: args.modelId,
      modelProvider: args.modelProvider,
      isEdited: !!existing,
      updatedAt: Date.now(),
    };

    if (existing) {
      // Update existing message
      await ctx.db.patch(existing._id, messageData);
      return existing._id;
    } else {
      // Create new message
      return await ctx.db.insert("messages", {
        uuid: args.uuid,
        ...messageData,
        tokenCount: 0,
        createdAt: Date.now(),
      });
    }
  },
});

// Edit message by UUID
export const edit = mutation({
  args: {
    uuid: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { uuid, content }) => {
    const message = await ctx.db
      .query("messages")
      .withIndex("by_uuid", (q) => q.eq("uuid", uuid))
      .unique();

    if (!message) throw new Error("Message not found");

    await ctx.db.patch(message._id, {
      content,
      parts: [{ type: "text", content }],
      isEdited: true,
      updatedAt: Date.now(),
    });
  },
});

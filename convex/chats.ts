import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

// Get chat by UUID (for URL routing)
export const getByUuid = query({
  args: { uuid: v.string() },
  handler: async (ctx, { uuid }) => {
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_uuid", (q) => q.eq("uuid", uuid))
      .unique();

    if (!chat) return null;

    // Get messages for this chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
      .order("asc")
      .collect();

    return { chat, messages };
  },
});

// Get all chats for current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Create new chat
export const create = mutation({
  args: {
    uuid: v.string(), // Client-generated UUID
    title: v.string(),
  },
  handler: async (ctx, { uuid, title }) => {
    const user = await getCurrentUser(ctx);

    return await ctx.db.insert("chats", {
      uuid,
      title,
      userId: user?._id,
      visibility: "private",
      parentChatId: undefined,
      isAnonymous: !user,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update chat title
export const updateTitle = mutation({
  args: {
    uuid: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { uuid, title }) => {
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_uuid", (q) => q.eq("uuid", uuid))
      .unique();

    if (!chat) throw new Error("Chat not found");

    await ctx.db.patch(chat._id, {
      title,
      updatedAt: Date.now(),
    });
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        identifier: v.string(),
        img: v.optional(v.string()),
        name: v.optional(v.string()),
        gender: v.optional(v.union(
            v.literal('male'),
            v.literal('female')
        )),
        about: v.optional(v.string()),
        greeter: v.optional(v.string()),
        identities: v.optional(v.array(v.string())),
        search_string: v.optional(v.string())
    })
    .index("by_identifier", ["identifier"])
    .index("by_username", ["username"])
    .searchIndex("with_search_string", { searchField : 'search_string' }),
    direct_messages: defineTable({
        sender_id: v.id("users"),
        receiver_id: v.id("users"),
        content: v.string(),
        read: v.boolean(),
        conversation_id: v.string(),
    }).index("by_conversation_id", ["conversation_id"]),
    conversations: defineTable({
        conversation_id: v.string(),
        user1: v.id("users"),
        user2: v.id("users"),
        last_message_id: v.optional(v.id("direct_messages"))
    })
    .index("by_conversation_id", ["conversation_id"])
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
});

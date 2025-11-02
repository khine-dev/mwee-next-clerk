import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        identifier: v.string(),
        img: v.optional(v.string())
    }).index("by_identifier", ["identifier"])
});

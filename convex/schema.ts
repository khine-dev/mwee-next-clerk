import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
    users: defineTable({
        username: v.string(),
        identifier: v.string(),
        img: v.optional(v.string())
    }).index("by_identifier", ["identifier"])
});

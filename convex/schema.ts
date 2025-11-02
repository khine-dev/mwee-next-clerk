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
        identities: v.optional(v.array(v.string()))
    }).index("by_identifier", ["identifier"])
});

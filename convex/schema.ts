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
    .searchIndex("with_search_string", { searchField : 'search_string' })
});

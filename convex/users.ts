import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
    args: {username: v.union(v.string(), v.null()), img: v.optional(v.string())},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;
        const user = await ctx.db
            .query("users")
            .withIndex("by_identifier", q => q.eq("identifier", identity.tokenIdentifier))
            .unique()
        ;

        const username = args.username;
        if (user) {
            if (username && user.username !== username) {
                await ctx.db.patch(user._id, { username });
            }
            if(args.img && user.img !== args.img) {
                await ctx.db.patch(user._id, { img: args.img });
            }
            return user._id;
        }

        return await ctx.db.insert("users", {
            username: username ?? "Anonymous",
            identifier: identity.tokenIdentifier,
            img: args.img ?? undefined
        });
    },

});

export const get_me = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) return null;
        const user = await ctx.db
            .query("users")
            .withIndex("by_identifier", q => q.eq("identifier", identity.tokenIdentifier))
            .unique()
        ;
        return user;
    }
})

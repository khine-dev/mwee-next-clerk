import { OrderedQuery, paginationOptsValidator  } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { DataModel } from "./_generated/dataModel";

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

export const generate_search_string = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;
        const user = await ctx.db
            .query("users")
            .withIndex("by_identifier", q => q.eq("identifier", identity.tokenIdentifier))
            .unique()
        ;
        if(!user) return;
        const search_string =
            (user.username) + 
            ' ' +
            (user.name ?? '') +
            ' ' +
            (user.identities?.join(' ') ?? '') +
            ' ' +
            (user.about ?? '')
        ;
        await ctx.db.patch(user._id, { search_string: search_string.toLowerCase() })
    }
})


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
});

export const update_profile = mutation({
    args: {
        name: v.optional(v.string()),
        gender: v.optional(v.union(
            v.literal('male'),
            v.literal('female')
        )),
        about: v.optional(v.string()),
        greeter: v.optional(v.string()),
        identities: v.optional(v.array(v.string()))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) return null;
        const user = await ctx.db
            .query("users")
            .withIndex("by_identifier", q => q.eq("identifier", identity.tokenIdentifier))
            .unique()
        ;
        if(!user) return null;
        await ctx.db.patch(user._id, args);
    }
});


export const get_user_with_username = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("users").withIndex("by_username", q => q.eq("username", args.username)).unique();
    }
})

export const search_users = query({
    args: {
        keyword: v.optional(v.string()),
        gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {

        const base_q  = ctx.db.query('users');;
        let final_query: OrderedQuery<DataModel['users']> = ctx.db.query('users');;
        if(args.keyword) {
            final_query = base_q.withSearchIndex("with_search_string", (q) => q.search("search_string", args.keyword!.toLowerCase().trim()))
            if(args.gender) {
                final_query = final_query.filter(q => q.eq(q.field('gender'), args.gender))
            }
        }
        if(args.gender) {
            final_query = final_query.filter(q => q.eq(q.field('gender'), args.gender))
        }
        return await final_query
            .filter(q => q.neq(q.field('gender'), undefined))
            .paginate(args.paginationOpts);
    }
});


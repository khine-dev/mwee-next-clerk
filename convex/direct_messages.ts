import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from 'convex/server';
import { Id } from "./_generated/dataModel";

export const send_message = mutation({
    args: {
        receiver_id: v.id("users"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const sender = await ctx.db
            .query("users")
            .withIndex("by_identifier", q => q.eq("identifier", identity.tokenIdentifier))
            .unique()
        ;
        if(!sender) return null;

        const conversation_id = [sender._id, args.receiver_id].sort().join('_');

        const message_id = await ctx.db.insert("direct_messages", {
            sender_id: sender._id,
            receiver_id: args.receiver_id,
            content: args.content,
            read: false,
            conversation_id
        });

        const conversation = await ctx.db.query('conversations')
            .withIndex('by_conversation_id', q => q.eq('conversation_id', conversation_id))
            .first()
        ;
        if(conversation) {
            await ctx.db.patch(conversation._id, { last_message_id: message_id });
        } else {
            const users = [sender._id, args.receiver_id].sort();
            await ctx.db.insert('conversations', {
                conversation_id,
                user1: users[0],
                user2: users[1],
                last_message_id: message_id
            });
        }
        return message_id;
    },
});

export const get_messages = query({
    args: {
        other_user_id: v.id("users"),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return {
            page: [],
            isDone: true,
            continueCursor: ''
        };
        const user = await ctx.db
            .query("users")
            .withIndex("by_identifier", q => q.eq("identifier", identity.tokenIdentifier))
            .unique()
        ;
        if(!user) return {
            page: [],
            isDone: true,
            continueCursor: ''
        };

        const conversation_id = [user._id, args.other_user_id].sort().join('_');

        return await ctx.db.query("direct_messages")
            .withIndex("by_conversation_id", q => q.eq("conversation_id", conversation_id))
            .order('asc')
            .paginate(args.paginationOpts)
        ;
    }
});

export const get_conversations = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return {
            page: [],
            isDone: true,
            continueCursor: ''
        };
        const user = await ctx.db
            .query("users")
            .withIndex("by_identifier", q => q.eq("identifier", identity.tokenIdentifier))
            .unique()
        ;
        if(!user) return {
            page: [],
            isDone: true,
            continueCursor: ''
        };

        const conversations = await ctx.db.query('conversations')
            .filter(q => q.or(q.eq(q.field('user1'), user._id), q.eq(q.field('user2'), user._id)))
            .paginate(args.paginationOpts)
        ;

        const conversations_with_details = await Promise.all(conversations.page.map(async (c) => {
            const last_message = c.last_message_id ? await ctx.db.get(c.last_message_id) : null;
            const other_user_id = c.user1 === user._id ? c.user2 : c.user1;
            const other_user = await ctx.db.get(other_user_id);
            return {
                ...c,
                last_message,
                other_user
            }
        }));

        return {
            ...conversations,
            page: conversations_with_details
        }
    }
});

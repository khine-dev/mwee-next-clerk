'use client';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { Spinner } from "@/shad-cn/components/ui/spinner";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export function Message_List({ other_user_id }: { other_user_id: Id<"users"> }) {
    const { results, status, loadMore } = usePaginatedQuery(
        api.direct_messages.get_messages,
        { other_user_id },
        { initialNumItems: 10 }
    );
    const { ref, inView } = useInView();
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inView) {
            loadMore(10);
        }
    }, [inView, loadMore]);

    useEffect(() => {
        // Scroll to the bottom when new messages are added
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [results]);

    if (status === "LoadingFirstPage") {
        return (
            <div className="flex-1 grid place-content-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            <div ref={ref} className="h-1" />
            {[...results].map((message) => (
                <div key={message._id} className={`flex ${message.sender_id === other_user_id ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-2 rounded-lg ${message.sender_id === other_user_id ? 'bg-gray-200 text-black' : 'bg-primary text-white'}`}>
                        {message.content}
                    </div>
                </div>
            ))}
        </div>
    );
}

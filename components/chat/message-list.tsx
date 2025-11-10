'use client';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { Spinner } from "@/shad-cn/components/ui/spinner";
import { useContext, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Message_Bubble } from "./message-bubble";
import { Auth_Context } from "@/contexts/auth-context-provider";

export function Message_List({ other_user_id }: { other_user_id: Id<"users"> }) {
    const { user_id } = useContext(Auth_Context);
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
            <div className="flex flex-col gap-4">
                {results.map((message) => (
                    <Message_Bubble
                        key={message._id}
                        message={message.content}
                        timestamp={message._creationTime}
                        variant={message.sender_id === user_id ? "default" : "secondary"}
                    />
                ))}
            </div>
            <div ref={ref} className="h-1" />
        </div>
    );
}

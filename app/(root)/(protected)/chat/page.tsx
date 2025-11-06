'use client';

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { Spinner } from "@/shad-cn/components/ui/spinner";
import { Profile_Avatar } from "@/components/general/profile-avatar";
import { useRouter } from "next/navigation";

export default function Conversations_Page() {
    const { results: conversations, status } = usePaginatedQuery(
        api.direct_messages.get_conversations,
        {},
        { initialNumItems: 10 }
    );
    const router = useRouter();

    if (status === "LoadingFirstPage") {
        return (
            <div className="grid place-content-center h-36">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {conversations?.map((conversation) => (
                <div key={conversation._id} onClick={() => router.push(`/chat/${conversation.other_user.username}`)} className="p-2 border rounded-lg cursor-pointer flex items-center gap-4">
                    <Profile_Avatar src={conversation.other_user.img} alt={conversation.other_user.username} className="w-12 h-12" />
                    <div>
                        <div className="font-bold">{conversation.other_user.name || conversation.other_user.username}</div>
                        <div className="text-sm text-gray-500 truncate">{conversation.last_message?.content}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

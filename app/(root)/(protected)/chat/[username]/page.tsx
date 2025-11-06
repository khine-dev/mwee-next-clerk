'use client';

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { User_Header } from "@/components/chat/user-header";
import { Message_List } from "@/components/chat/message-list";
import { Message_Input } from "@/components/chat/message-input";
import { Spinner } from "@/shad-cn/components/ui/spinner";

export default function Chat_Page() {
    const { username } = useParams<{ username: string }>();
    const other_user = useQuery(api.users.get_user_with_username, { username });

    if (other_user === undefined) return (
        <div className="grid place-content-center h-36">
            <Spinner />
        </div>
    )

    if (other_user === null) return (
        <div className="grid place-content-center h-36">
            User not found
        </div>
    )

    return (
        <div className="flex flex-col h-full">
            <User_Header user={other_user} />
            <Message_List other_user_id={other_user._id} />
            <Message_Input receiver_id={other_user._id} />
        </div>
    );
}

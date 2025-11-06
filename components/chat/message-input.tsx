'use client';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Textarea } from "@/shad-cn/components/ui/textarea";
import { Button } from "@/shad-cn/components/ui/button";
import { toast } from "sonner";

export function Message_Input({ receiver_id }: { receiver_id: Id<"users"> }) {
    const [message, setMessage] = useState("");
    const sendMessage = useMutation(api.direct_messages.send_message);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await sendMessage({ receiver_id, content: message });
            setMessage("");
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
            />
            <Button type="submit">Send</Button>
        </form>
    );
}

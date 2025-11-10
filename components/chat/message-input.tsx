'use client';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Input } from "@/shad-cn/components/ui/input";
import { Button } from "@/shad-cn/components/ui/button";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function Message_Input({ receiver_id }: { receiver_id: Id<"users"> }) {
    const [message, setMessage] = useState("");
    const sendMessage = useMutation(api.direct_messages.send_message);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await sendMessage({ receiver_id, content: message });
            setMessage("");
        } catch (e) {
            console.log(e);
            toast.error("Failed to send message");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
            />
            <Button type="submit" size="icon" variant="ghost">
                <Send className="w-5 h-5" />
            </Button>
        </form>
    );
}

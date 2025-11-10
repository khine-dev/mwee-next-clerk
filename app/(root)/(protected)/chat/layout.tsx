'use client';

import { Props_Type_With_Children } from "@/types/general";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shad-cn/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Profile_Avatar } from "@/components/general/profile-avatar";

export default function Chat_Layout({ children }: Props_Type_With_Children) {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const username = typeof params.username === "string" ? params.username : undefined;
    const other_user = useQuery(api.users.get_user_with_username, username ? { username } : 'skip');

    return (
        <div className="h-full flex flex-col">
            <header className="p-4 border-b-2 flex items-center gap-4">
                <Button onClick={() => router.back()} variant="ghost" size="icon">
                    <ChevronLeft />
                </Button>
                {other_user && (
                    <>
                        <Profile_Avatar src={other_user.img} alt={other_user.username} className="w-10 h-10" />
                        <h1 className="text-xl font-bold">{other_user.name || other_user.username}</h1>
                    </>
                )}
                {!other_user && <h1 className="text-xl font-bold">Chat</h1>}
            </header>
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}

'use client';

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@shad-cn/components/ui/button";
import { Profile_Avatar } from "@/components/general/profile-avatar";
import { Badge } from "@/shad-cn/components/ui/badge";
import { Card } from "@/shad-cn/components/ui/card";
import { Spinner } from "@/shad-cn/components/ui/spinner";
import { cn } from "@/shad-cn/lib/utils";

export default function User_Page() {
    const { username } = useParams<{ username: string }>();
    const user = useQuery(api.users.get_user_with_username, { username });
    const router = useRouter();

    if (user === undefined) return (
        <div className="grid place-content-center h-36">
            <Spinner />
        </div>
    )

    if (user === null) return (
        <div className="grid place-content-center h-36">
            User not found
        </div>
    )

    return (
        <div className="space-y-7">
            <div className="flex items-start gap-4">
                <Profile_Avatar
                    className="w-24"
                    src={user.img}
                    alt={user.username}
                />
                <div className="pt-2">
                    <div className="text-xl font-bold">{user.name?.trim() || user.username}</div>
                    <div>{user.gender ?? ''}</div>
                    <div className="flex items-center flex-wrap gap-2">
                        {user.identities && user.identities.map((item, i) => item.trim() && (
                            <Badge key={i}>
                                {item}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid px-4">
                <Button onClick={() => router.push(`/chat/${user.username}`)} variant={'destructive'} className="text-wrap">
                    Chat with {' '}{ user.name?.trim() || user.username }
                </Button>
            </div>

            <div className="space-y-2">
                <div className="text-xl font-semibold">
                    About
                </div>
                <Card className="p-3">
                    <div className={cn("w-full leading-relaxed text-justify", user.about?.trim() ? '' : 'text-foreground/50')}>
                        {user.about?.trim() || 'we do not know what they thinking'}
                    </div>
                </Card>
            </div>
        </div>
    );

}

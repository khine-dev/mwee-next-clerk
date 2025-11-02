"use client";

import { useQuery } from "convex/react";
import { Button } from "@shad-cn/components/ui/button";
import { api } from "@convex/_generated/api";
import {Profile_Avatar} from "@/components/general/profile-avatar";
import { Badge } from "@/shad-cn/components/ui/badge";
import { Card } from "@/shad-cn/components/ui/card";
import { Spinner } from "@/shad-cn/components/ui/spinner";
import { useRouter } from "next/navigation";
import { cn } from "@/shad-cn/lib/utils";

export default function Profile_Page() {
    const me = useQuery(api.users.get_me);
    const router = useRouter();
    return (
        <div className="w-full min-h-full">
            {me === undefined && (
                <div className="w-full py-40 flex items-center justify-center">
                    <Spinner className="size-8" />
                </div>
            )}
            {me === null && <div>Unexpected error occured</div>}
            {me && (
                <div className="space-y-7">
                    <div className="flex items-start gap-4">
                        <Profile_Avatar
                            className="w-24"
                            src={me.img}
                            alt={me.username}
                        />
                        <div className="pt-2">
                            <div className="text-xl font-bold">{me.name?.trim() || me.username}</div>
                            <div>{me.gender ?? ''}</div>
                            <div className="flex items-center flex-wrap gap-2">
                                {me.identities && me.identities.map((item, i) => item.trim() && (
                                    <Badge key={i}>
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button onClick={() => router.push('/profile/edit')} className="w-full" variant={'secondary'}>
                            Edit Profile
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="text-xl font-semibold">
                            About
                        </div>
                        <Card className="p-3">
                            <div className={ cn("w-full leading-relaxed text-justify", me.about?.trim() ? '' : 'text-foreground/50') }>
                                { me.about?.trim() || 'what u feeling??' }
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-2">
                        <div className="text-xl font-semibold">
                            Greeter
                        </div>
                        <Card className="p-3">
                            <div className={cn("w-full leading-relaxed text-justify", me.greeter?.trim() ? '' : 'text-foreground/50') }>
                                { me.greeter?.trim() || 'This is what other users will see as your first message when they initiate a conversation with you.' }
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}


"use client";

import {
    Authenticated,
    Unauthenticated,
    useQuery,
} from "convex/react";

import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@shad-cn/components/ui/button";
import { api } from "@convex/_generated/api";
import Profile_Avatar from "@/components/general/profile-avatar";
import { Badge } from "@/shad-cn/components/ui/badge";
import { Card } from "@/shad-cn/components/ui/card";

export default function Profile_Page() {
    return (
        <div>
            <Unauthenticated>
                <Auth_Form />
            </Unauthenticated>
            <Authenticated>
                <Content />
            </Authenticated>
        </div>
    )
}

function Auth_Form() {
    return (
        <div className="flex flex-col gap-8 mx-auto">
            <SignInButton mode="modal">
                <Button>
                    Sign in
                </Button>
            </SignInButton>
            <SignUpButton mode="modal">
                <Button>
                    Sign up
                </Button>
            </SignUpButton>
        </div>
    );
}

function Content() {
    const me = useQuery(api.users.get_me);
    return (
        <div className="flex flex-col gap-8 max-w-lg mx-auto">
            {me === undefined && <div>Loading....</div>}
            {me === null && <div>Unexpected error occured</div>}
            {me && (
                <div className="space-y-7">
                    <div className="flex items-start gap-4">
                        <Profile_Avatar
                            className="w-24"
                            src={me.img}
                            alt={me.username}
                        />
                        <div>
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

                    <div className="space-y-2">
                        <div className="text-xl font-semibold">
                            About
                        </div>
                        <Card className="p-3">
                            <div className="w-full leading-relaxed text-justify">
                                { me.about ?? '' }
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-2">
                        <div className="text-xl font-semibold">
                            Greeter
                        </div>
                        <Card className="p-3">
                            <div className="w-full leading-relaxed text-justify">
                                { me.greeter ?? '' }
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

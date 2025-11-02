"use client";

import {
    Authenticated,
    Unauthenticated,
    useQuery,
} from "convex/react";

import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@shad-cn/components/ui/button";
import { api } from "@convex/_generated/api";
import Image from "next/image";
import { AspectRatio } from "@/shad-cn/components/ui/aspect-ratio";
import Profile_Avatar from "@/components/general/profile-avatar";

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
                <div>
                    <div>
                        <Profile_Avatar
                            className="w-24"
                            src={me.img}
                            alt={me.username}
                        />
                    </div>
                    <div>Welcome {me.username}</div>
                    <div>Gender- {me.gender ?? ''}</div>
                    <div>about - {me.about ?? ''}</div>
                    <div>greeter - {me.greeter ?? ''}</div>
                </div>
            )}
        </div>
    );
}

'use client';
import {
    Authenticated,
    Unauthenticated,
} from "convex/react";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@shad-cn/components/ui/button";
import { Props_Type_With_Children } from "@/types/general";


export default function Protected_Layout({children} : Props_Type_With_Children) {
    return (
        <>
            <Unauthenticated>
                <Auth_Form />
            </Unauthenticated>
            <Authenticated>
                { children }
            </Authenticated>
        </>
    )
}

function Auth_Form() {
    return (
        <div className="w-full min-h-full flex flex-col justify-center items-stretch gap-5">
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

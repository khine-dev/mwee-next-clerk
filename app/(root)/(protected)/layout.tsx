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

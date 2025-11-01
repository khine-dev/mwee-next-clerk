"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { use_store_user_effect } from "@/hooks/use-store-user-effect";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <Store_User_Component>
                {children}
            </Store_User_Component>
        </ConvexProviderWithClerk>
    );
}

function Store_User_Component({ children} : { children: ReactNode }) {
    use_store_user_effect();
    return (
        <>
            {children}
        </>
    )

}

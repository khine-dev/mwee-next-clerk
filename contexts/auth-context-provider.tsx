'use client';
import { Id } from "@convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { createContext } from 'react';
import { Props_Type_With_Children } from "@/types/general";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";


type Auth_Context_Type = {
    user_id: Id<"users"> | null;
    is_loading: boolean;
};

export const Auth_Context = createContext<Auth_Context_Type>({
    user_id: null,
    is_loading: true
});

export function Auth_Context_Provider ({children} : Props_Type_With_Children) {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const { user } = useUser();
    const [user_id, set_user_id] = useState<Id<"users"> | null>(null);
    const store_user = useMutation(api.users.store);
    const generate_search_string = useMutation(api.users.generate_search_string);

    useEffect(() => {
        if(!isAuthenticated) return;
        async function update_user () {
            if(!user) return;
            const id = await store_user({ username: user.username, img: user.imageUrl });
            set_user_id(id);
        }
        update_user();
        generate_search_string();
        return () => set_user_id(null);
    }, [isAuthenticated, store_user, user?.id, user?.username, user?.imageUrl]);

    return (
        <Auth_Context.Provider value={{ user_id, is_loading: isLoading || (isAuthenticated && user_id === null) }}>
            { children }
        </Auth_Context.Provider>
    )
}

// const Auth_Context

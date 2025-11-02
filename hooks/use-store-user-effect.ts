import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import {Id} from "@convex/_generated/dataModel";

export function use_store_user_effect() {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const { user } = useUser();
    const [user_id, set_user_id] = useState<Id<"users"> | null>(null);
    const store_user = useMutation(api.users.store);
    useEffect(() => {
        if(!isAuthenticated) return;
        console.log('image url changed'); 
        console.log(user);
        async function update_user () {
            if(!user) return;
            const id = await store_user({ username: user.username, img: user.imageUrl });
            set_user_id(id);
        }
        update_user();
        return () => set_user_id(null);
    }, [isAuthenticated, store_user, user?.id, user?.username, user?.imageUrl]);

    return {
        is_loading: isLoading || (isAuthenticated && user_id === null),
        is_authenticated: isAuthenticated && user_id !== null,
    }
}

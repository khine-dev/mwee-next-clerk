'use client';

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from 'next/navigation'

export default function User_Page() {
    const { username }  = useParams<{ username : string }>();
    const user = useQuery(api.users.get_user_with_username, { username });

    if(user === undefined) return (
        <div>
            Loading...
        </div>
    )

    if(user === null) return (
        <div>
            User not found
        </div>
    )

    return (
        <div>
            { user.username }
        </div>
    );

}

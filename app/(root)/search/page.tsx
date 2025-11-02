'use client';

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Search_Page() {
    const users = useQuery(api.users.search_users, { keyword: "thwe" });
    console.log(users);
    return (
        <>
            {users === undefined && (
                <div>Loading..</div>
            )}
            {users && (
                <div>
                    { users.map(item => (
                        <div key={item._id}>
                            { item.name ?? item.username }
                        </div>
                    )) }
                </div>
            )}
        </>
    );
}

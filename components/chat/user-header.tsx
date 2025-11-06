'use client';

import { Profile_Avatar } from "@/components/general/profile-avatar";
import { Doc } from "@/convex/_generated/dataModel";

export function User_Header({ user }: { user: Doc<"users"> }) {
    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <Profile_Avatar src={user.img} alt={user.username} className="w-12 h-12" />
            <div>
                <div className="font-bold">{user.name || user.username}</div>
                <div className="text-sm text-gray-500">Online</div>
            </div>
        </div>
    );
}

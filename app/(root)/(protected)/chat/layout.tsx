'use client';

import { Props_Type_With_Children } from "@/types/general";

export default function Chat_Layout({ children }: Props_Type_With_Children) {

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}

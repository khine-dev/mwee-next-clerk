'use client';
import React, { useMemo } from "react"
import { UserButton } from "@clerk/nextjs";
import { House, Search, MessageSquareHeart, User } from "lucide-react";
import { Card } from "@shad-cn/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { Props_Type_With_Children, With_Clildren_And } from "@/types/general";
import { cn } from "@shad-cn/lib/utils";


export default function App_Layout({ children }: Props_Type_With_Children) {
    const pathname = usePathname();
    const full_screen_paths = useMemo(() => ['/chat'], []);
    const show_header_and_footer = useMemo(() => {
        return !full_screen_paths.some(path => pathname.startsWith(path));
    }, [pathname, full_screen_paths]);

    return (
        <div className="w-screen h-screen">
            <div className="w-full h-full max-w-3xl flex flex-col mx-auto">
                {show_header_and_footer && (
                    <header className="p-4 border-b-2 flex flex-row justify-between items-center">
                        Mwee
                        <UserButton />
                    </header>
                )}
                <main className={cn("flex-1 w-full p-4 overflow-y-auto")}>
                    {children}
                </main>
                {show_header_and_footer && (
                    <footer className="p-4 flex justify-between items-center border-t-2">
                        <Icon_Button path="/">
                            <House size={40} />
                        </Icon_Button>
                        <Icon_Button path="/search">
                            <Search size={40} />
                        </Icon_Button>
                        <Icon_Button path="/chat">
                            <MessageSquareHeart size={40} />
                        </Icon_Button>
                        <Icon_Button path="/profile">
                            <User size={40} />
                        </Icon_Button>
                    </footer>
                )}
            </div>
        </div>
    );
}

type Icon_Button_Props = With_Clildren_And<{
    path: string;
}>

function Icon_Button({ children, path }: Icon_Button_Props) {
    const router = useRouter();
    const pathname = usePathname();
    const is_active = path === pathname;
    return (
        <Card onClick={() => router.push(path)} className={cn('w-fit', 'h-fit', 'p-3', 'cursor-pointer', !is_active ? 'bg-accent-foreground' : '')}>
            {children}
        </Card>
    )
}


'use client';
import React from "react"
import { UserButton } from "@clerk/nextjs";
import { ScrollArea } from "@shad-cn/components/ui/scroll-area";
import { House, Search, MessageSquareHeart, User } from "lucide-react";
import { Card } from "@shad-cn/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { Props_Type_With_Children, With_Clildren_And } from "@/types/general";
import { cn } from "@shad-cn/lib/utils";


export default function App_Layout({ children }: Props_Type_With_Children) {
    const pathname = usePathname();
    console.log('pathname', pathname);
    return (
        <div className="w-screen h-screen flex flex-col">
            <header className="p-4 border-b-2 flex flex-row justify-between items-center">
                Mwee
                <UserButton />
            </header>
            <main className="flex-1">
                <ScrollArea className="w-full h-full p-4">
                    {children}
                </ScrollArea>
            </main>
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
                    <User size={40}/>
                </Icon_Button>
            </footer>
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

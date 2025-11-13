import Link from "next/link";
import { Button } from "@shad-cn/components/ui/button";

export default function Home_Page() {

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    Welcome to MWEE by <code>khine</code>
                </h1>
                <p className="mt-6 text-lg leading-8">
                    A modern chat application to connect with others seamlessly.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link href="/search" className="cursor-pointer">
                        <Button className="cursor-pointer">Browser Users</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

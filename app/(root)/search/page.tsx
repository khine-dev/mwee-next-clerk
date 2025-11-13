'use client';

import { api } from "@/convex/_generated/api";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@shad-cn/components/ui/input-group"
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shad-cn/components/ui/select"
import { Button } from "@shad-cn/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { Gender_Type } from "@/types/general";
import { usePaginatedQuery } from "convex/react";
import { Profile_Avatar } from "@/components/general/profile-avatar";
import { Badge } from "@/shad-cn/components/ui/badge";
import { Card } from "@/shad-cn/components/ui/card";
import { useRouter } from "next/navigation";
import { Spinner } from "@/shad-cn/components/ui/spinner";
import { Auth_Context } from "@/contexts/auth-context-provider";
import { useDebounce } from "@/hooks/use-debounce";

export default function Search_Page() {

    const [gender, set_gender] = useState<Gender_Type | 'all'>('all');
    const [keyword, set_keyword] = useState<string>('');
    const debouncedKeyword = useDebounce(keyword, 300);

    const router = useRouter();
    const auth_context = useContext(Auth_Context);

    const [search_params, set_search_params] = useState<{
        keyword?: string;
        gender?: Gender_Type;
    } | null>(null);

    useEffect(() => {
        set_search_params({
            keyword: debouncedKeyword,
            gender: gender === 'all' ? undefined : gender
        });
    }, [debouncedKeyword, gender]);

    const { results: users, status, loadMore } = usePaginatedQuery(api.users.search_users, search_params || {}, { initialNumItems: 10 });

    return (
        <>
            <div className="flex items-center gap-2">
                <InputGroup className="w-full">
                    <InputGroupInput
                        onChange={e => set_keyword(e.target.value)}
                        placeholder="Search..."
                    />
                    <InputGroupAddon align="inline-end">
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
                <Select onValueChange={val => set_gender(val as Gender_Type | 'all')}>
                    <SelectTrigger className="border-none">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {status === 'LoadingFirstPage' && (
                <div className="grid place-content-center h-36">
                    <Spinner />
                </div>
            )}
            {users && (
                <div className="space-y-5 py-4">
                    {users.map(item => (
                        item._id !== auth_context.user_id &&
                        <Card key={item._id} className="p-0 cursor-pointer">
                            <div
                                onClick={() => {
                                    router.push(`/users/${item.username}`)
                                }}
                                className="p-2"
                                key={item._id}
                            >
                                <div className="flex items-start gap-4">
                                    <Profile_Avatar
                                        className="w-20"
                                        src={item.img}
                                        alt={item.username}
                                        open_image={false}
                                    />
                                    <div className="pt-1">
                                        <div className="text-xl font-bold">{item.name?.trim() || item.username}</div>
                                        <div>{item.gender ?? ''}</div>
                                        <div className="flex items-center flex-wrap gap-2">
                                            {item.identities && item.identities.map((item, i) => item.trim() && (
                                                <Badge key={i}>
                                                    {item}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {status === 'CanLoadMore' && (
                        <Button
                            onClick={() => loadMore(10)}
                            className="w-full"
                        >
                            Load More
                        </Button>
                    )}
                    {status === 'LoadingMore' && (
                        <Button
                            disabled
                            className="w-full"
                        >
                            <Spinner />
                        </Button>
                    )}
                    {status === 'Exhausted' && <p className="text-center text-gray-500">No more results</p>}
                </div>
            )}
        </>
    );
}

'use client';

import { api } from "@/convex/_generated/api";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
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
import { useState } from "react";
import { Gender_Type } from "@/types/general";
import { usePaginatedQuery } from "convex/react";

export default function Search_Page() {

    const [gender, set_gender] = useState<Gender_Type | 'all'>('all');
    const [keyword, set_keyword] = useState<string>('');

    const [ search_params, set_search_params ] = useState<{
        keyword?: string;
        gender?: Gender_Type;
    } | null>(null);

    const handle_search = () => {
        set_search_params({
            keyword,
            gender: gender === 'all' ? undefined : gender
        });
    }

    const { results : users, status, loadMore } = usePaginatedQuery(api.users.search_users, search_params || {} , { initialNumItems : 10 });

    return (
        <>
            {status === 'LoadingFirstPage' && (
                <div>Loading..</div>
            )}
            {users && (
                <div>
                    <div className="flex items-center gap-2">
                        <InputGroup className="flex-1">
                            <InputGroupInput
                                onChange={e => set_keyword(e.target.value)}
                                placeholder="Search..."
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton onClick={ handle_search }>
                                    <Search />
                                </InputGroupButton>
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
                    {users.map(item => (
                        <div key={item._id}>
                            {item.name ?? item.username}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

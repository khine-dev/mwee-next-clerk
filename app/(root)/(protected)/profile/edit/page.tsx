
"use client";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@shad-cn/components/ui/button";
import { api } from "@convex/_generated/api";
import { Badge } from "@/shad-cn/components/ui/badge";
import { X } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shad-cn/components/ui/card";
import { Input } from "@shad-cn/components/ui/input";
import { Label } from "@shad-cn/components/ui/label";
import { useEffect, useState } from "react";
import { Spinner } from "@/shad-cn/components/ui/spinner";
import { useRouter } from "next/navigation";
import { Textarea } from "@shad-cn/components/ui/textarea";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shad-cn/components/ui/select";


export default function Profile_Page() {
    const me = useQuery(api.users.get_me);
    const [user, set_user] = useState(me);
    const [loading, set_loading] = useState(false);
    const update_user = useMutation(api.users.update_profile);
    const generate_search_string = useMutation(api.users.generate_search_string);
    const router = useRouter();
    const [new_identity, set_new_identity] = useState('');

    useEffect(() => {
        console.log('infinite')
        set_user(me);
    }, [me]);
    return (
        <div className="w-full h-full">
            {me === undefined && (
                <div className="w-full py-40 flex items-center justify-center">
                    <Spinner className="size-8" />
                </div>
            )}
            {me === null && <div>Unexpected error occured</div>}
            {user && (
                <div className="space-y-7 py-20">
                    <Card className="w-full max-w-sm mx-auto">
                        <CardHeader>
                            <CardTitle>Edit your account</CardTitle>
                            <CardDescription>
                                you can edit your username and profile picture at the profile button in top right conor of the page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label>Display Name</Label>
                                        <Input
                                            onChange={e => set_user(old => old ? { ...old, name: e.target.value } : old)}
                                            value={user.name ?? ''}
                                            type="text"
                                            placeholder="your display name"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Identities</Label>
                                        <Input
                                            type="text"
                                            value={new_identity}
                                            placeholder="separate identities with space"
                                            onChange={e => set_new_identity(e.target.value)}
                                            onKeyDown={
                                                (e) => {
                                                    if (e.key === ' ') {
                                                        set_user(old => {
                                                            if (!old) return old;
                                                            if (!new_identity.trim()) return old;
                                                            return {
                                                                ...old,
                                                                identities: old.identities ? [...old.identities, new_identity.trim()] : [new_identity.trim()]
                                                            }
                                                        });
                                                        set_new_identity('');
                                                    }
                                                }
                                            }
                                        />
                                        <div className="flex items-center flex-wrap gap-2">
                                            {user.identities && user.identities.map((item, i) => item.trim() && (
                                                <Badge
                                                    onClick={() => {
                                                        const new_arr = user.identities?.filter(i => i !== item)
                                                        set_user(old => old ? {...old, identities: new_arr} : old)
                                                    }}
                                                    key={i} className="cursor-pointer"
                                                >
                                                    {item}
                                                    <X />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Gender</Label>
                                        <div className="text-xs text-foreground/50">
                                            please note that you will not appear in search results if you do not select a gender.
                                        </div>
                                        <Select
                                            value={user.gender}
                                            onValueChange={(str) => set_user(old => old ? { ...old, gender: (str as 'male' | 'female') } : old)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select your gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>About</Label>
                                        <Textarea
                                            onChange={e => set_user(old => old ? { ...old, about: e.target.value } : old)}
                                            value={user.about ?? ''}
                                            placeholder="tell us about urself"
                                            className="leading-loose"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Greeter</Label>
                                        <Textarea
                                            onChange={e => set_user(old => old ? { ...old, greeter: e.target.value } : old)}
                                            value={user.greeter ?? ''}
                                            placeholder="This is what other users will see as your first message when they initiate a conversation with you."
                                            className="leading-loose"
                                        />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <Button onClick={handle_submit} type="button" className="w-full">
                                {loading && <Spinner />}
                                Save
                            </Button>
                            <Button onClick={() => router.push('/profile')} variant="outline" className="w-full">
                                Cancel
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );

    async function handle_submit() {
        try {
            set_loading(true);
            if (!user) return;
            const data = {
                name: user.name,
                gender: user.gender,
                about: user.about,
                greeter: user.greeter,
                identities: user.identities
            };
            await update_user(data);
            await generate_search_string();
            toast.success("Successfully updated your profile");
            set_loading(false);
        } catch (e) {
            console.error("Error updating profile:", e);
            toast.error("Unexpected error occurred");
        }
    }
}


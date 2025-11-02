"use client";

import { useQuery } from "convex/react";
import { Button } from "@shad-cn/components/ui/button";
import { api } from "@convex/_generated/api";
import {Profile_Avatar, Img_Modal} from "@/components/general/profile-avatar";
import { Badge } from "@/shad-cn/components/ui/badge";
import { Card } from "@/shad-cn/components/ui/card";
import { useState } from "react";
import { Spinner } from "@/shad-cn/components/ui/spinner";


export default function Profile_Page() {
    const me = useQuery(api.users.get_me);
    const [show_img_modal, set_show_img_modal] = useState<boolean>(false);
    const toogle_modal = () => set_show_img_modal(old => !old);
    return (
        <div className="w-full h-full">
            {me === undefined && (
                <div className="w-full py-40 flex items-center justify-center">
                    <Spinner className="size-8" />
                </div>
            )}
            {me === null && <div>Unexpected error occured</div>}
            {me && (
                <div className="space-y-7">
                    <div className="flex items-start gap-4">
                        <Profile_Avatar
                            toogle_modal={toogle_modal}
                            className="w-24"
                            src={me.img}
                            alt={me.username}
                        />
                        { me.img && show_img_modal && <Img_Modal src={me.img} toogle_modal={toogle_modal} /> }
                        <div className="pt-2">
                            <div className="text-xl font-bold">{me.name?.trim() || me.username}</div>
                            <div>{me.gender ?? ''}</div>
                            <div className="flex items-center flex-wrap gap-2">
                                {me.identities && me.identities.map((item, i) => item.trim() && (
                                    <Badge key={i}>
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button className="w-full" variant={'secondary'}>
                            Edit Profile
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="text-xl font-semibold">
                            About
                        </div>
                        <Card className="p-3">
                            <div className="w-full leading-relaxed text-justify">
                                { me.about ?? '' }
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-2">
                        <div className="text-xl font-semibold">
                            Greeter
                        </div>
                        <Card className="p-3">
                            <div className="w-full leading-relaxed text-justify">
                                { me.greeter ?? '' }
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}


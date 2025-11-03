'use client';
import Image from "next/image";
import { AspectRatio } from "@/shad-cn/components/ui/aspect-ratio";
import { cn } from "@/shad-cn/lib/utils";
import { useState } from "react";

type Props_Type = {
    src?: string;
    alt?: string;
    className?: string;
    open_image?: boolean;
}

export function Profile_Avatar({ src, alt, className = '', open_image = true }: Props_Type) {
    const [show_img_modal, set_show_img_modal] = useState<boolean>(false);
    const toogle_modal = () => set_show_img_modal(old => !old);
    return (
        <div onClick={() => open_image && toogle_modal()} className={cn(`w-32`, className.split(' '))}>
            <AspectRatio ratio={1 / 1} className="bg-muted rounded-full">
                <Image
                    src={src ?? "https://github.com/shadcn.png"}
                    alt={alt ?? 'p'}
                    fill
                    className="w-full rounded-full object-cover"
                />
            </AspectRatio>
            {show_img_modal && <Img_Modal src={src} alt={alt} toogle_modal={toogle_modal} />}
        </div>
    )
}

type Img_Modal_Props_Type = Props_Type & { toogle_modal: () => void }

export function Img_Modal({ src, alt, toogle_modal, className = '' }: Img_Modal_Props_Type) {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                if(toogle_modal) toogle_modal();
            }}
            className="w-screen h-screen fixed bg-background/20 backdrop-blur-2xl left-0 top-0 flex items-center justify-center p-7 z-50"
        >
            <div className={cn(`w-full`, className.split(' '))}>
                <AspectRatio ratio={1 / 1} className="bg-muted rounded-2xl">
                    <Image
                        src={src ?? "https://github.com/shadcn.png"}
                        alt={alt ?? 'p'}
                        fill
                        className="w-full object-fill rounded-2xl"
                    />
                </AspectRatio>
            </div>
        </div>
    );
}

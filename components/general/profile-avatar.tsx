import Image from "next/image";
import { AspectRatio } from "@/shad-cn/components/ui/aspect-ratio";
import { cn } from "@/shad-cn/lib/utils";

export default function Profile_Avatar({ src, alt, className = '' }: { src?: string, alt?: string, className?: string }) {
    return (

        <div className={ cn(`w-32`, className.split(' ')) }>
            <AspectRatio ratio={1 / 1} className="bg-muted rounded-full">
                <Image
                    src={src ?? "https://github.com/shadcn.png"}
                    alt={alt ?? 'p'}
                    fill
                    className="w-full rounded-full object-cover"
                />
            </AspectRatio>
        </div>
    )
}

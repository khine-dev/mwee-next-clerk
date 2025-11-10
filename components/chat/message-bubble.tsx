'use client';

import { cn } from "@/shad-cn/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { format } from "date-fns";

const messageVariants = cva(
    "flex flex-col max-w-[75%] w-fit p-3 rounded-xl",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground self-end",
                secondary: "bg-secondary text-secondary-foreground self-start",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface Message_Bubble_Props extends VariantProps<typeof messageVariants> {
    message: string;
    timestamp: number;
    className?: string;
}

export function Message_Bubble({
    variant,
    message,
    timestamp,
    className,
}: Message_Bubble_Props) {
    return (
        <div className={cn(messageVariants({ variant }), className)}>
            <p className="text-sm">{message}</p>
            <p className="text-xs text-muted-foreground/80 self-end">
                {format(new Date(timestamp), "h:mm a")}
            </p>
        </div>
    );
}

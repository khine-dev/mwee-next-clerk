"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "@shad-cn/components/ui/sonner"

export function Theme_Provider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props}>
            <Toaster />
            {children}
        </NextThemesProvider>
    )
}

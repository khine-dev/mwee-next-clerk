import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Theme_Provider } from "@/shad-cn/theme-provider";
import Convex_Client_Provider from "@/contexts/convex-client-provider";
import { Auth_Context_Provider } from "@/contexts/auth-context-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Mwee",
    description: "A minimal chat app by Khine",
    icons: {
        icon: "/icon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ClerkProvider dynamic>
                    <Convex_Client_Provider>
                        <Auth_Context_Provider>
                            <Theme_Provider
                                attribute="class"
                                defaultTheme="dark"
                                enableSystem
                                disableTransitionOnChange
                            >
                                {children}
                            </Theme_Provider>
                        </Auth_Context_Provider>
                    </Convex_Client_Provider>
                </ClerkProvider>
            </body>
        </html>
    );
}

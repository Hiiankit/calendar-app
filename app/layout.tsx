import "@/styles/globals.css"
import { Metadata } from "next"
import { Nunito_Sans } from "next/font/google"
import { getServerSession } from "next-auth"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import { AuthSecuredLayout } from "./AuthSecuredLayout"
import SessionProvider from "./SessionProvider"

const nunito = Nunito_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession()
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <SessionProvider session={session}>
          <body
            className={cn(
              "min-h-screen bg-background  antialiased",
              nunito.className
            )}
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <AuthSecuredLayout>{children}</AuthSecuredLayout>

              <TailwindIndicator />
            </ThemeProvider>
          </body>
        </SessionProvider>
      </html>
    </>
  )
}

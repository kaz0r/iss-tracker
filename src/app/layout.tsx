import type { Metadata } from "next"
import { Providers } from "./components/providers"
import { JetBrains_Mono } from 'next/font/google'

import "./globals.css"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "ISS Tracker",
  description: "Track the ISS current live position",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", jetBrainsMono.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

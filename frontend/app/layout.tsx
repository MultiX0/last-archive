import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Last Archive | Humanity's Final Repository",
  description: "A secure interface to explore and preserve the collective knowledge of human civilization. Access the archive via our advanced search system.",
  applicationName: "The Last Archive",
  keywords: ["Archive", "Knowledge", "History", "Preservation", "Search", "Neural"],
  authors: [{ name: "The Last Archive Protocol" }],
  creator: "The Last Archive Protocol",
  publisher: "The Last Archive Protocol",
  metadataBase: new URL("http://localhost:3000"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "The Last Archive | Humanity's Final Repository",
    description: "Preserving humanity's knowledge for eternity. Use the neural search interface to access millions of archived documents.",
    siteName: "The Last Archive",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Last Archive",
    description: "Humanity's Final Repository. Secure. Immutable. Eternal.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { BrainrotProvider } from "@/components/brainrot-provider"
import { BrainrotFx } from "@/components/brainrot-fx"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Sommer-Aktivitäten-Planer",
  description: "Sommer-Aktivitäten gemeinsam vorschlagen, planen und tracken.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BrainrotProvider>
            <BrainrotFx />
            {children}
            <Toaster />
          </BrainrotProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ErrorBoundary } from "@/components/advanced/error-boundary"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from 'react-hot-toast';
export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "A comprehensive admin dashboard with authentication and reusable components",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <Toaster />
          <ErrorBoundary>
            {children}</ErrorBoundary>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

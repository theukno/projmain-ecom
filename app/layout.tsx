import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { UserProvider } from "@/contexts/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mind-Shop",
  description: "Your one-stop shop for all your needs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <AuthProvider>
              <CartProvider>
                <Navbar />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'
import "@/styles/globals.css"
import 'animate.css'
import 'react-phone-number-input/style.css'
import 'react-loading-skeleton/dist/skeleton.css'
import LayoutMain from "@/app/KonstaProvider"
import NextAuthSessionProvider from "./NextAuthProvider"
import { NoticationProvider } from "@components/notification"
import { DialogProvider } from '@components/dialog'
import { ThemeProvider } from '@components/themeProvider'
import { Metadata } from "next"
import { Toaster } from 'react-hot-toast'
import { getServerSession } from 'next-auth'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
export const metadata: Metadata = {
  title: "Bean Cafe",
  manifest: "/manifest.json",
  themeColor: "#cc9c68",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/logo.png',
    },
    {
      rel: 'icon',
      url: '/logo.png',
    },
  ]
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(AuthOptions)
  return (
    <html lang="en" className=" scroll-smooth">
      <body>
        <Toaster toastOptions={{
          className: "toast_custom_style"
        }} />
        <LayoutMain>
          <NoticationProvider>
            <DialogProvider>
              <ThemeProvider>
                <NextAuthSessionProvider session={session}>
                  {children}
                </NextAuthSessionProvider>
              </ThemeProvider>
            </DialogProvider>
          </NoticationProvider>
        </LayoutMain>
      </body>
    </html>
  )
}

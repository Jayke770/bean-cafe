import "@/styles/globals.css"
import LayoutMain from "@/app/KonstaProvider"
import NextAuthSessionProvider from "./NextAuthProvider"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Bean Cafe",
  manifest: "/manifest.json",
  themeColor: "#cc9c68",
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
  return (
    <html lang="en" className=" scroll-smooth">
      <body>
        <NextAuthSessionProvider>
          <LayoutMain>
            {children}
          </LayoutMain>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}

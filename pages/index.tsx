import { memo } from 'react'
import { Page } from 'konsta/react'
import Head from 'next/head'
import Onboarding from "@/components/Client/Onboarding"
const Home = () => {
  return (
    <Page
      colors={{
        bgMaterial: "bg-coffee-primary dark:bg-black"
      }}>
      <Head>
        <title>Bean Cafe</title>
      </Head>
      <Onboarding />
    </Page>
  )
}
export default memo(Home)
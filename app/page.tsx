import Onboard from '@/components/Client/Onboard'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Welcome to Bean Cafe",
  manifest: "/manifest.json",
  themeColor: "#cc9c68"
}
const Onboarding = () => {
  return (
    <main className='h-full w-full left-0 top-0 overflow-auto absolute bg-brand-primary dark:bg-black'>
      <Onboard />
    </main>
  )
}
export default Onboarding
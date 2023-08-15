import { Metadata } from 'next'
import Onboard from '@/components/Client/Onboard'
export const metadata: Metadata = {
  title: "Welcome to Bean Cafe",
  description: 'Bean Cafe Onboarding'
}
const Onboarding = () => {
  return (
    <main className='h-full w-full left-0 top-0 overflow-auto absolute bg-brand-primary dark:bg-black'>
      <Onboard />
    </main>
  )
}
export default Onboarding
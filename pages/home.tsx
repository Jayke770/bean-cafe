import { memo, useCallback } from 'react'
import { Navbar, Button, Card } from 'konsta/react'
import Head from 'next/head'
import { motion, Variants } from 'framer-motion'
import { useLocalstorageState } from 'rooks'
type Tab = 'all' | 'coffee' | 'cakes' | 'others'
const variants: Variants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
}
const categories = ['all', 'coffee', 'cakes', 'others']
const Home = () => {
  const [tab, setTab] = useLocalstorageState<Tab>("home-tab", "all")
  const onChangeTab = useCallback((data: Tab) => setTab(data), [setTab])
  return (
    <motion.main
      variants={variants}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
      transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
      className='h-full w-full left-0 top-0 overflow-auto absolute bg-coffee-secondary dark:bg-black'>
      <Head>
        <title>Bean Cafe</title>
      </Head>
      <Navbar
        component='div'
        medium
        className=' k-color-brand-primary'
        translucent={true}
        transparent={true}
        title="Bean's Cafe"
      />
      <div className='px-4 pb-4'>
        <h1 className='dark:text-zinc-400 font-bold '>Best coffee for you</h1>
      </div>
      <div className='p-4'>
        <div className='flex whitespace-nowrap gap-2'>
          {categories.map(category => (
            <Button
              tonal={category !== tab}
              onClick={() => onChangeTab(category as any)}
              className='!w-auto k-color-brand-green'
              rounded>
              <span className='first-letter:uppercase'>{category}</span>
            </Button>
          ))}
        </div>
        <div className='grid gap-2 grid-cols-2 mt-3'>
          {Array.from({ length: 10 }).map((_, i) => (
            <Card
              margin='m-0'
              className=' k-color-brand-secondary h-56 '>
              test
            </Card>
          ))}
        </div>
      </div>
    </motion.main>
  )
}
export default memo(Home)
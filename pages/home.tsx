import { memo, useCallback } from 'react'
import { Navbar, Button, Card, Link, Icon } from 'konsta/react'
import Head from 'next/head'
import { motion, Variants } from 'framer-motion'
import { useLocalstorageState } from 'rooks'
import { IoPersonCircleSharp } from 'react-icons/io5'
import Image from 'next/image'
const mainvariants: Variants = {
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
const categories = ['All', 'Coffee', 'Non Coffee', 'Cakes', 'Flappe/Blended', 'Teas', 'Snacks', 'Others']
const Home = () => {
  const [tab, setTab] = useLocalstorageState<string>("home-tab", "All")
  const onChangeTab = useCallback((data: string) => setTab(data), [setTab])
  return (
    <motion.main
      variants={mainvariants}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
      transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
      className='h-full w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-black pb-5-safe'>
      <Head>
        <title>Bean Cafe</title>
      </Head>
      <Navbar
        medium
        className=' k-color-brand-primary'
        transparent={true}
        title="Bean's Cafe"
        right={
          <Link navbar iconOnly className=' k-color-brand-primary'>
            <Icon>
              <IoPersonCircleSharp className='h-7 w-7' />
            </Icon>
          </Link>
        }
      />
      <div className='px-4 pb-4'>
        <h1 className='dark:text-zinc-400 font-bold '>Best coffee for you</h1>
      </div>
      <div className='p-4'>
        <section className='w-full bg-brand-white translucent dark:bg-black whitespace-nowrap snap-proximity gap-2 overflow-auto py-3 sticky top-16 '>
          {categories.map(category => (
            <Button
              key={category}
              clear={category !== tab}
              onClick={() => onChangeTab(category as any)}
              className='!w-auto k-color-brand-green inline-flex ml-2 first:ml-0'
              rounded>
              {category}
            </Button>
          ))}
        </section>
        <section className='grid gap-2.5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-5'>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.95 }}
              className=' cursor-pointer'>
              <Card
                margin='m-0'
                className=' k-color-brand-secondary'>
                <div className='shadow-lg rounded-2xl overflow-hidden'>
                  <Image
                    src={`/images/catalog/${i + 1}.jpg`}
                    alt="test"
                    width={300}
                    height={300}
                    loading='lazy'
                    className='aspect-square ' />
                </div>
                <div className='flex flex-col mt-3'>
                  <span className='text-xl font-bold'>Item {i + 1}</span>
                  <span className=' text-brand-primary font-bold text-base'>₱{i + 1}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>
      </div>
    </motion.main>
  )
}
export default memo(Home)
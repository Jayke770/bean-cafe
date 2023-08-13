import { memo, useCallback, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Navigation } from 'swiper/modules'
import Image from 'next/image'
import IntroImage from '@/public/images/onboarding/intro.png'
import CupsImage from '@/public/images/onboarding/cups.png'
import { Button } from 'konsta/react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import Head from 'next/head'
const variants: Variants = {
    initial: {
        opacity: 0,
        scale: 1.1
    },
    animate: {
        opacity: 1,
        scale: 1
    },
    exit: {
        opacity: 0,
        scale: 1.1
    }
}
const Onboarding = () => {
    return (
        <main className='h-full w-full left-0 top-0 overflow-auto absolute bg-coffee-primary dark:bg-black'>
            <Head>
                <title>Welcome to Bean Cafe</title>
            </Head>
            <motion.div
                variants={variants}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                id='onboarding'
                className='fixed h-full w-full p-2 bg-coffee-primary z-50 '>
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                        clickable: true,
                    }}
                    navigation={{
                        nextEl: "#next"
                    }}
                    grabCursor={true}
                    modules={[Pagination, Navigation]}
                    className='h-full w-full'>
                    <SwiperSlide>
                        <div className='flex flex-col gap-4 w-full h-full justify-center items-center'>
                            <Image
                                src={IntroImage}
                                alt='intro'
                                priority
                                className=' w-80 h-auto' />
                            <div className='mt-5 flex flex-col gap-8'>
                                <h1 className='text-coffee-secondary font-bold text-3xl px-8 text-center'>Coffee so good, your taste buds will love it</h1>
                                <p className='font-medium px-8 text-center text-lg text-coffee-secondary '>The best grain, the finest roast, the most powerful flavor.</p>
                            </div>
                            <div className='flex w-full md:w-[20%] mt-10 px-8'>
                                <Button
                                    id='next'
                                    large
                                    rounded
                                    className='w-full k-color-brand-green'>Next</Button>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='flex flex-col gap-4 w-full h-full justify-center items-center'>
                            <Image
                                src={CupsImage}
                                alt='cups'
                                priority
                                className=' w-80 h-auto' />
                            <div className='mt-5 flex flex-col gap-8'>
                                <h1 className='text-coffee-secondary font-bold text-3xl px-8 text-center'>Discover our signature espresso</h1>
                                <p className='font-medium px-8 text-center text-lg text-coffee-secondary '>{"We've compiled a wide selection of blends and beans to fill your cup"}</p>
                            </div>
                            <div className='flex w-full md:w-[20%] mt-10 px-8'>
                                <Link href={"/home"} className='w-full'>
                                    <Button
                                        component='div'
                                        large
                                        rounded
                                        className='w-full k-color-brand-green'>{"Let's Coffee"}</Button>
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </motion.div>
        </main>
    )
}
export default memo(Onboarding)
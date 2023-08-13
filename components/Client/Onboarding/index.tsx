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
import { useLocalstorageState } from 'rooks'
const variants: Variants = {
    initial: {
        
    }
}
const Onboarding = () => {
    const [isNew, setisNew] = useLocalstorageState<boolean>("isNew", false)
    const onToggleIsNew = useCallback(() => setisNew(e => !e), [setisNew])
    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
            id='onboarding'
            className='fixed h-full w-full p-2 bg-coffee-primary '>
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
                            <p className='font-medium px-8 text-center text-lg'>The best grain, the finest roast, the most powerful flavor.</p>
                        </div>
                        <div className='flex w-full md:w-[20%] mt-10 px-8'>
                            <Button
                                id='next'
                                large
                                rounded
                                className='w-full k-color-brand-green uppercase'>Next</Button>
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
                            <p className='font-medium px-8 text-center text-lg'>{"We've compiled a wide selection of blends and beans to fill your cup"}</p>
                        </div>
                        <div className='flex w-full md:w-[20%] mt-10 px-8'>
                            <Button
                                onClick={onToggleIsNew}
                                large
                                rounded
                                className='w-full k-color-brand-green uppercase'>{"Let's Coffee"}</Button>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </motion.div >
    )
}
export default memo(Onboarding)
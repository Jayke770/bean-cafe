"use client"
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'
import { Card } from "konsta/react"
export default function Loading() {
    return (
        <Card
            raised
            className=" k-color-brand-primary w-full md:w-[400px] translucent z-10 "> <div className="p-4">
                <div className="flex flex-col mb-5 gap-1">
                    <Skeleton className=' h-7.5 !w-20 ' />
                    <Skeleton className='!w-32' />
                </div>
                <Skeleton className=' h-10' />
                <hr className=' border-1 border-black dark:border-brand-primary my-5' />
                <div className="flex flex-col gap-2.5">
                    <div className='flex flex-col gap-2'>
                        <Skeleton className=' !w-10 ' />
                        <Skeleton className=' h-11  ' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Skeleton className=' !w-10 ' />
                        <Skeleton className=' h-11  ' />
                    </div>
                    <Skeleton className=' h-10' />
                </div>
            </div>
        </Card>
    )
}
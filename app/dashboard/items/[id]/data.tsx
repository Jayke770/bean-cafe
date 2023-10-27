"use client"
import { Card } from "konsta/react";
import { motion } from 'framer-motion'
import { ItemInfo } from '@lib/Admin/items'
import { useParams } from 'next/navigation'
import Image from 'next/image'
export default function ItemData() {
    const params = useParams()
    const { item } = ItemInfo(params.id as string)
    return (
        <div className="flex flex-col lg:flex-row transition-all gap-2 p-4 lg:h-[calc(100vh-64px)]">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.5 }}
                className="h-full">
                <Card
                    margin="m-0"
                    className="h-full w-full lg:w-96 k-color-brand-primary">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">{item?.name}</h1>
                    </div>
                    <div className='shadow-lg h-44 rounded-2xl overflow-hidden'>
                        <Image
                            priority
                            src={item?.image ?? "/logo.png"}
                            alt={item?.name ?? "loading"}
                            width={300}
                            height={300}
                            className=' aspect-square h-full w-full object-cover ' />
                    </div>
                </Card>
            </motion.div>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.6 }}
                className="h-full flex w-full ">
                <Card
                    margin="m-0"
                    className="h-full w-full k-color-brand-primary">

                </Card>
            </motion.div>
        </div>
    )
}
"use client"
import { OrderStats, Orders } from '@lib/Admin/orders'
import { Card } from 'konsta/react'
import {
    BsCheckCircleFill,
    BsFillCartXFill
} from 'react-icons/bs'
import StatsLoader from './stats_loader'
import { motion, AnimatePresence } from 'framer-motion'
import { MdOutlinePendingActions } from 'react-icons/md'
import { GiCancel } from 'react-icons/gi'
export default function OrdersData() {
    const { orderstats, orderstatsLoading } = OrderStats()
    const { } = Orders()
    return (
        <div className="p-4 w-full">
            <AnimatePresence mode='wait'>
                {orderstatsLoading && <StatsLoader key={"stats-loading"} />}
                {orderstats && (
                    <motion.div
                        key={"stats"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeInOut", duration: 0.3, delay: 0 }}
                        className="flex flex-col gap-2">
                        <Card
                            margin="m-0"
                            className=" k-color-brand-primary !rounded-md ">
                            <div className="flex justify-between w-full items-center">
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl">{orderstats?.completed}</span>
                                    <span className="text-sm">Completed Orders</span>
                                </div>
                                <BsCheckCircleFill className=" h-8 w-8 text-teal-500" />
                            </div>
                        </Card>
                        <Card
                            margin="m-0"
                            className=" k-color-brand-primary !rounded-md ">
                            <div className="flex justify-between w-full items-center">
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl">{orderstats?.pending}</span>
                                    <span className="text-sm">Pending Orders</span>
                                </div>
                                <MdOutlinePendingActions className=" h-8 w-8 text-amber-500" />
                            </div>
                        </Card>
                        <Card
                            margin="m-0"
                            className=" k-color-brand-primary !rounded-md ">
                            <div className="flex justify-between w-full items-center">
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl">{orderstats?.cancelled}</span>
                                    <span className="text-sm">Cancelled Orders</span>
                                </div>
                                <GiCancel className=" h-8 w-8 text-red-500" />
                            </div>
                        </Card>
                        <Card
                            margin="m-0"
                            className=" k-color-brand-primary !rounded-md ">
                            <div className="flex justify-between w-full items-center">
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl">{orderstats?.denied}</span>
                                    <span className="text-sm">Denied Orders</span>
                                </div>
                                <BsFillCartXFill className=" h-8 w-8 text-pink-500" />
                            </div>
                        </Card>
                    </motion.div>
                )}
                <div className='flex flex-col w-full mt-3'>
                    <h1 className='font-bold'>Recent Orders</h1>
                </div>
            </AnimatePresence>
        </div>
    )
}
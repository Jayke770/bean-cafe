"use client"
import { OrderStats } from '@lib/Admin/orders'
import { Card } from 'konsta/react'
import {
    BsCheckCircleFill,
    BsFillCartXFill
} from 'react-icons/bs'
import { motion } from 'framer-motion'
import { MdOutlinePendingActions } from 'react-icons/md'
import { GiCancel } from 'react-icons/gi'
import CountUp from 'react-countup'
import RecentOrders from './recent'
export default function OrdersData() {
    const { orderstats } = OrderStats()
    return (
        <div className="p-4 w-full">
            <motion.div
                key={"stats"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeInOut", duration: 0.3, delay: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                <Card
                    margin="m-0"
                    className=" k-color-brand-primary !rounded-md ">
                    <div className="flex justify-between w-full items-center">
                        <div className="flex flex-col">
                            <CountUp
                                className="font-bold text-xl"
                                end={orderstats?.completed} />
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
                            <CountUp
                                className="font-bold text-xl"
                                end={orderstats?.pending} />
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
                            <CountUp
                                className="font-bold text-xl"
                                end={orderstats?.cancelled} />
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
                            <CountUp
                                className="font-bold text-xl"
                                end={orderstats?.denied} />
                            <span className="text-sm">Denied Orders</span>
                        </div>
                        <BsFillCartXFill className=" h-8 w-8 text-pink-500" />
                    </div>
                </Card>
            </motion.div>
            <div className='flex flex-col w-full mt-3'>
                <RecentOrders />
            </div>
        </div>
    )
}
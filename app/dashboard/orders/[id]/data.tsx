"use client"
import { useParams } from "next/navigation"
import { OrderData } from '@lib/Admin/orders'
import { motion } from 'framer-motion'
import { Card, ListInput, List, ListItem } from "konsta/react"
import Image from "next/image"
import OrderStatus from '@/components/orderStatus'
import * as changeCase from 'change-case'
import Skeleton from "react-loading-skeleton"
export default function OrderInfo() {
    const params = useParams()
    const { orderData, orderDataLoading } = OrderData(params?.id as any)
    return (
        <>
            <div className="flex flex-col lg:flex-row transition-all gap-2 p-4 lg:h-[calc(100vh-64px)]">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="h-full">
                    <Card
                        margin="m-0"
                        className="h-full w-full lg:w-96 k-color-brand-primary"
                        contentWrap={false}>
                        <div className="h-full flex justify-center flex-col overflow-auto p-4">
                            <div className='flex flex-col justify-center items-center'>
                                <Image
                                    priority
                                    src={orderData?.userID?.image ?? "/logo.png"}
                                    alt={orderData?.userID?.name ?? "loading"}
                                    width={300}
                                    height={300}
                                    className=' aspect-square h-36 w-36 shadow-xl rounded-full  object-cover lg:object-contain ' />
                                <div className="flex flex-col gap-2 mt-2">
                                    {orderDataLoading ? <Skeleton width={"3rem"} className="self-center" /> : <h1 className="text-2xl font-semibold">{orderData?.name}</h1>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-10 px-3.5 text-xs lg:text-sm">
                                {orderDataLoading ? (
                                    <>
                                        <Skeleton width={"4rem"} height={"1.5rem"} />
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="flex justify-between items-baseline">
                                                <Skeleton width={"3rem"} />
                                                <Skeleton width={`${1 + (i + 1) / 2}rem`} />
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <span className="font-bold text-xl">User Details</span>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-zinc-600 dark:text-zinc-300">Order ID</span>
                                            <span>{orderData?.orderId}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-zinc-600 dark:text-zinc-300">Email</span>
                                            <span>{orderData?.userID?.email}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-zinc-600 dark:text-zinc-300">Phone Number</span>
                                            <span>{orderData?.phone_number}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-zinc-600 dark:text-zinc-300">Address</span>
                                            <span>{orderData?.address}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-zinc-600 dark:text-zinc-300">Payment Method</span>
                                            <span>{changeCase.sentenceCase(orderData?.payment_method ?? "")}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-zinc-600 dark:text-zinc-300">Order Status</span>
                                            <OrderStatus status={orderData?.status} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                    className="h-full flex w-full ">
                    <Card
                        margin="m-0"
                        className="h-full w-full k-color-brand-primary">
                        <List margin="my-0">
                            {orderData?.items?.map(item => (
                                <ListItem
                                    key={item.id}
                                    title={item?.item_name}
                                    text={
                                        <div className="flex flex-col">
                                            <span>Quantity: {item?.quantity}</span>
                                            <span>Size: {item?.size ?? "Regular"}</span>
                                            {item?.addon && (
                                                <span>Addon: {item?.addon?.name}</span>
                                            )}
                                        </div>
                                    }
                                    media={
                                        <Image
                                            src={`/api/files?type=item&id=${item.item_id}`}
                                            width={300}
                                            height={300}
                                            alt={item.item_id}
                                            className=' mx-3 rounded-lg w-10 object-cover aspect-square' />
                                    } />
                            ))}
                        </List>
                    </Card>
                </motion.div>
            </div>
        </>
    )
}
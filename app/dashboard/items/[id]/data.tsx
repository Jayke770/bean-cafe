"use client"
import { Badge, Card, Segmented, SegmentedButton } from "konsta/react";
import { motion } from 'framer-motion'
import { ItemInfo } from '@lib/Admin/items'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import * as changeCase from 'change-case'
import Skeleton from 'react-loading-skeleton';
export default function ItemData() {
    const params = useParams()
    const { item, itemLoading } = ItemInfo(params.id as string)
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
                    className="h-full w-full lg:w-96 k-color-brand-primary"
                    contentWrap={false}>
                    <div className=" h-full overflow-auto p-4">
                        <div className="mb-4 flex justify-between">
                            {itemLoading ? (
                                <>
                                    <Skeleton width={"5rem"} />
                                    <div className="block">
                                        <Skeleton width={"2rem"} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold">{item?.name}</h1>
                                    <div className="block">
                                        <Badge className=" k-color-brand-green" >{item?.sold} Sold</Badge>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className='shadow-lg  bg-brand-white/60 h-48 rounded-2xl overflow-hidden'>
                            <Image
                                priority
                                src={item?.image ?? "/logo.png"}
                                alt={item?.name ?? "loading"}
                                width={300}
                                height={300}
                                className=' aspect-square h-full w-full object-cover lg:object-contain ' />
                        </div>
                        <div className="flex flex-col gap-5 mt-5">
                            <div className="flex flex-col">
                                {itemLoading ? (
                                    <>
                                        <Skeleton width={"5rem"} height={"1.5rem"} />
                                        <Skeleton width={"100%"} />
                                        <Skeleton width={"60%"} />
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl font-semibold">Description</span>
                                        <div className=" break-words text-sm font-thin ">{item?.description}</div>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                {itemLoading ? (
                                    <>
                                        <Skeleton width={"5rem"} height={"1.5rem"} />
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="flex  justify-between">
                                                <Skeleton width={"2rem"} />
                                                <Skeleton width={"1.5rem"} />
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl font-semibold">Price List</span>
                                        {item?.price ? (
                                            <div className="flex justify-between">
                                                <span>Regular</span>
                                                <span className=" font-light">₱{item?.price?.toLocaleString()}</span>
                                            </div>
                                        ) : (
                                            item?.sizes?.map(size => (
                                                <div key={size.id} className="flex justify-between">
                                                    <span>{changeCase.sentenceCase(size?.type ?? "")}</span>
                                                    <span className=" font-light">₱{size?.price?.toLocaleString()}</span>
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                {itemLoading ? (
                                    <>
                                        <Skeleton width={"5rem"} />
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="flex  justify-between">
                                                <Skeleton width={"2rem"} />
                                                <Skeleton width={"1.5rem"} />
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl font-semibold">Addons</span>
                                        {item?.addons?.map(addon => (
                                            <div key={addon.id} className="flex justify-between">
                                                <span>{addon?.name}</span>
                                                <span className=" font-light">₱{addon?.price}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
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
                    <div className="flex w-full">
                        <span className="text-xl font-bold">Update Item</span>
                    </div>
                </Card>
            </motion.div>
        </div >
    )
}
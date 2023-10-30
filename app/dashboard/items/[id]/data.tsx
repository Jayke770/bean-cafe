"use client"
import { Badge, Card, Checkbox, List, ListItem, Segmented, SegmentedButton, Preloader, Button } from "konsta/react";
import { motion } from 'framer-motion'
import { ItemInfo } from '@lib/Admin/items'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import * as changeCase from 'change-case'
import Skeleton from 'react-loading-skeleton';
import { useLocalstorageState } from "rooks";
import { useState } from "react";
import toast from 'react-hot-toast'
import type { ApiResponse } from '@/types'
import { HiMiniXMark } from 'react-icons/hi2'
type UpdateItemTab = "addon" | "sizes" | "others"
interface Options {
    isUpdatingBestSeller?: boolean
}
export default function ItemData() {
    const params = useParams()
    const [options, setOptions] = useState<Options>()
    const [updateTab, setUpdateTab] = useLocalstorageState<UpdateItemTab>("update-item-tab", "addon")
    const { item, itemLoading, mutate: UpdateItem } = ItemInfo(params.id as string)
    const onSetUpdateTab = (tab: UpdateItemTab) => setUpdateTab(e => tab)
    const onSetBestSeller = () => {
        toast.promise(((): Promise<ApiResponse> => {
            setOptions(e => ({ ...e, isUpdatingBestSeller: true }))
            return new Promise(async (resolve, reject) => {
                try {
                    const req = await fetch("/api/dashboard/items/best-seller", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ id: item?.item_id })
                    })
                    if (req.ok) {
                        const res: ApiResponse = await req.json()
                        UpdateItem()
                        setOptions(e => ({ ...e, isUpdatingBestSeller: false }))
                        res?.status ? resolve(res) : reject(res.message)
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                } catch (e: any) {
                    setOptions(e => ({ ...e, isUpdatingBestSeller: false }))
                    reject(e.message)
                }
            })
        })(), {
            loading: 'Checking Item...',
            success: (data: ApiResponse) => `${data.message}`,
            error: e => e,
        })
    }
    return (
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
                                        {item?.isBestSeller && <Badge className=" k-color-brand-primary mr-2" >Best Seller</Badge>}
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
                transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                className="h-full flex w-full ">
                <Card
                    margin="m-0"
                    className="h-full w-full k-color-brand-primary">
                    <div className="lg:w-80">
                        <Segmented strong>
                            <SegmentedButton
                                strong
                                onClick={() => onSetUpdateTab("addon")}
                                active={updateTab === "addon"}>Addon</SegmentedButton>
                            <SegmentedButton
                                strong
                                onClick={() => onSetUpdateTab("sizes")}
                                active={updateTab === "sizes"}>Sizes</SegmentedButton>
                            <SegmentedButton
                                strong
                                onClick={() => onSetUpdateTab("others")}
                                active={updateTab === "others"}>Others</SegmentedButton>
                        </Segmented>
                    </div>
                    {updateTab === "addon" && (
                        <List margin="my-4">
                            {itemLoading ? (
                                <>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <ListItem
                                            key={i}
                                            media={<Skeleton width={"2rem"} />}
                                            title={<Skeleton width={"3rem"} />}
                                            subtitle={<Skeleton width={"4rem"} />}
                                            after={<Skeleton width={"2rem"} />} />
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="px-3.5 font-bold text-lg">Selected Addons</div>
                                    {item?.addons?.map(addon => (
                                        <ListItem
                                            key={addon.id}
                                            media={
                                                <Image
                                                    src={addon?.image ?? "/logo.png"}
                                                    width={300}
                                                    height={300}
                                                    alt={addon?.name ?? "loading"}
                                                    loading="lazy"
                                                    className=" rounded-xl h-10 w-10" />
                                            }
                                            title={addon?.name}
                                            subtitle={`₱ ${addon?.price}`}
                                            after={
                                                <div className="flex justify-between">
                                                    <Button
                                                        small
                                                        rounded
                                                        clear
                                                        className="k-color-brand-red !px-2">
                                                        <HiMiniXMark className=" h-6 w-6" />
                                                    </Button>
                                                </div>
                                            } />
                                    ))}
                                </>
                            )}
                        </List>
                    )}
                    {updateTab === "sizes" && (
                        <List margin="my-4">
                            {itemLoading ? (
                                <>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <ListItem
                                            key={i}
                                            title={<Skeleton width={"3rem"} />}
                                            subtitle={<Skeleton width={"4rem"} />}
                                            after={<Skeleton width={"2rem"} />} />
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="px-3.5 font-bold text-lg">Selected Sizes</div>
                                    {item?.sizes?.map(size => (
                                        <ListItem
                                            key={size.id}
                                            title={changeCase.sentenceCase(size.type)}
                                            subtitle={`₱ ${size.price}`}
                                            after={
                                                <div className="flex justify-between">
                                                    <Button
                                                        small
                                                        rounded
                                                        clear
                                                        className="k-color-brand-red !px-2">
                                                        <HiMiniXMark className=" h-6 w-6" />
                                                    </Button>
                                                </div>
                                            } />
                                    ))}
                                </>
                            )}
                        </List>
                    )}
                    {updateTab === "others" && (
                        <List margin="my-4">
                            <ListItem
                                media={
                                    options?.isUpdatingBestSeller ? <Preloader className=" h-4 w-4" /> : (
                                        <Checkbox
                                            checked={item?.isBestSeller}
                                            onChange={onSetBestSeller} />
                                    )
                                }
                                title="Best Seller"
                                footer="Add Item to Best Seller Category" />
                        </List>
                    )}
                </Card>
            </motion.div>
        </div >
    )
}
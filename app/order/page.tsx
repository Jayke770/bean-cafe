"use client"
import "rc-steps/assets/index.css"
import MainStep from 'rc-steps'
import { BsFillCheckCircleFill, BsArrowLeft } from 'react-icons/bs'
import { RiLoader5Fill } from 'react-icons/ri'
import { Button, Card, List, ListItem } from "konsta/react"
import OrderInfo from "@/lib/User/orderInfo"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import * as changeCase from 'change-case'
import Link from 'next/link'
import { FaCircleXmark } from 'react-icons/fa6'
import { ORDER_STATUS } from '@lib/constants'
import { FaInfoCircle } from "react-icons/fa";
export default function OrderInforamtion() {
    const searchParams = useSearchParams()
    const { orderData } = OrderInfo(searchParams.get("id"))
    return (
        <div className="p-4 h-full z-5 w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-brand-secondary/20">
            <div className="flex flex-col gap-4">
                <Card
                    margin="my-0"
                    raised
                    header={
                        <div className="flex gap-2 items-baseline">
                            <Link href="/home/account">
                                <Button
                                    clear
                                    rounded
                                    className=" !w-auto">
                                    <BsArrowLeft className=" h-5 w-4" />
                                </Button>
                            </Link>
                            <span>Order Info</span>
                        </div>
                    }
                    className=" k-color-brand-primary !bg-none">
                    <List margin="my-0">
                        {orderData?.items.map(item => (
                            <ListItem
                                key={item.id}
                                media={
                                    <Image
                                        src={`/api/files?type=item&id=${item.item_id}`}
                                        width={300}
                                        height={300}
                                        alt={item.item_id}
                                        className=' mx-3 rounded-lg w-10 object-cover aspect-square' />
                                }
                                title={item.item_name}
                                footer={
                                    <div className="flex flex-col">
                                        {item.size && <span>Size: {changeCase.sentenceCase(item.size ?? "")}</span>}
                                        <span>Quantity: {item.quantity}</span>
                                    </div>
                                } />
                        ))}
                    </List>
                </Card>
                <Card
                    margin="my-0"
                    raised
                    header="Order Status"
                    className=" k-color-brand-primary">
                    <MainStep
                        current={(orderData?.orderStatus?.length ?? 0) - 1}
                        direction='vertical'
                        className="flex flex-col-reverse"
                        items={orderData?.orderStatus.map(status => ({
                            icon: (
                                <>
                                    {ORDER_STATUS[status]?.showLoader && <FaInfoCircle className=" h-4 w-4 text-amber-500 rounded-full" />}
                                    {ORDER_STATUS[status]?.showCheckMark && <BsFillCheckCircleFill className=" h-4 w-4 text-teal-500 rounded-full" />}
                                    {ORDER_STATUS[status]?.showXMark && <FaCircleXmark className=" h-4 w-4 text-red-500 rounded-full" />}
                                </>
                            ),
                            title: ORDER_STATUS[status]?.title,
                            description: ORDER_STATUS[status]?.description
                        }))} />
                </Card>
            </div>
        </div>
    )
}
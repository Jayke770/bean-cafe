import type { ApiResponse, Orders } from "@/types";
import {
    Dialog,
    DialogButton,
    List,
    ListItem
} from "konsta/react";
import * as changeCase from 'change-case'
import Image from "next/image";
import OrderStatus from "@/components/orderStatus";
import CountUp from "react-countup";
import emoji from "react-easy-emoji";
import toast from 'react-hot-toast';
import { useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
interface props {
    show?: boolean,
    order?: Orders,
    onToggleOrderInfo: () => void
}
export default function OrderInfoDialog({ order, show, onToggleOrderInfo }: props) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const onDisApproveOrder = () => {
        toast.promise(((): Promise<ApiResponse> => {
            setIsProcessing(true)
            return new Promise(async (resolve, reject) => {
                try {
                    const req = await fetch("/api/dashboard/orders", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ orderId: order?.orderId, type: "disapprove" })
                    })
                    if (req.ok) {
                        const res: ApiResponse = await req.json()
                        setIsProcessing(false)
                        onToggleOrderInfo()
                        res?.status ? resolve(res) : reject(res.message)
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                } catch (e: any) {
                    setIsProcessing(false)
                    reject(e.message)
                }
            })
        })(), {
            loading: 'Checking order...',
            success: (data: ApiResponse) => {
                setIsProcessing(false)
                return `${data.message}`
            },
            error: e => e,
        })
    }
    const onApproveOrder = () => {
        toast.promise(((): Promise<ApiResponse> => {
            setIsProcessing(true)
            return new Promise(async (resolve, reject) => {
                try {
                    const req = await fetch("/api/dashboard/orders", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ orderId: order?.orderId, type: "approve" })
                    })
                    if (req.ok) {
                        const res: ApiResponse = await req.json()
                        setIsProcessing(false)
                        onToggleOrderInfo()
                        res?.status ? resolve(res) : reject(res.message)
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                } catch (e: any) {
                    setIsProcessing(false)
                    reject(e.message)
                }
            })
        })(), {
            loading: 'Checking Order...',
            success: (data: ApiResponse) => {
                setIsProcessing(false)
                return `${data.message}`
            },
            error: e => e,
        })
    }
    return (
        <Dialog
            className=' k-color-brand-primary w-full md:w-160'
            opened={show}
            onBackdropClick={onToggleOrderInfo}
            title="Order Info"
            buttons={
                order?.status === "pending" && (
                    <>
                        <DialogButton
                            disabled={isProcessing}
                            onClick={onDisApproveOrder}
                            className=' k-color-brand-red'>
                            {isProcessing ? <RiLoader5Fill className=' animate-spin w-5 h-5' /> : <span>Disapprove</span>}
                        </DialogButton>
                        <DialogButton
                            disabled={isProcessing}
                            onClick={onApproveOrder}
                            className=' k-color-brand-green'>
                            {isProcessing ? <RiLoader5Fill className=' animate-spin w-5 h-5' /> : <span>Approve</span>}
                        </DialogButton>
                    </>
                )
            }
            content={
                <div className='flex flex-col '>
                    <List margin='my-0' nested>
                        {order?.items.map(item => (
                            <ListItem
                                key={item.id}
                                link
                                media={
                                    <Image
                                        src={`/api/files?type=item&id=${item.item_id}`}
                                        width={300}
                                        height={300}
                                        alt={item.item_id}
                                        className=' mx-3 rounded-lg w-10 object-cover aspect-square' />
                                }
                                chevron={false}
                                title={item.item_name}
                                footer={
                                    <div className="flex flex-col">
                                        {item.size && <span>Size: {changeCase.sentenceCase(item.size ?? "")}</span>}
                                        <span>Quantity: {item.quantity}</span>
                                        <span>Total: ₱ {item.price * item.quantity}</span>
                                    </div>
                                } />
                        ))}
                    </List>
                    <div className='flex flex-col gap-1 mt-4 px-3.5'>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Order ID:</span>
                            <span className=' font-bold'>{order?.orderId}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Name:</span>
                            <span className=' font-bold'>{order?.name ?? "N/A"}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Order Status:</span>
                            <OrderStatus status={order?.status} />
                        </div>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Payment Method:</span>
                            <span className=' text-sm font-bold'>{changeCase.sentenceCase(order?.payment_method ?? "")}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Total Payment:</span>
                            <CountUp
                                className=' text-sm font-bold'
                                prefix='₱ '
                                end={parseFloat(order?.total_payment ?? "0")} />
                        </div>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Paid:</span>
                            {emoji(order?.isPaid ? "✅" : "❌")}
                        </div>
                    </div>
                </div>
            }>

        </Dialog>
    )
}
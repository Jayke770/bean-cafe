import type { ApiResponse, Orders } from "@/types";
import {
    Button,
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
import { useRef, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { FiExternalLink } from 'react-icons/fi'
import NextLink from 'next/link'
import Swal from "@lib/swal"
import { useReactToPrint } from 'react-to-print';
import Settings from "@/lib/settings";
interface props {
    show?: boolean,
    order?: Orders,
    onToggleOrderInfo: () => void
}
export default function OrderInfoDialog({ order, show, onToggleOrderInfo }: props) {
    const { settings } = Settings()
    const receiptRef = useRef(null)
    const [viewReceipt, setViewReciept] = useState<boolean>()
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [updateOrder, setUpdateOrder] = useState<string>()
    const onDisApproveOrder = () => {
        Swal.fire({
            icon: 'question',
            titleText: "Disapprove Message",
            input: "textarea",
            inputPlaceholder: "Write message...",
            confirmButtonText: "Disapprove",
            showCancelButton: true
        }).then(a => {
            if (a.isConfirmed) {
                setIsProcessing(true)
                Swal.fire({
                    icon: "info",
                    toast: true,
                    titleText: "Checking order...",
                    showConfirmButton: false,
                    willOpen: async () => {
                        Swal.showLoading()
                        try {
                            const req = await fetch("/api/dashboard/orders", {
                                method: 'post',
                                headers: {
                                    "content-type": "application/json"
                                },
                                body: JSON.stringify({
                                    orderId: order?.orderId,
                                    type: "disapprove",
                                    message: a?.value
                                })
                            })
                            if (req?.ok) {
                                const res: ApiResponse = await req.json()
                                setIsProcessing(false)
                                onToggleOrderInfo()
                                Swal.fire({
                                    icon: res?.status ? "success" : "info",
                                    titleText: res?.message,
                                    toast: true,
                                    showConfirmButton: false,
                                    timer: 3000
                                })
                            } else {
                                throw new Error(`${req?.status} ${req?.statusText}`)
                            }
                        } catch (e: any) {
                            setIsProcessing(false)
                            onToggleOrderInfo()
                            Swal.fire({
                                icon: "error",
                                toast: true,
                                titleText: e.message,
                                showConfirmButton: false,
                                timer: 3000
                            })
                        }
                    }
                })
            }
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
    const onUpdateOrder = () => {
        toast.promise(((): Promise<ApiResponse> => {
            setIsProcessing(true)
            return new Promise(async (resolve, reject) => {
                try {
                    const req = await fetch("/api/dashboard/orders", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ orderId: order?.orderId, type: updateOrder })
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
    const onPrintReceipt = useReactToPrint({
        content: () => receiptRef.current
    });
    return (
        <>
            <Dialog
                className=' k-color-brand-primary w-full md:w-160'
                opened={show}
                onBackdropClick={onToggleOrderInfo}
                title={
                    <div className="flex justify-between w-full">
                        <span>Order Info</span>
                        <NextLink href={`/dashboard/orders/${order?.orderId}`}>
                            <Button
                                className="!px-2"
                                rounded
                                small
                                clear>
                                <FiExternalLink className=" h-5 w-5" />
                            </Button>
                        </NextLink>
                    </div>
                }
                buttons={order?.status === "pending" && (
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
                )}
                content={
                    <>
                        <div className='flex flex-col'>
                            <List
                                margin='my-0'
                                nested
                                className="overflow-auto max-h-[40vh]">
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
                                    <span className=' text-sm'>Address:</span>
                                    <span className=' font-bold'>{order?.address ?? "N/A"}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className=' text-sm'>Landmark:</span>
                                    <span className=' font-bold'>{order?.landmark ?? "N/A"}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className=' text-sm'>Phone Number:</span>
                                    <span className=' font-bold'>{order?.phone_number}</span>
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
                                        end={parseFloat(order?.total_payment ?? "0") + parseFloat(order?.fee ?? "0")} />
                                </div>
                                <div className='flex justify-between'>
                                    <span className=' text-sm'>Paid:</span>
                                    {emoji(order?.isPaid ? "✅" : "❌")}
                                </div>
                                <div className='flex justify-between'>
                                    <span className=' text-sm'>Message:</span>
                                    <span className=' text-sm font-bold'>{order?.message}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 px-3.5 mt-4">
                                {order?.isApproved && order.isPaid && order?.status !== "completed" && (
                                    <>
                                        <div className=" font-bold text-base">Update Order Status</div>
                                        <div className="flex flex-col gap-2">
                                            <select
                                                onChange={e => setUpdateOrder(e.target.value)}
                                                className="py-3 px-4 w-full lg:w-auto dark:bg-transparent dark:focus:bg-black dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                                <option value={"cancel"}>Cancel Order</option>
                                                <option value={"out_for_delivery"}>Out for Delivery</option>
                                                <option value={"delivered"}>Order Delivered</option>
                                            </select>
                                            <Button
                                                disabled={!updateOrder || isProcessing}
                                                onClick={onUpdateOrder}>
                                                {isProcessing ? <RiLoader5Fill className=' animate-spin w-5 h-5' /> : <span>Update Order</span>}
                                            </Button>
                                        </div>
                                    </>
                                )}
                                {order?.status === "completed" && (
                                    <Button
                                        onClick={onPrintReceipt}>Print Receipt</Button>
                                )}
                            </div>
                        </div>
                    </>
                }>
            </Dialog>
            <div style={{ display: 'none' }}>
                <div ref={receiptRef}
                    className="flex flex-col border w-[50%] ">
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
                            <span className=' text-sm'>Address:</span>
                            <span className=' font-bold text-right '>{order?.address ?? "N/A"}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Landmark:</span>
                            <span className=' font-bold'>{order?.landmark ?? "N/A"}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Phone Number:</span>
                            <span className=' font-bold'>{order?.phone_number}</span>
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
                                end={parseFloat(order?.total_payment ?? "0") + parseFloat(order?.fee ?? "0")} />
                        </div>
                        <div className='flex justify-between'>
                            <span className=' text-sm'>Message:</span>
                            <span className=' text-sm font-bold'>{order?.message}</span>
                        </div>
                    </div>
                    <List
                        margin='my-0'
                        nested
                        className="overflow-auto mt-2 items">
                        {order?.items.map(item => (
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
                                chevron={false}
                                title={
                                    <div className="flex flex-col text-sm gap-2" >
                                        <div className="flex gap-2">
                                            <span>{item.item_name}</span>
                                            <span>
                                                {item.size && `Size:  ${changeCase.sentenceCase(item.size ?? "")}`}
                                                {item.quantity}x
                                            </span>
                                        </div>
                                        <span>{settings?.currency}{item.price * item.quantity}</span>
                                    </div>
                                } />
                        ))}
                    </List>
                </div >
            </div >
        </>
    )
}

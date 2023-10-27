"use client"
import {
    Actions,
    List,
    ListGroup,
    ListItem,
    Card,
    Checkbox,
    Radio,
    Button,
    ListInput,
    Badge,
    Chip
} from 'konsta/react'
import * as changeCase from 'change-case'
import type { ApiResponse, UserCart, paymentMethod, deliverType } from "@/types";
import { useLocalstorageState } from 'rooks'
import Image from 'next/image';
import { BsArrowLeft, BsPaypal } from 'react-icons/bs'
import GcashLogo from '@/public/images/gcash.png'
import { BiMoney } from 'react-icons/bi'
import ImageInput from '@/components/ImageInput';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { RiLoader5Fill } from 'react-icons/ri';
import type { Session } from 'next-auth';
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form';
import { DELIVERY_FEE } from '@lib/constants'
import PhoneInput from 'react-phone-number-input/input'
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input'
interface selectItemInCart {
    items: UserCart[],
    payment_method?: paymentMethod,
    delivery_service?: deliverType,
    phone_number?: string
}
interface Tab {
    isShowDeliveryInfo?: boolean,
    isShowPaymentMethod?: boolean
}
export default function Cart({
    opened,
    onToggleCart,
    cartData,
    session
}: {
    opened?: boolean,
    onToggleCart: () => void,
    cartData?: UserCart[],
    session: Session | null
}) {
    const { handleSubmit, register } = useForm()
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [tab, setTab] = useState<Tab>()
    const [selectedItemIncart, setselectedItemIncart] = useLocalstorageState<selectItemInCart>("check-out", { items: [] })
    const onSelectItemInCart = (item: UserCart) => {
        const index = selectedItemIncart.items.findIndex(x => x.cart_id === item.cart_id)
        if (index < 0) {
            setselectedItemIncart(e => ({ ...e, items: [...e.items, item] }))
        } else {
            let new_items = selectedItemIncart.items
            new_items.splice(index, 1)
            setselectedItemIncart(e => ({ ...e, items: new_items }))
        }
    }
    const onSelectPaymentMethod = (payment_method?: paymentMethod) => setselectedItemIncart(e => ({ ...e, payment_method: e?.payment_method === payment_method ? undefined : payment_method }))
    const onCheckOut = async (data: any) => {
        if (!isProcessing) {
            setIsProcessing(true)
            toast.promise(((): Promise<ApiResponse> => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let formData = new FormData()
                        Object.keys(data).map(key => formData.append(key, data[key]))
                        formData.append("items", JSON.stringify(selectedItemIncart.items))
                        formData.append("payment_method", selectedItemIncart?.payment_method)
                        formData.append("delivery_service", selectedItemIncart?.delivery_service ?? "")
                        formData.append("phone_number", selectedItemIncart?.phone_number ?? "")
                        const req = await fetch("/api/user/items/checkout", {
                            method: 'post',
                            body: formData
                        })
                        if (req.ok) {
                            const res: ApiResponse = await req.json()
                            setIsProcessing(false)
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
                loading: 'Processing order...',
                success: (data: ApiResponse) => {
                    setselectedItemIncart({ items: [] })
                    if (data?.status && data?.redirect_url) {
                        toast("Redirecting...", {
                            icon: <RiLoader5Fill className=' animate-spin w-5 h-5' />
                        })
                        router.push(data.redirect_url)
                    } else {
                        onToggleCart()
                    }
                    return `${data.message}`
                },
                error: e => e,
            })
        }
    }
    const onToggleDeliveryInfo = () => setTab(e => ({ ...e, isShowDeliveryInfo: !e?.isShowDeliveryInfo }))
    const onTogglePaymentMethod = () => setTab(e => ({ ...e, isShowPaymentMethod: !e?.isShowPaymentMethod }))
    const onSetDelivery = (type: any) => setselectedItemIncart(e => ({ ...e, delivery_service: type === e.delivery_service ? undefined : type }))
    return (
        <Actions
            opened={opened}
            onBackdropClick={onToggleCart}
            className=' k-color-brand-primary'>
            <Card
                margin='m-0'
                className=' rounded-b-none'>
                <form
                    onSubmit={handleSubmit(onCheckOut)}
                    className=' w-full h-full k-color-brand-primary max-h-[70vh] overflow-auto'>
                    {/* Your cart */}
                    <motion.div
                        key={(!tab?.isShowDeliveryInfo && !tab?.isShowPaymentMethod) ? "order-info" : "order-info-hidden"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeInOut", duration: 0.3 }}
                        className={`${(!tab?.isShowDeliveryInfo && !tab?.isShowPaymentMethod) ? "block" : 'hidden'} w-full h-full pb-15-safe`}>
                        <h1 className='font-bold text-lg text-brand-primary px-3.5 sticky bg-md-light-surface-1 dark:bg-md-dark-surface-1 z-20 top-0'>Your Cart</h1>
                        {(cartData?.length ?? 0) > 0 ? (
                            <>
                                <List margin='my-0' className='mt-3'>
                                    <ListGroup>
                                        {cartData?.map(item => (
                                            <ListItem
                                                key={item.cart_id}
                                                onClick={() => onSelectItemInCart(item)}
                                                title={item.item_name}
                                                chevron={false}
                                                link
                                                subtitle={
                                                    <div className='flex flex-col text-xs'>
                                                        {item?.size && <span>Size: {changeCase.sentenceCase(item.size)}</span>}
                                                        <span>{`Quantity: ${item.quantity}`}</span>
                                                    </div>
                                                }
                                                after={`₱${(item.price * item.quantity)} ${item?.addon ? `+ ${item?.addon?.price}` : ''}`}
                                                footer={item?.addon && `Addon: ${item.addon.name}`}
                                                media={
                                                    <div className='flex items-center gap-4 pl-3'>
                                                        <Checkbox checked={!!selectedItemIncart?.items?.find(x => x.cart_id === item.cart_id)} readOnly className=' pointer-events-none' />
                                                        <Image
                                                            src={`/api/files?type=item&id=${item.item_id}`}
                                                            alt="test"
                                                            width={300}
                                                            height={300}
                                                            loading='lazy'
                                                            className='aspect-square object-cover h-10 w-10 rounded-xl ' />
                                                    </div>
                                                } />
                                        ))}
                                    </ListGroup>
                                    <ListGroup>
                                        <div className=' px-3.5 mt-2'>
                                            <span>Delivery Service</span>
                                        </div>
                                        <div className='grid grid-cols-2 gap-2 mt-2'>
                                            {selectedItemIncart?.payment_method !== "cash_on_delivery" && (
                                                <ListItem
                                                    link
                                                    onClick={() => onSetDelivery("pickup")}
                                                    chevron={false}
                                                    title="Pickup"
                                                    media={
                                                        <Checkbox
                                                            checked={selectedItemIncart?.delivery_service === "pickup"}
                                                            readOnly
                                                            className=' pointer-events-none' />
                                                    } />
                                            )}
                                            <ListItem
                                                link
                                                onClick={() => onSetDelivery("deliver")}
                                                chevron={false}
                                                title="Deliver"
                                                media={
                                                    <Checkbox
                                                        checked={selectedItemIncart?.delivery_service === "deliver"}
                                                        readOnly
                                                        className=' pointer-events-none' />
                                                } />
                                        </div>
                                    </ListGroup>
                                    <ListGroup className='mt-2'>
                                        <ListItem
                                            onClick={onToggleDeliveryInfo}
                                            title='Additional Information'
                                            link />
                                        <ListItem
                                            onClick={onTogglePaymentMethod}
                                            title='Payment Method'
                                            link
                                            subtitle={
                                                <div className='mt-2 flex gap-2'>
                                                    {selectedItemIncart?.payment_method && <Badge className=' k-color-brand-green '>{changeCase.sentenceCase(selectedItemIncart?.payment_method)}</Badge>}
                                                </div>
                                            } />
                                        <div className='grid grid-cols-2 gap-2'>
                                            {selectedItemIncart?.delivery_service === "deliver" && (
                                                <ListItem
                                                    title='Delivery Fee'
                                                    after={<span>₱{DELIVERY_FEE}</span>} />
                                            )}
                                            <ListItem
                                                title="Total"
                                                after={<span>₱{selectedItemIncart?.items?.reduce((sum, item) => sum + ((item.price * item.quantity) + (item?.addon?.price ?? 0)), 0) + (selectedItemIncart?.delivery_service === "deliver" ? DELIVERY_FEE : 0)}</span>} />
                                        </div>
                                    </ListGroup>
                                </List>
                                <div className=' absolute z-20 bottom-0 left-0 w-full bg-md-light-surface-1 dark:bg-md-dark-surface-1 translucent py-3 px-7'>
                                    <Button
                                        disabled={selectedItemIncart?.items.length <= 0 || !selectedItemIncart?.payment_method || isProcessing}>Check Out</Button>
                                </div>
                            </>
                        ) : (
                            <div className=' p-5 flex items-center justify-center w-full'>
                                <span className='text-xl'>Cart is Empty</span>
                            </div>
                        )}
                    </motion.div>
                    {/* Delivery info */}
                    <motion.div
                        key={tab?.isShowDeliveryInfo ? "delivery-info" : "delivery-info-hidden"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeInOut", duration: 0.3 }}
                        className={`${tab?.isShowDeliveryInfo ? 'block' : 'hidden'} w-full h-full`}>
                        <div className='flex gap-2 items-center'>
                            <Button
                                onClick={onToggleDeliveryInfo}
                                rounded
                                component='a'
                                clear
                                className=' !w-auto !px-3.5 k-color-brand-primary'>
                                <BsArrowLeft className=' h-6 w-6' />
                            </Button>
                            <h2 className='font-bold text-lg text-brand-primary sticky bg-md-light-surface-1 dark:bg-md-dark-surface-1 z-20 top-0'>Additional Information</h2>
                        </div>
                        <div className='flex flex-col gap-2 px-4 py-2'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                                <input
                                    {...register("name")}
                                    defaultValue={session?.user?.name as string}
                                    className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    placeholder="Name" />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="address" className="block text-sm font-medium">Address</label>
                                <input
                                    {...register("address")}
                                    defaultValue={session?.user?.address as string}
                                    className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    placeholder="Address" />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="phone_number" className="block text-sm font-medium">Phone Number</label>
                                <PhoneInput
                                    value={formatPhoneNumberIntl(selectedItemIncart?.phone_number as any)}
                                    className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    placeholder="Phone Number"
                                    defaultCountry='PH'
                                    international={true}
                                    onChange={data => setselectedItemIncart(e => ({ ...e, phone_number: data?.toString() }))} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="message" className="block text-sm font-medium">Message <span className='text-xs opacity-50'>(Optional)</span></label>
                                <textarea
                                    {...register("message")}
                                    className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    placeholder="Message" />
                            </div>
                        </div>
                    </motion.div>
                    {/* Payment Method & Deliver */}
                    <motion.div
                        key={tab?.isShowPaymentMethod ? "payment-info" : 'payment-info-hidden'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeInOut", duration: 0.3 }}
                        className={`${tab?.isShowPaymentMethod ? 'block' : 'hidden'} w-full h-full`}>
                        <div className='flex gap-2 items-center'>
                            <Button
                                onClick={onTogglePaymentMethod}
                                rounded
                                component='a'
                                clear
                                className=' !w-auto !px-3.5 k-color-brand-primary'>
                                <BsArrowLeft className=' h-6 w-6' />
                            </Button>
                            <h2 className='font-bold text-lg text-brand-primary sticky bg-md-light-surface-1 dark:bg-md-dark-surface-1 z-20 top-0'>Payment Method</h2>
                        </div>
                        <List margin='my-0'>
                            <div className='grid grid-cols-2 gap-2 mt-2'>
                                <ListItem
                                    link
                                    onClick={() => onSelectPaymentMethod("paypal")}
                                    chevron={false}
                                    title="PayPal"
                                    media={
                                        <div className='flex gap-3 items-center'>
                                            <Radio
                                                checked={selectedItemIncart?.payment_method === "paypal"}
                                                readOnly
                                                className=' pointer-events-none' />
                                            <BsPaypal className=' h-5 w-5' />
                                        </div>
                                    } />
                                <ListItem
                                    link
                                    chevron={false}
                                    title="GCash"
                                    onClick={() => onSelectPaymentMethod("gcash")}
                                    media={
                                        <div className='flex gap-3 items-center'>
                                            <Radio
                                                checked={selectedItemIncart?.payment_method === "gcash"}
                                                readOnly
                                                className=' pointer-events-none' />
                                            <Image
                                                src={GcashLogo}
                                                alt="Gcash"
                                                className='h-5 w-5 object-contain rounded' />
                                        </div>
                                    } />
                                <ListItem
                                    link
                                    className=' col-span-full'
                                    chevron={false}
                                    title="Cash on Delivery"
                                    onClick={() => onSelectPaymentMethod("cash_on_delivery")}
                                    media={
                                        <div className='flex gap-3 items-center'>
                                            <Radio
                                                checked={selectedItemIncart?.payment_method === "cash_on_delivery"}
                                                readOnly
                                                className=' pointer-events-none' />
                                            <BiMoney className='h-5 w-5' />
                                        </div>
                                    } />
                            </div>
                        </List>
                        {selectedItemIncart?.payment_method === "gcash" && (
                            <div className='mx-3 mt-2 flex flex-col gap-2'>
                                <span className='text-base'>Gcash Proof of Transaction</span>
                                <ImageInput
                                    {...register("gcash_image")}
                                    accept='image/*'
                                    name='gcash_image' />
                            </div>
                        )}
                    </motion.div>
                </form>
            </Card>
        </Actions >
    )
}

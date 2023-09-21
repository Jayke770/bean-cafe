"use client"
import {
    Actions,
    List,
    ListGroup,
    ListItem,
    Card,
    Checkbox,
    Radio,
    Button
} from 'konsta/react'
import * as changeCase from 'change-case'
import type { ApiResponse, UserCart, paymentMethod } from "@/types";
import { useLocalstorageState } from 'rooks'
import Image from 'next/image';
import { BsPaypal } from 'react-icons/bs'
import GcashLogo from '@/public/images/gcash.png'
import { BiMoney } from 'react-icons/bi'
import ImageInput from '@/components/ImageInput';
import toast from 'react-hot-toast';
interface selectItemInCart {
    items: UserCart[],
    isProcessing?: boolean,
    payment_method?: paymentMethod
}
export default function Cart({
    opened,
    onToggleCart,
    cartData
}: {
    opened?: boolean,
    onToggleCart: () => void,
    cartData?: UserCart[]
}) {
    const [selectedItemIncart, setselectedItemIncart] = useLocalstorageState<selectItemInCart>("for-check-out", { items: [] })
    const onSelectItemInCart = (item: UserCart) => {
        const index = selectedItemIncart.items.findIndex(x => x.id === item.id)
        if (index < 0) {
            setselectedItemIncart(e => ({ ...e, items: [...e.items, item] }))
        } else {
            let new_items = selectedItemIncart.items
            new_items.splice(index, 1)
            setselectedItemIncart(e => ({ ...e, items: new_items }))
        }
    }
    const onSelectPaymentMethod = (payment_method?: paymentMethod) => setselectedItemIncart(e => ({ ...e, payment_method: e?.payment_method === payment_method ? undefined : payment_method }))
    const onCheckOut = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedItemIncart?.isProcessing) {
            setselectedItemIncart(e => ({ ...e, isProcessing: true }))
            toast.promise(((): Promise<ApiResponse> => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const req = await fetch("/api/user/items/checkout", {
                            method: 'post',
                            body: new FormData(e.target as any)
                        })
                        if (req.ok) {
                            const res: ApiResponse = await req.json()
                            setselectedItemIncart(e => ({ ...e, isProcessing: false }))
                            res?.status ? resolve(res) : reject(res.message)
                        } else {
                            throw new Error(`${req.status} ${req.statusText}`)
                        }
                    } catch (e: any) {
                        setselectedItemIncart(e => ({ ...e, isProcessing: false }))
                        reject(e.message)
                    }
                })
            })(), {
                loading: 'Processing order...',
                success: (data: ApiResponse) => {
                    if (data?.status && data?.redirect_url) {

                    }
                    return `${data.message}`
                },
                error: e => e,
            })
        }
    }
    return (
        <Actions
            opened={opened}
            onBackdropClick={onToggleCart}
            className=' k-color-brand-primary'>
            <Card
                margin='m-0'
                className=' rounded-b-none'>
                <form
                    onSubmit={onCheckOut}
                    className='k-color-brand-primary max-h-[70vh] overflow-auto pb-15-safe'>
                    <h1 className='font-bold text-lg text-brand-primary px-3.5 sticky bg-md-light-surface-1 dark:bg-md-dark-surface-1 z-20 top-0'>Your Cart</h1>
                    {(cartData?.length ?? 0) > 0 ? (
                        <>
                            <input type='hidden' value={JSON.stringify(selectedItemIncart.items)} name='items' />
                            <input type='hidden' value={JSON.stringify(selectedItemIncart.payment_method)} name='payment_method' />
                            <List margin='my-0' className='mt-3'>
                                <ListGroup>
                                    {cartData?.map(item => (
                                        <ListItem
                                            key={item.id}
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
                                            after={`₱${(item.price * item.quantity).toLocaleString()}`}
                                            media={
                                                <div className='flex items-center gap-4 pl-3'>
                                                    <Checkbox checked={!!selectedItemIncart?.items?.find(x => x.id === item.id)} readOnly className=' pointer-events-none' />
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
                                <ListGroup className='mt-2'>
                                    <span className='p-4'>Payment Method</span>
                                    <div className='grid grid-cols-2 gap-2 mt-2'>
                                        <ListItem
                                            link
                                            onClick={() => onSelectPaymentMethod("paypal")}
                                            chevron={false}
                                            title="PayPal"
                                            media={
                                                <div className='flex gap-3 items-center'>
                                                    <Radio checked={selectedItemIncart?.payment_method === "paypal"} readOnly className=' pointer-events-none' />
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
                                                    <Radio checked={selectedItemIncart?.payment_method === "gcash"} readOnly className=' pointer-events-none' />
                                                    <Image
                                                        src={GcashLogo}
                                                        alt="Gcash"
                                                        className='h-5 w-5 object-contain rounded' />
                                                </div>
                                            } />
                                        <ListItem
                                            link
                                            chevron={false}
                                            title="Cash"
                                            onClick={() => onSelectPaymentMethod("cash")}
                                            media={
                                                <div className='flex gap-3 items-center'>
                                                    <Radio checked={selectedItemIncart?.payment_method === "cash"} readOnly className=' pointer-events-none' />
                                                    <BiMoney className='h-5 w-5' />
                                                </div>
                                            } />
                                    </div>
                                </ListGroup>
                            </List>
                            {selectedItemIncart?.payment_method === "gcash" && (
                                <div className='mx-3 mt-2 flex flex-col gap-2'>
                                    <span className='text-base'>Gcash Proof of Transaction</span>
                                    <ImageInput accept='image/*' name='gcash-tx' />
                                </div>
                            )}
                            <div className=' absolute z-20 bottom-0 left-0 w-full bg-md-light-surface-1 dark:bg-md-dark-surface-1 translucent py-3 px-3.5 grid grid-cols-5'>
                                <div className=' col-span-2 flex justify-start items-center'>
                                    <div className='flex items-baseline gap-1'>
                                        <span className=' font-medium text-lg'>Total: </span>
                                        <span className='font-base'>₱{selectedItemIncart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                                    </div>
                                </div>
                                <Button
                                    className=' col-span-3'
                                    disabled={selectedItemIncart?.items.length <= 0 || !selectedItemIncart?.payment_method || selectedItemIncart?.isProcessing}>Check Out</Button>
                            </div>
                        </>
                    ) : (
                        <div className=' p-5 flex items-center justify-center w-full'>
                            <span className='text-xl'>Cart is Empty</span>
                        </div>
                    )}
                </form>
            </Card>
        </Actions>
    )
}
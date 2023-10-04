"use client"
import { Orders } from '@lib/Admin/orders'
import moment from 'moment-timezone'
import * as changeCase from 'change-case'
import OrderStatus from '@/components/orderStatus'
import CountUp from 'react-countup'
import { Dialog, DialogButton, List, ListItem } from 'konsta/react'
import { useCallback, useState } from 'react'
import { Orders as Ord } from '@/types'
import Image from 'next/image'
import emoji from 'react-easy-emoji'
export default function RecentOrders() {
    const { orders } = Orders()
    const [viewOrder, setViewOrder] = useState<Ord | undefined>()
    const onSetViewOrder = useCallback((data?: Ord) => setViewOrder(e => data), [])
    return (
        <>
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                    <div className="border rounded-lg shadow dark:border-brand-primary/50 border-brand-secondary/50">
                        <div className="py-3 px-4 flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between lg:items-center">
                            <div className='text-brand-primary font-bold text-xl'>Recent Orders</div>
                            <div className='flex flex-col-reverse md:flex-row gap-2'>
                                <div className="relative w-full lg:max-w-xs">
                                    <label htmlFor="hs-table-search" className="sr-only">Search</label>
                                    <input
                                        type="text"
                                        name="hs-table-search"
                                        id="hs-table-search"
                                        className="py-3 pl-10 pr-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                        placeholder="Search for orders" />
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                                        <svg className="h-3.5 w-3.5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <select
                                    className="py-3 px-4 w-full lg:w-auto dark:bg-transparent dark:focus:bg-black dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                    <option>All</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                                <thead className=" k-color-brand-primary bg-md-light-surface-1 dark:bg-md-dark-surface-1">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Payment Method</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Total Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Paid</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                                    {orders?.map(order => (
                                        <tr
                                            onClick={() => onSetViewOrder(order)}
                                            className=' cursor-pointer '
                                            key={order.orderId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{order.orderId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{order?.name ?? "N/A"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{changeCase.sentenceCase(order.payment_method ?? "")}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                <CountUp
                                                    decimals={2}
                                                    prefix='₱ '
                                                    end={parseFloat(order.total_payment)} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                <OrderStatus status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                {emoji(order?.isPaid ? "✅" : "❌")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{moment(order.created).fromNow()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                className=' k-color-brand-primary w-full md:w-160'
                opened={!!viewOrder}
                onBackdropClick={() => onSetViewOrder(undefined)}
                title="Order Info"
                buttons={
                    <>
                        <DialogButton className=' k-color-brand-red'>Disapprove</DialogButton>
                        <DialogButton className=' k-color-brand-green'>Approve</DialogButton>
                    </>
                }
                content={
                    <div className='flex flex-col '>
                        <List margin='my-0' nested>
                            {viewOrder?.items.map(item => (
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
                                <span className=' font-bold'>{viewOrder?.orderId}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className=' text-sm'>Name:</span>
                                <span className=' font-bold'>{viewOrder?.name ?? "N/A"}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className=' text-sm'>Order Status:</span>
                                <OrderStatus status={viewOrder?.status} />
                            </div>
                            <div className='flex justify-between'>
                                <span className=' text-sm'>Payment Method:</span>
                                <span className=' text-sm font-bold'>{changeCase.sentenceCase(viewOrder?.payment_method ?? "")}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className=' text-sm'>Total Payment:</span>
                                <CountUp
                                    className=' text-sm font-bold'
                                    prefix='₱ '
                                    end={parseFloat(viewOrder?.total_payment ?? "0")} />
                            </div>
                            <div className='flex justify-between'>
                                <span className=' text-sm'>Paid:</span>
                                {emoji(viewOrder?.isPaid ? "✅" : "❌")}
                            </div>
                        </div>
                    </div>
                }>

            </Dialog>
        </>
    )
}
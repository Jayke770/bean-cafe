"use client"
import { motion } from 'framer-motion'
import { Card, List, ListItem, Segmented, SegmentedButton } from 'konsta/react'
import { UserInfo, UserOrders, UserCart } from '@lib/Admin/users'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import * as changeCase from 'change-case'
import moment from 'moment-timezone'
import Skeleton from 'react-loading-skeleton'
import { useLocalstorageState } from 'rooks'
import OrderStatusBadge from "@/components/orderStatus";
type Tab = "orders" | "cart" | "settings"
export default function UserData() {
    const params = useParams()
    const { userInfo, userInfoLoading } = UserInfo(params?.id as any)
    const { userOrders, userOrdersLoading } = UserOrders(params?.id as any)
    const { userCart, userCartLoading } = UserCart(params?.id as any)
    const [tab, setTab] = useLocalstorageState<Tab>("dashboard-user-tab", "orders")
    const onSetTab = (tab: Tab) => setTab(e => tab)
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
                        <div className=" h-full w-full flex justify-center flex-col  overflow-auto p-4">
                            {userInfoLoading ? (
                                <>
                                    <div className='flex flex-col w-full items-center justify-center gap-2 py-10'>
                                        <Skeleton width={"9rem"} height={"9rem"} borderRadius={"100%"} />
                                        <Skeleton height={"1.25rem"} width={"5rem"} />
                                    </div>
                                    <div className='flex flex-col gap-4 px-1'>
                                        <div className='w-full'>
                                            <Skeleton height={"1.25rem"} width={"5rem"} />
                                            <div className='flex flex-col gap-1.5 mt-2 w-full'>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <Skeleton width={"1rem"} />
                                                    <Skeleton width={"2rem"} />
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <Skeleton width={"2rem"} />
                                                    <Skeleton width={"2rem"} />
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <Skeleton width={"3rem"} />
                                                    <Skeleton width={"2rem"} />
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <Skeleton width={"4rem"} />
                                                    <Skeleton width={"2rem"} />
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <Skeleton width={"5rem"} />
                                                    <Skeleton width={"2rem"} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            <Skeleton height={"1.25rem"} width={"5rem"} />
                                            <div className='flex flex-col gap-1.5 mt-2 w-full'>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <Skeleton width={"2.5rem"} />
                                                    <Skeleton width={"2.5rem"} />
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <Skeleton width={"2rem"} />
                                                    <Skeleton width={"2rem"} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='flex flex-col w-full items-center justify-center gap-2 py-10'>
                                        <Image
                                            priority
                                            src={userInfo?.image ?? "/logo.png"}
                                            alt={userInfo?.name ?? "loading"}
                                            width={300}
                                            height={300}
                                            className=' aspect-square h-36 w-36 shadow-xl rounded-full  object-cover lg:object-contain ' />
                                        <h1 className='text-xl font-bold'>{userInfo?.name}</h1>
                                    </div>
                                    <div className='flex flex-col gap-4 px-1'>
                                        <div className='w-full'>
                                            <h2 className='text-lg'>Information</h2>
                                            <div className='flex flex-col gap-1.5 mt-2 w-full'>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <span className="text-zinc-600 dark:text-zinc-300">Phone Number</span>
                                                    <span>{userInfo?.phone_number}</span>
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <span className="text-zinc-600 dark:text-zinc-300">Email</span>
                                                    <span>{userInfo?.email}</span>
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <span className="text-zinc-600 dark:text-zinc-300">Address</span>
                                                    <span>{userInfo?.address}</span>
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <span className="text-zinc-600 dark:text-zinc-300">Role</span>
                                                    <span>{changeCase.sentenceCase(userInfo?.role ?? "")}</span>
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <span className="text-zinc-600 dark:text-zinc-300">Account Created</span>
                                                    <span>{moment(userInfo?.created).fromNow()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            <h2 className='text-lg'>Other</h2>
                                            <div className='flex flex-col gap-1.5 mt-2 w-full'>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <span className="text-zinc-600 dark:text-zinc-300">Total Orders</span>
                                                    <span>{userInfo?.orders.length}</span>
                                                </div>
                                                <div className='flex w-full justify-between items-baseline text-sm'>
                                                    <span className="text-zinc-600 dark:text-zinc-300">Item in Cart</span>
                                                    <span>{userInfo?.cart.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

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
                        <div className='lg:w-80'>
                            <Segmented strong className=' k-color-brand-primary'>
                                <SegmentedButton
                                    strong
                                    active={tab === "orders"}
                                    onClick={() => onSetTab("orders")}>Orders</SegmentedButton>
                                <SegmentedButton
                                    strong
                                    active={tab === "cart"}
                                    onClick={() => onSetTab("cart")}>Cart</SegmentedButton>
                                <SegmentedButton
                                    strong
                                    active={tab === "settings"}
                                    onClick={() => onSetTab("settings")}>Settings</SegmentedButton>
                            </Segmented>
                        </div>
                        <List margin='my-0'>
                            {tab === "orders" && (
                                <>
                                    {userOrders?.map(order => (
                                        <ListItem
                                            key={order.orderId}
                                            title={
                                                <div className="flex flex-col">
                                                    {order.items.map(item => (
                                                        <div key={item.id}>
                                                            <span className="text-sm">{item.item_name} {item.size ? `- ${changeCase.sentenceCase(item.size ?? "")}` : ""}</span>
                                                            <span className="text-xs"> - {item.quantity}x</span>
                                                        </div>
                                                    ))}
                                                    <span className="font-bold text-sm">Total: {`₱${order.total_payment}`}</span>
                                                </div>
                                            }
                                            after={
                                                <OrderStatusBadge status={order.status} />
                                            } />
                                    ))}
                                </>
                            )}
                            {tab === "cart" && (
                                <>
                                    {userCart?.map(item => (
                                        <ListItem
                                            key={item.cart_id}
                                            title={item.item_name}
                                            chevron={false}
                                            subtitle={
                                                <div className='flex flex-col text-xs'>
                                                    {item?.size && <span>Size: {changeCase.sentenceCase(item.size)}</span>}
                                                    <span>{`Quantity: ${item.quantity}`}</span>
                                                    {item?.addon && <span>{`Addon: ${item.addon.name} - ₱ ${item.addon.price}`}</span>}
                                                </div>
                                            }
                                            footer={`Total: ₱${(item.price * item.quantity)}`}
                                            media={
                                                <Image
                                                    src={`/api/files?type=item&id=${item.item_id}`}
                                                    alt="test"
                                                    width={300}
                                                    height={300}
                                                    loading='lazy'
                                                    className='aspect-square object-cover h-10 w-10 rounded-xl ' />
                                            } />
                                    ))}
                                </>
                            )}
                        </List>
                    </Card>
                </motion.div>
            </div>
        </>
    )
}
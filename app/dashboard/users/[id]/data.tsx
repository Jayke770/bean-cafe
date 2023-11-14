"use client"
import { motion } from 'framer-motion'
import { Button, Card, Dialog, List, ListItem, Popover, Segmented, SegmentedButton, Radio, DialogButton } from 'konsta/react'
import { UserInfo, UserOrders, UserCart } from '@lib/Admin/users'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import * as changeCase from 'change-case'
import moment from 'moment-timezone'
import Skeleton from 'react-loading-skeleton'
import { useLocalstorageState } from 'rooks'
import OrderStatusBadge from "@/components/orderStatus";
import { FaUserShield } from "react-icons/fa6"
import { BsThreeDots } from 'react-icons/bs'
import { useState } from 'react'
import type { ApiResponse, UserModel } from "@/types";
import toast from 'react-hot-toast'
type Tab = "orders" | "cart" | "settings"
interface UpdateUserData {
    openRoleDialog?: boolean,
    role?: UserModel['role']
}
export default function UserData() {
    const params = useParams()
    const [updateUserData, setUpdateUserData] = useState<UpdateUserData>()
    const { userInfo, userInfoLoading, mutate: updateUserInfo } = UserInfo(params?.id as any)
    const { userOrders, userOrdersLoading } = UserOrders(params?.id as any)
    const { userCart, userCartLoading } = UserCart(params?.id as any)
    const [tab, setTab] = useLocalstorageState<Tab>("dashboard-user-tab", "orders")
    const onSetTab = (tab: Tab) => setTab(e => tab)
    const onToggleUserRole = () => setUpdateUserData(e => ({ ...e, openRoleDialog: !e?.openRoleDialog, role: userInfo?.role }))
    const onUpdateRole = () => {
        toast.promise(((): Promise<ApiResponse> => {
            return new Promise(async (resolve, reject) => {
                try {
                    const req = await fetch("/api/dashboard/users?type=update-role", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ role: updateUserData?.role, id: userInfo._id })
                    })
                    if (req.ok) {
                        const res: ApiResponse = await req.json()
                        updateUserInfo()
                        res?.status ? resolve(res) : reject(res.message)
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                } catch (e: any) {
                    reject(e.message)
                }
            })
        })(), {
            loading: 'Updating Role...',
            success: (data: ApiResponse) => `${data.message}`,
            error: e => e,
        })
    }
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
                        <div className=" h-full w-full flex flex-col  overflow-auto p-4">
                            {userInfoLoading ? (
                                <>
                                    <div className='flex flex-col w-full items-center justify-center gap-2'>
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
                            {tab === "settings" && (
                                <>
                                    <ListItem
                                        title="Change User Role"
                                        media={
                                            <FaUserShield className='h-5 w-5' />
                                        }
                                        subtitle={`${changeCase.sentenceCase(userInfo?.role ?? "")}`}
                                        after={
                                            <Button
                                                component='div'
                                                role='button'
                                                small
                                                tonal
                                                rounded
                                                onClick={onToggleUserRole}
                                                className='role-select !px-2'>
                                                <BsThreeDots className=' h-6 w-6' />
                                            </Button>
                                        } />
                                </>
                            )}
                        </List>
                    </Card>
                </motion.div>
            </div>
            <Dialog
                className=' k-color-brand-primary w-full lg:w-96'
                opened={updateUserData?.openRoleDialog}
                onBackdropClick={onToggleUserRole}
                title="Update User Role"
                content={
                    <List nested className='-mx-4'>
                        <ListItem
                            label
                            onClick={() => setUpdateUserData(e => ({ ...e, role: "admin" }))}
                            title="Admin"
                            after={
                                <Radio
                                    component="div"
                                    checked={updateUserData?.role === "admin"}
                                />
                            }
                        />
                        <ListItem
                            label
                            title="User"
                            onClick={() => setUpdateUserData(e => ({ ...e, role: "user" }))}
                            after={
                                <Radio
                                    component="div"
                                    checked={updateUserData?.role === "user"}
                                />
                            }
                        />
                    </List>
                }
                buttons={
                    <>
                        <DialogButton
                            onClick={onToggleUserRole}
                            className=' k-color-brand-red'>Cancel</DialogButton>
                        <DialogButton
                            onClick={onUpdateRole}
                            className=' k-color-brand-primary'>Update</DialogButton>
                    </>
                } />
        </>
    )
}
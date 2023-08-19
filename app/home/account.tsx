"use client"
import type { Session } from 'next-auth'
import { Actions, Preloader, Button, Card, List, ListItem } from 'konsta/react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLocalstorageState } from 'rooks'
import { useCallback } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { signIn, signOut } from 'next-auth/react'
interface Props {
    viewAccount: boolean,
    onToggleAccount: () => void,
    session: Session | null,
    status: "authenticated" | "loading" | "unauthenticated"
}
type User_Orders_Tab = "completed" | "pending" | "cancelled"
export default function Account({
    viewAccount,
    onToggleAccount,
    session,
    status
}: Props) {
    const [UserOrdersTab, setUserUsersTab] = useLocalstorageState<User_Orders_Tab>("user-orders-tab", "completed")
    const onToggleUserOrdersTab = useCallback((data: User_Orders_Tab) => setUserUsersTab(data), [setUserUsersTab])
    return (
        <Actions
            opened={viewAccount}
            onBackdropClick={onToggleAccount}
            className=' k-color-brand-primary'>
            <Card
                margin='m-0'
                className=' rounded-b-none'>
                {status === "loading" && (
                    <div className='flex w-full justify-center items-center'>
                        <Preloader />
                    </div>
                )}
                {status === "unauthenticated" && (
                    <div className='flex flex-col w-full gap-2 px-2'>
                        <span className='font-bold text-xl text-brand-primary pb-3'>Get started</span>
                        <Button
                            onClick={() => signIn("google", { callbackUrl: "/home" })}
                            clear
                            outline
                            className=' k-color-brand-white'>
                            <div className='h-full w-full flex items-center justify-center gap-2'>
                                <FcGoogle className=' h-5 w-5' />
                                <span className=' text-black dark:text-zinc-200 '>Sign in with Google</span>
                            </div>
                        </Button>
                        <hr className=' border-1 border-black dark:border-brand-primary my-3' />
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="name" className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="Jhon Doe"
                                aria-describedby="name" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="input-label-with-helper-text" className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                id="input-label-with-helper-text"
                                className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="your@email.com"
                                aria-describedby="hs-input-helper-text" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="pass" className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                id="pass"
                                className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="******"
                                aria-describedby="pass" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="cpass" className="block text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                id="cpass"
                                className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="******"
                                aria-describedby="cpass" />
                        </div>
                        <div className='flex flex-col gap-4 mt-3'>
                            <Button>
                                Register
                            </Button>
                            <div className='w-full flex items-center justify-center gap-1'>
                                <span className=' font-medium'>Already have an Account?</span>
                                <button
                                    type='button'
                                    className=' font-bold underline outline-none cursor-pointer'>Login</button>
                            </div>
                        </div>
                    </div>
                )}
                {status === "authenticated" && (
                    <>
                        <div className='flex items-center flex-col w-full justify-center py-4'>
                            <Image
                                width={300}
                                height={300}
                                src={session?.user?.image ?? "/logo.png"}
                                alt='test'
                                className='rounded-full h-36 w-36' />
                            <div className='flex flex-col mt-3'>
                                <span className='text-xl font-bold text-brand-primary'>{session?.user?.name}</span>
                            </div>
                        </div>
                        <motion.div
                            className=' w-full grid grid-cols-3 p-1 gap-2  dark:bg-brand-secondary shadow rounded-xl'>
                            <button
                                onClick={() => onToggleUserOrdersTab("completed")}
                                type='button'
                                className=' cursor-pointer relative h-10 outline-none'>
                                <div className=' absolute left-0 top-0 z-10 text-black dark:text-white flex items-center justify-center w-full h-full'>Completed</div>
                                {UserOrdersTab === "completed" && <motion.div layoutId="orders" className=" z-0 rounded-lg bg-brand-primary/60 absolute top-0 w-full left-0 h-full" />}
                            </button>
                            <button
                                onClick={() => onToggleUserOrdersTab("pending")}
                                type='button'
                                className=' cursor-pointer relative h-10 outline-none'>
                                <div className=' absolute left-0 top-0 z-10 text-black dark:text-white flex items-center justify-center w-full h-full'>Pending</div>
                                {UserOrdersTab === "pending" && <motion.div layoutId="orders" className=" z-0 rounded-lg bg-brand-primary/60 absolute top-0 w-full left-0 h-full" />}
                            </button>
                            <button
                                onClick={() => onToggleUserOrdersTab("cancelled")}
                                type='button'
                                className=' cursor-pointer relative h-10 outline-none'>
                                <div className=' absolute left-0 top-0 z-10 text-black dark:text-white flex items-center justify-center w-full h-full'>Cancelled</div>
                                {UserOrdersTab === "cancelled" && <motion.div layoutId="orders" className=" z-0 rounded-lg bg-brand-primary/60 absolute top-0 w-full left-0 h-full" />}
                            </button>
                        </motion.div>
                        <div className='max-h-96 overflow-auto'>
                            <List margin='my-0' className='mt-2'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <ListItem
                                        key={i}
                                        title={`Item ${i + 1}`}
                                        link
                                        chevron={false}
                                        subtitle={`Quantity: 1`}
                                        after={`₱${i + 1}`}
                                        media={
                                            <Image
                                                src={`/images/catalog/${i + 1}.jpg`}
                                                alt="test"
                                                width={300}
                                                height={300}
                                                loading='lazy'
                                                className='aspect-square h-10 w-10 rounded-xl ' />
                                        } />
                                ))}
                            </List>
                        </div>
                        <div className='mt-2 px-3.5'>
                            <Button
                                onClick={() => signOut()}
                                small
                                className=' k-color-brand-green'>Sign out</Button>
                        </div>
                    </>
                )}
            </Card>
        </Actions>
    )
}
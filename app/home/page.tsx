"use client"
import { useCallback, useState } from 'react'
import { Navbar, Button, Card, Link, Icon, Actions, List, ListItem, ListGroup, Checkbox, Radio } from 'konsta/react'
import { motion, Variants } from 'framer-motion'
import { useLocalstorageState } from 'rooks'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { IoMdCart } from 'react-icons/io'
import Image from 'next/image'
import { BsPaypal } from 'react-icons/bs'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import GcashLogo from '@/public/images/gcash.png'
import { BiMoney } from 'react-icons/bi'
import UserLogo from '@/public/user.png'
import { useSession } from 'next-auth/react'
const mainvariants: Variants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    },
    exit: {
        opacity: 0
    }
}
const categories = ['All', 'Coffee', 'Non Coffee', 'Cakes', 'Flappe/Blended', 'Teas', 'Snacks', 'Others']
const sizes = ["Short", "Tall", "Grande", "Venti"]
type User_Orders_Tab = "completed" | "pending" | "cancelled"
export default function Home() {
    const { data: session, status } = useSession()
    const [tab, setTab] = useLocalstorageState<string>("home-tab", "All")
    const [UserOrdersTab, setUserUsersTab] = useLocalstorageState<User_Orders_Tab>("user-orders-tab", "completed")
    const onChangeTab = useCallback((data: string) => setTab(data), [setTab])
    const [viewCart, setViewCart] = useState<boolean>(false)
    const [viewAccount, setViewAccount] = useState<boolean>(false)
    const [viewItem, setViewItem] = useState<boolean>(false)
    const onToggleCart = useCallback(() => setViewCart(e => !e), [setViewCart])
    const onToggleAccount = useCallback(() => setViewAccount(e => !e), [setViewAccount])
    const onToggleItem = useCallback(() => setViewItem(e => !e), [setViewItem])
    const onToggleUserOrdersTab = useCallback((data: User_Orders_Tab) => setUserUsersTab(data), [setUserUsersTab])
    return (
        <>
            <motion.main
                variants={mainvariants}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                className='h-full w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-black pb-5-safe'>
                <Navbar
                    component='nav'
                    medium
                    className=' k-color-brand-primary'
                    transparent={true}
                    title="Bean's Cafe"
                    right={
                        <>
                            <Link
                                onClick={onToggleCart}
                                navbar
                                iconOnly
                                className=' k-color-brand-primary'>
                                <Icon badge="2">
                                    <IoMdCart className='h-7 w-7' />
                                </Icon>
                            </Link>
                            <Link
                                onClick={onToggleAccount}
                                navbar
                                iconOnly
                                className=' k-color-brand-primary'>
                                <Icon>
                                    <IoPersonCircleSharp className='h-7 w-7' />
                                </Icon>
                            </Link>
                        </>
                    }
                />
                <div className='px-4 pb-4'>
                    <h1 className='dark:text-zinc-400 font-bold '>Best coffee for you</h1>
                </div>
                <div className='p-4'>
                    <section className='w-full z-10 bg-brand-white translucent dark:bg-black whitespace-nowrap snap-proximity gap-2 overflow-auto py-3 sticky top-16 '>
                        {categories.map(category => (
                            <Button
                                key={category}
                                clear={category !== tab}
                                onClick={() => onChangeTab(category as any)}
                                className='!w-auto k-color-brand-green inline-flex ml-2 first:ml-0'
                                rounded>
                                {category}
                            </Button>
                        ))}
                    </section>
                    <section className='grid gap-2.5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-5'>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <motion.div
                                onClick={onToggleItem}
                                key={i}
                                whileTap={{ scale: 0.95 }}
                                className=' cursor-pointer'>
                                <Card
                                    margin='m-0'
                                    className='z-0 k-color-brand-secondary'>
                                    <div className='shadow-lg rounded-2xl overflow-hidden'>
                                        <Image
                                            src={`/images/catalog/${i + 1}.jpg`}
                                            alt="test"
                                            width={300}
                                            height={300}
                                            loading='lazy'
                                            className='aspect-square ' />
                                    </div>
                                    <div className='flex flex-col mt-3'>
                                        <span className='text-xl font-bold'>Item {i + 1}</span>
                                        <span className=' text-brand-primary font-bold text-base'>₱{i + 1}</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </section>
                </div>
            </motion.main>
            {/* Cart */}
            <Actions
                opened={viewCart}
                onBackdropClick={onToggleCart}
                className=' k-color-brand-primary'>
                <Card
                    margin='m-0'
                    className=' rounded-b-none'>
                    <h1 className='font-bold text-lg text-brand-primary px-3.5'>Your Cart</h1>
                    <List margin='my-0' className='mt-3'>
                        <ListGroup>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <ListItem
                                    key={i}
                                    title={`Item ${i + 1}`}
                                    chevron={false}
                                    subtitle={`Quantity: 1`}
                                    after={`₱${i + 1}`}
                                    media={
                                        <div className='flex items-center gap-4 pl-3'>
                                            <Checkbox />
                                            <Image
                                                src={`/images/catalog/${i + 1}.jpg`}
                                                alt="test"
                                                width={300}
                                                height={300}
                                                loading='lazy'
                                                className='aspect-square h-10 w-10 rounded-xl ' />
                                        </div>
                                    } />
                            ))}
                        </ListGroup>
                        <ListGroup className='mt-2'>
                            <span className='p-4'>Payment</span>
                            <div className='grid grid-cols-2 gap-2 mt-2'>
                                <ListItem
                                    link
                                    chevron={false}
                                    title="PayPal"
                                    media={
                                        <div className='flex gap-3 items-center'>
                                            <Radio />
                                            <BsPaypal className=' h-5 w-5' />
                                        </div>
                                    } />
                                <ListItem
                                    link
                                    chevron={false}
                                    title="GCash"
                                    media={
                                        <div className='flex gap-3 items-center'>
                                            <Radio />
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
                                    media={
                                        <div className='flex gap-3 items-center'>
                                            <Radio />
                                            <BiMoney className='h-5 w-5' />
                                        </div>
                                    } />
                            </div>
                        </ListGroup>
                    </List>
                    <div className='px-3 mt-5'>
                        <Button>Check Out</Button>
                    </div>
                </Card>
            </Actions>
            {/* Account */}
            <Actions
                opened={viewAccount}
                onBackdropClick={onToggleAccount}
                className=' k-color-brand-primary'>
                <Card
                    margin='m-0'
                    className=' rounded-b-none'>
                    <div className='flex items-center flex-col w-full justify-center py-4'>
                        <Image
                            width={300}
                            height={300}
                            src={session?.user?.image ?? "/logo.png"}
                            alt='test'
                            className='rounded-full h-36 w-36' />
                        <div className='flex flex-col mt-3'>
                            <span className='text-xl font-bold text-brand-primary'>Jhon Doe</span>
                        </div>
                    </div>
                    <motion.div
                        className=' w-full grid grid-cols-3 p-1 gap-2 bg-brand-secondary shadow rounded-xl'>
                        <button
                            onClick={() => onToggleUserOrdersTab("completed")}
                            type='button'
                            className=' cursor-pointer relative h-10 outline-none'>
                            <div className=' absolute left-0 top-0 z-10 text-white flex items-center justify-center w-full h-full'>Completed</div>
                            {UserOrdersTab === "completed" && <motion.div layoutId="orders" className=" z-0 rounded-lg bg-brand-primary/60 absolute top-0 w-full left-0 h-full" />}
                        </button>
                        <button
                            onClick={() => onToggleUserOrdersTab("pending")}
                            type='button'
                            className=' cursor-pointer relative h-10 outline-none'>
                            <div className=' absolute left-0 top-0 z-10 text-white flex items-center justify-center w-full h-full'>Pending</div>
                            {UserOrdersTab === "pending" && <motion.div layoutId="orders" className=" z-0 rounded-lg bg-brand-primary/60 absolute top-0 w-full left-0 h-full" />}
                        </button>
                        <button
                            onClick={() => onToggleUserOrdersTab("cancelled")}
                            type='button'
                            className=' cursor-pointer relative h-10 outline-none'>
                            <div className=' absolute left-0 top-0 z-10 text-white flex items-center justify-center w-full h-full'>Cancelled</div>
                            {UserOrdersTab === "cancelled" && <motion.div layoutId="orders" className=" z-0 rounded-lg bg-brand-primary/60 absolute top-0 w-full left-0 h-full" />}
                        </button>
                    </motion.div>
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
                </Card>
            </Actions>
            {/* View Item */}
            <Actions
                opened={viewItem}
                onBackdropClick={onToggleItem}
                className=' k-color-brand-primary'>
                <Card
                    margin='m-0'
                    className=' rounded-b-none'>
                    <div className='flex flex-col'>
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-col'>
                                <span className='font-bold text-xl'>Item 1</span>
                                <span className='text-sm text-zinc-300'>Item Description</span>
                            </div>
                            <div className='flex justify-end items-center'>
                                <span className=' text-brand-primary font-bold text-lg'>₱100</span>
                            </div>
                        </div>
                        <List margin='my-0' className='mt-5'>
                            <ListGroup>
                                <span className=' px-3 text-zinc-300'>Select Size</span>
                                <div className='grid grid-cols-2 gap-2'>
                                    {sizes.map((size, i) => (
                                        <ListItem
                                            key={size}
                                            title={size}
                                            subtitle={`${i + 1}oz`}
                                            link
                                            chevron={false}
                                            media={
                                                <Radio />
                                            } />
                                    ))}
                                </div>
                            </ListGroup>
                        </List>
                        <div className='flex justify-between items-center gap-3 px-3 mt-5'>
                            <div className='w-full flex items-center'>
                                <div className='flex gap-3 items-center'>
                                    <Button
                                        rounded
                                        outline
                                        small
                                        className=' !px-2.5'>
                                        <AiOutlineMinus />
                                    </Button>
                                    <span>1</span>
                                    <Button
                                        rounded
                                        outline
                                        small
                                        className=' !px-2.5'>
                                        <AiOutlinePlus />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                small
                                rounded>
                                Add to cart
                            </Button>
                        </div>
                    </div>
                </Card>
            </Actions>
        </>
    )
}
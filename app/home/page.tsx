"use client"
import { useCallback, useState } from 'react'
import {
    Navbar,
    Button,
    Card,
    Icon,
    Actions,
    Link,
    List,
    ListItem,
    ListGroup,
    Checkbox,
    Radio,
    Preloader,
    Tabbar,
    TabbarLink
} from 'konsta/react'
import { motion, Variants } from 'framer-motion'
import { useLocalstorageState } from 'rooks'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { IoMdCart } from 'react-icons/io'
import Image from 'next/image'
import { BsPaypal } from 'react-icons/bs'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import GcashLogo from '@/public/images/gcash.png'
import { BiMoney } from 'react-icons/bi'
import NextLink from 'next/link'
import Items from '@/lib/User/items'
import { CATEGORIES } from '@lib/constants'
import { greeting } from '@lib/utils'
import { useSession } from 'next-auth/react'
import Account from './account'
import { RiHomeLine, RiShoppingCartLine, RiMessage3Line } from 'react-icons/ri'
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
const navvariants: Variants = {
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
const sizes = ["Short", "Tall", "Grande", "Venti"]
export default function Home() {
    const { data: session, status } = useSession()
    const [tab, setTab] = useLocalstorageState<string>("home-tab", "All")
    const { items } = Items(tab.toLowerCase(), 0)
    const onChangeTab = useCallback((data: string) => setTab(data), [setTab])
    const [viewCart, setViewCart] = useState<boolean>(false)
    const [viewAccount, setViewAccount] = useState<boolean>(false)
    const [viewItem, setViewItem] = useState<boolean>(false)
    const onToggleCart = useCallback(() => setViewCart(e => !e), [setViewCart])
    const onToggleAccount = useCallback(() => setViewAccount(e => !e), [setViewAccount])
    const onToggleItem = useCallback(() => setViewItem(e => !e), [setViewItem])
    return (
        <>
            <motion.nav
                variants={navvariants}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                transition={{ ease: "easeInOut", duration: 0.5 }}
                className=' bottom-0 px-3.5 pb-3 w-full inset-x-0 fixed z-20'>
                <div className='px-2 py-3.5 rounded-xl shadow-md translucent bg-md-light-surface-1 dark:bg-md-dark-surface-1 k-color-brand-primary grid grid-cols-3 gap-2'>
                    <button
                        onClick={onToggleCart}
                        className=' outline-none flex w-full justify-center items-center'>
                        <Icon badge={10}>
                            <RiShoppingCartLine className=' w-8 h-8' />
                        </Icon>
                    </button>
                    <button className=' outline-none flex w-full justify-center items-center'>
                        <Icon>
                            <RiHomeLine className=' w-8 h-8' />
                        </Icon>
                    </button>
                    <button className=' outline-none flex w-full justify-center items-center'>
                        <Icon badge={20}>
                            <RiMessage3Line className=' w-8 h-8' />
                        </Icon>
                    </button>
                </div>
            </motion.nav>
            <motion.main
                variants={mainvariants}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
                className='h-full z-5 w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-brand-secondary/20 pb-15-safe'>
                <div className='flex justify-between items-center px-3 pt-4'>
                    <div>
                        {session?.user ? (
                            <>
                                <span className='text-sm font-medium text-black/70 dark:text-brand-white/80'>{greeting()}</span>
                                <h1 className='text-xl font-semibold leading-tight dark:text-brand-white'>{session?.user.name}</h1>
                            </>
                        ) : (
                            <>
                                <span className='text-sm font-medium text-black/70 '>{"Bean's Cafe"}</span>
                                <h1 className='text-xl font-semibold leading-tight'>Best coffee for you!</h1>
                            </>
                        )}
                    </div>
                    <Link
                        onClick={onToggleAccount}
                        navbar
                        iconOnly
                        className=' k-color-brand-primary'>
                        <Icon badge={status === "unauthenticated" ? "" : null}>
                            <IoPersonCircleSharp className='h-7 w-7' />
                        </Icon>
                    </Link>
                </div>
                <div className='w-full mt-2'>
                    <section className='w-full translucent z-10 px-3 bg-brand-white dark:bg-transparent whitespace-nowrap snap-proximity gap-2 overflow-auto py-3'>
                        <Button
                            clear={tab !== "all"}
                            onClick={() => onChangeTab("all")}
                            className='!w-auto k-color-brand-green inline-flex ml-2 first:ml-0'
                            rounded>
                            All
                        </Button>
                        {CATEGORIES.map(category => (
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
                    <motion.section
                        key={tab}
                        variants={mainvariants}
                        initial={"initial"}
                        animate={"animate"}
                        exit={"exit"}
                        transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
                        className='grid px-4 gap-2.5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 mt-5'>
                        {items?.map(item => (
                            <motion.div
                                onClick={onToggleItem}
                                key={item.item_id}
                                whileTap={{ scale: 0.95 }}
                                className=' cursor-pointer'>
                                <Card
                                    margin='m-0'
                                    className='z-0 k-color-brand-secondary'>
                                    <div className='shadow-lg rounded-2xl overflow-hidden'>
                                        <Image
                                            src={`/api/files?type=items&file_path=${item.image}`}
                                            alt="test"
                                            width={300}
                                            height={300}
                                            loading='lazy'
                                            className=' h-44 object-cover ' />
                                    </div>
                                    <div className='flex flex-col mt-3'>
                                        <span className='text-xl font-bold'>{item.name}</span>
                                        <span className=' text-brand-primary font-bold text-base'>₱{item.sizes[0]?.price}</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.section>
                </div>
                {/* Account */}
                <Account
                    onToggleAccount={onToggleAccount}
                    session={session}
                    status={status}
                    viewAccount={viewAccount} />
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
                                    <span className='text-sm'>Item Description</span>
                                </div>
                                <div className='flex justify-end items-center'>
                                    <span className=' text-brand-primary font-bold text-lg'>₱100</span>
                                </div>
                            </div>
                            <List margin='my-0' className='mt-5'>
                                <ListGroup>
                                    <span className=' px-3'>Select Size</span>
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
            </motion.main>
        </>
    )
}
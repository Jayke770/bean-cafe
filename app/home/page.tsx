"use client"
import { useCallback, useState } from 'react'
import {
    Button,
    Card,
    Icon,
    Actions,
    Link,
    List,
    ListItem,
    ListGroup,
    Radio,
    Badge,
    Searchbar,
    Preloader
} from 'konsta/react'
import { motion, Variants } from 'framer-motion'
import { useLocalstorageState, useDebounce } from 'rooks'
import { IoPersonCircleSharp } from 'react-icons/io5'
import Image from 'next/image'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { RiLoader5Fill } from 'react-icons/ri'
import Items from '@/lib/User/items'
import { greeting, capitalize } from '@lib/utils'
import { useSession } from 'next-auth/react'
import { RiShoppingCartLine } from 'react-icons/ri'
import type { ApiResponse, Items as Item } from "@/types";
import CartData from "@lib/User/cart"
import * as changeCase from 'change-case'
import ItemLoader from '@/components/Client/items/loader'
import Cart from './cart'
import toast from 'react-hot-toast';
import { ItemEmpty } from '@components/empty'
import NextLink from 'next/link'
import Categories from '@/lib/categories'
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
interface ViewItem {
    data?: Item,
    selected_size?: Item['sizes'][0],
    addon?: string,
    addonPrice?: number,
    quantity: number,
    opened?: boolean,
    adding_to_cart?: boolean,
    isProcessing?: boolean
}
export default function Home() {
    const { categories, categoriesLoading } = Categories()
    const { cartData, mutate: updateCartData } = CartData()
    const { data: session, status } = useSession()
    const [tab, setTab] = useLocalstorageState<string>("home-tab", "All")
    const [searchItem, setSearchItem] = useState<string>()
    const { items, itemsLoading } = Items({ category: tab.toLowerCase(), search: searchItem })
    const onChangeTab = useCallback((data: string) => setTab(data), [setTab])
    const [viewCart, setViewCart] = useState<boolean>(false)
    const [viewItem, setViewItem] = useState<ViewItem>({ quantity: 0 })
    const onToggleCart = useCallback(() => setViewCart(e => !e), [setViewCart])
    const onToggleItem = useCallback((data?: Item) => {
        if (data) {
            setViewItem(e => ({ ...e, data: data, opened: !e.opened }))
        } else {
            setViewItem(e => ({ ...e, data: data, selected_size: undefined, quantity: 0, opened: !e.opened }))
        }
    }, [setViewItem])
    const onSelectSize = useCallback((data: Item['sizes'][0]) => setViewItem(e => ({ ...e, selected_size: e?.selected_size?.type === data.type ? undefined : data })), [])
    const onPlusQuantity = () => {
        if ((viewItem?.data?.sizes.length ?? 0) <= 0) {
            const quantity = viewItem.quantity + 1
            if ((viewItem?.data?.stocks ?? 0) >= quantity) {
                setViewItem(e => ({ ...e, quantity: quantity }))
            }
        }
        if (viewItem?.selected_size) {
            const quantity = viewItem.quantity + 1
            if ((viewItem?.selected_size?.stocks ?? 0) >= quantity) {
                setViewItem(e => ({ ...e, quantity: quantity }))
            }
        }
    }
    const onMinusQuantity = () => {
        if ((viewItem?.data?.sizes.length ?? 0) <= 0) {
            const quantity = viewItem.quantity - 1
            setViewItem(e => ({ ...e, quantity: quantity > 0 ? quantity : 0 }))
        }
        if (viewItem?.selected_size) {
            const quantity = viewItem.quantity - 1
            setViewItem(e => ({ ...e, quantity: quantity > 0 ? quantity : 0 }))
        }
    }
    const onAddtoCart = () => {
        if (!viewItem?.isProcessing) {
            setViewItem(e => ({ ...e, isProcessing: true }))
            toast.promise(((): Promise<ApiResponse> => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const req = await fetch("/api/user/cart", {
                            method: 'POST',
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify({
                                addon: viewItem.addon,
                                item_id: viewItem.data?.item_id,
                                quantity: viewItem.quantity,
                                selected_size: viewItem.selected_size?.type
                            })
                        })
                        if (req.ok) {
                            const res: ApiResponse = await req.json()
                            setViewItem(e => ({ ...e, isProcessing: false }))
                            res?.status ? resolve(res) : reject(res.message)
                        } else {
                            throw new Error(`${req.status} ${req.statusText}`)
                        }
                    } catch (e: any) {
                        setViewItem(e => ({ ...e, isProcessing: false }))
                        reject(e.message)
                    }
                })
            })(), {
                loading: 'Adding to cart..',
                success: (data: ApiResponse) => {
                    updateCartData()
                    return `${data.message}`
                },
                error: e => e,
            })
        }
    }
    const onSelectAddon = (id?: string, price?: number) => setViewItem(e => ({ ...e, addon: e.addon === id ? undefined : id, addonPrice: price ?? 0 }))
    const onSearchItem = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => setSearchItem(() => e.target.value), 500)
    return (
        <motion.div
            variants={mainvariants}
            initial={"initial"}
            animate={"animate"}
            exit={"exit"}
            transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
            className='h-full z-5 w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-brand-secondary/20 pb-20-safe'>
            <nav className='flex justify-between items-center px-3 pt-4'>
                <div>
                    {session?.user ? (
                        <>
                            <span className='text-sm font-medium text-black/70 dark:text-brand-white/80'>{greeting()}</span>
                            <h1 className='text-xl font-semibold leading-tight dark:text-brand-white'>{session?.user.name}</h1>
                        </>
                    ) : (
                        <>
                            <span className='text-sm font-medium text-black/70 dark:text-brand-white/80'>{"Bean's Cafe"}</span>
                            <h1 className='text-xl font-semibold leading-tight dark:text-brand-white'>Best coffee for you!</h1>
                        </>
                    )}
                </div>
                <div className='flex items-center'>
                    <a>
                        <Link
                            component='div'
                            onClick={onToggleCart}
                            navbar
                            iconOnly
                            className=' k-color-brand-primary'>
                            <Icon badge={(cartData?.length ?? 0) > 0 ? cartData?.length : null}>
                                <RiShoppingCartLine className=' w-7 h-7' />
                            </Icon>
                        </Link>
                    </a>
                    <NextLink passHref href={"/home/account"}>
                        <Link
                            component='div'
                            navbar
                            iconOnly
                            className=' k-color-brand-primary'>
                            <Icon badge={status === "unauthenticated" ? "" : null}>
                                <IoPersonCircleSharp className='h-7 w-7' />
                            </Icon>
                        </Link>
                    </NextLink>
                </div>
            </nav>
            {/* Category */}
            <section className='w-full  z-10 px-3 whitespace-nowrap snap-proximity gap-2 overflow-auto py-3'>
                <Button
                    clear={tab !== "all"}
                    onClick={() => onChangeTab("all")}
                    className='!w-auto k-color-brand-green inline-flex ml-2 first:ml-0'
                    rounded>
                    All
                </Button>
                <Button
                    clear={tab !== "best-sellers"}
                    onClick={() => onChangeTab("best-sellers")}
                    className='!w-auto k-color-brand-green inline-flex ml-2 first:ml-0'
                    rounded>
                    Best Sellers
                </Button>
                {categoriesLoading ? <Preloader size='h-5 w-5' className=' self-center k-color-brand-green' /> : (
                    categories?.map(category => (
                        <Button
                            key={category.type}
                            clear={category.type !== tab}
                            onClick={() => onChangeTab(category.type)}
                            className='!w-auto k-color-brand-green inline-flex ml-2 first:ml-0'
                            rounded>
                            {category.type}
                        </Button>
                    ))
                )}
            </section>
            {/* Search */}
            <div className=' transition-all md:absolute md:w-64 md:right-32 md:top-2 sticky top-1 k-color-brand-primary w-full px-8 -py-4 -mx-2'>
                <Searchbar
                    disableButton={true}
                    onChange={onSearchItem} />
            </div>
            {/* Items */}
            <motion.section
                key={tab}
                variants={mainvariants}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
                className='grid px-4 gap-2.5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 mt-2'>
                {items?.length <= 0 && <ItemEmpty key={"items-empty"} />}
                {itemsLoading && <ItemLoader key={"items-loader"} />}
                {items?.map(item => (
                    <motion.div
                        onClick={() => onToggleItem(item)}
                        key={item.item_id}
                        whileTap={{ scale: 0.95 }}
                        className=' cursor-pointer'>
                        <Card
                            margin='m-0'
                            className='z-0 k-color-brand-secondary'>
                            <div className='shadow-lg h-44 rounded-2xl overflow-hidden'>
                                <Image
                                    priority
                                    src={item.image}
                                    alt={item?.name}
                                    width={300}
                                    height={300}
                                    className=' aspect-square h-full w-full object-cover ' />
                            </div>
                            <div className='flex flex-col mt-3'>
                                <span className='text-base lg:text-lg font-bold  whitespace-nowrap w-[95%] overflow-hidden text-ellipsis '>{item.name}</span>
                                <div className='flex justify-between items-baseline'>
                                    <span className=' text-brand-primary font-bold text-sm lg:text-base'>₱{item.sizes.length > 0 ? item.sizes[0]?.price : item.price}</span>
                                    <Badge className=' k-color-brand-green'>{changeCase.capitalCase(item.category)}</Badge>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.section>

            {/* Cart */}
            <Cart
                key={'cart'}
                opened={viewCart}
                onToggleCart={onToggleCart}
                cartData={cartData}
                session={session}
                updateCartData={updateCartData} />

            {/* View Item */}
            <Actions
                opened={viewItem?.opened}
                onBackdropClick={() => onToggleItem()}
                className=' k-color-brand-primary'>
                <Card
                    margin='m-0'
                    className=' rounded-b-none'>
                    <div className='flex flex-col'>
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-col'>
                                <span className='font-bold text-xl'>{viewItem?.data?.name}</span>
                                <span className='text-xs'>Stock: {viewItem?.selected_size?.stocks ?? (viewItem?.data?.stocks ?? viewItem?.data?.sizes.reduce((sum, size) => sum + size.stocks, 0))}</span>
                                <span className='text-sm'>{viewItem?.data?.description}</span>
                            </div>
                            <div className='flex'>
                                <span>₱{(viewItem?.data?.sizes.length ?? 0) > 0 ? ((viewItem?.selected_size?.price ?? 0) * (viewItem?.quantity ?? 0)) + (viewItem?.addonPrice ?? 0) : (viewItem?.data?.price ?? 0) * viewItem?.quantity}</span>
                            </div>
                        </div>
                        {(viewItem?.data?.sizes?.length ?? 0) > 0 && (
                            <List margin='my-0' className='mt-5'>
                                <ListGroup>
                                    <span className=' px-3'>Size</span>
                                    <div className='grid grid-cols-2 gap-2'>
                                        {viewItem?.data?.sizes?.map(size => (
                                            <ListItem
                                                key={size?.id}
                                                onClick={() => onSelectSize(size)}
                                                title={capitalize(size?.type)}
                                                subtitle={`₱${size?.price}`}
                                                link
                                                chevron={false}
                                                media={<Radio readOnly className=' pointer-events-none' checked={viewItem?.selected_size?.type === size.type} />} />
                                        ))}
                                    </div>
                                </ListGroup>
                            </List>
                        )}
                        {(viewItem?.data?.addons.length ?? 0) > 0 && (
                            <List margin='my-0' className='mt-5'>
                                <ListGroup>
                                    <span className=' px-3'>Addon</span>
                                    <div className='grid grid-cols-2 gap-2'>
                                        {viewItem?.data?.addons?.map(addon => (
                                            <ListItem
                                                key={addon.id}
                                                onClick={() => onSelectAddon(addon.id, addon?.price)}
                                                title={changeCase.sentenceCase(addon.name)}
                                                subtitle={`₱${addon?.price}`}
                                                link
                                                chevron={false}
                                                media={<Radio readOnly className=' pointer-events-none' checked={viewItem?.addon === addon.id} />} />
                                        ))}
                                    </div>
                                </ListGroup>
                            </List>
                        )}
                        <div className='flex justify-between items-center gap-3 px-3 mt-5'>
                            <div className='w-full flex items-center'>
                                <div className='flex gap-3 items-center'>
                                    <Button
                                        disabled={(viewItem?.data?.sizes.length ?? 0) > 0 && !viewItem?.selected_size}
                                        onClick={onMinusQuantity}
                                        rounded
                                        outline
                                        small
                                        className=' !px-2.5'>
                                        <AiOutlineMinus />
                                    </Button>
                                    <span>{viewItem?.quantity}</span>
                                    <Button
                                        disabled={(viewItem?.data?.sizes.length ?? 0) > 0 && !viewItem?.selected_size}
                                        onClick={onPlusQuantity}
                                        rounded
                                        outline
                                        small
                                        className=' !px-2.5'>
                                        <AiOutlinePlus />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                onClick={onAddtoCart}
                                disabled={!viewItem?.selected_size && viewItem?.quantity <= 0 || viewItem?.isProcessing}
                                small
                                rounded>
                                {viewItem?.adding_to_cart ? <RiLoader5Fill className=' animate-spin h-5 w-5 text-brand-primary' /> : <span>Add to cart</span>}
                            </Button>
                        </div>
                    </div>
                </Card>
            </Actions>
        </motion.div >
    )
}

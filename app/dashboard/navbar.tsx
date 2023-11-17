"use client"
import { Icon, Link, List, ListItem, Navbar, Page, Panel, NavbarBackLink, Dialog, Button } from "konsta/react"
import { BiCart, BiFoodMenu, BiHomeAlt, BiSolidCoffeeBean, BiUser } from "react-icons/bi"
import { HiOutlineBell, HiOutlineBars3BottomRight, HiMiniXMark } from "react-icons/hi2"
import NextLink from 'next/link'
import { useTheme } from "@/components/themeProvider";
import { motion } from "framer-motion"
import { BsFillSunFill, BsMoonStars } from "react-icons/bs"
import { useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { FaCog } from "react-icons/fa";
import Settingsdata from "@/lib/settings"
import { ApiResponse, settings } from "@/types"
import { AiFillEdit } from "react-icons/ai";
import { useForm } from 'react-hook-form'
import toast from "react-hot-toast"
interface Settings {
    opened?: boolean,
    edit?: boolean
}
export default function DashboardNavbar() {
    const { handleSubmit, register } = useForm()
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const path = usePathname()
    const router = useRouter()
    const { settings: settingsData } = Settingsdata()
    const { onToggleTheme, theme } = useTheme()
    const [settings, setSettings] = useState<Settings>()
    const [openPanel, setOpenPanel] = useState<boolean>()
    const onTogglePanel = () => setOpenPanel(e => !e)
    const onBack = () => router.back()
    const onNavigate = (path: string) => {
        router.push(path)
        setTimeout(() => onTogglePanel(), 500)
    }
    const onToggleSettings = () => setSettings(e => ({ ...e, opened: !e?.opened }))
    const onToggledit = () => setSettings(e => ({ ...e, edit: !e?.edit }))
    const onSubmit = async (data: any) => {
        if (!isProcessing) {
            setIsProcessing(true)
            toast.promise(((): Promise<any> => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const req = await fetch("/api/settings", {
                            method: "post",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify(data)
                        })
                        if (req.ok) {
                            const res: ApiResponse = await req.json()
                            if (res?.status) {
                                resolve(res)
                            } else {
                                throw new Error(res?.message)
                            }
                        } else {
                            throw new Error(`${req?.status} ${req?.statusText}`)
                        }
                    } catch (e: any) {
                        reject(e.message)
                    }
                })
            })(), {
                loading: 'Please wait...',
                success: (data: ApiResponse) => {
                    setIsProcessing(false)
                    return data?.message ?? ""
                },
                error: e => {
                    setIsProcessing(false)
                    return e
                }
            })
        }
    }
    return (
        <>
            <Navbar
                titleClassName='!font-bold'
                title={<NextLink href={"/dashboard"}>Dashboard</NextLink>}
                className=' k-color-brand-primary'
                left={
                    <>
                        {path === "/dashboard" ? (
                            <NextLink href={"/dashboard"} className=" h-full w-full flex justify-center items-center">
                                <Link navbar iconOnly component="div">
                                    <BiSolidCoffeeBean className=" w-7 h-7 text-brand-primary" />
                                </Link>
                            </NextLink>
                        ) : (
                            <NavbarBackLink onClick={onBack} />
                        )}
                    </>
                }
                right={
                    <>
                        <Link navbar iconOnly>
                            <motion.span
                                key={theme}
                                onClick={onToggleTheme}
                                initial={{ scale: 0.9, rotate: 360, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0.9, rotate: 360, opacity: 0 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="text-brand-primary">
                                {theme === "dark" ? <BsFillSunFill className="h-6 w-6" /> : <BsMoonStars className="h-6 w-6" />}
                            </motion.span>
                        </Link>
                        {/* <Link navbar iconOnly>
                            <Icon badge="">
                                <HiOutlineBell className='h-6 w-6' />
                            </Icon>
                        </Link> */}
                        <Link onClick={onTogglePanel} navbar iconOnly>
                            <Icon>
                                <HiOutlineBars3BottomRight className='h-6 w-6' />
                            </Icon>
                        </Link>
                    </>
                } />
            <Panel
                opened={openPanel}
                onBackdropClick={onTogglePanel}
                floating
                side="right">
                <Page
                    className=" k-color-brand-primary">
                    <Navbar
                        title="Menu"
                        right={
                            <Link onClick={onTogglePanel} className=" k-color-brand-red" navbar iconOnly>
                                <Icon>
                                    <HiMiniXMark className='h-6 w-6 text-brand-red ' />
                                </Icon>
                            </Link>
                        }
                    />
                    <List margin="my-0">
                        <ListItem
                            onClick={() => onNavigate("/dashboard")}
                            media={<BiHomeAlt className=" h-6 w-6 text-brand-primary  " />}
                            link
                            title="Home" />
                        <ListItem
                            onClick={() => onNavigate("/dashboard/items")}
                            media={<BiFoodMenu className=" h-6 w-6 text-teal-500 " />}
                            link
                            title="Items" />
                        <ListItem
                            onClick={() => onNavigate("/dashboard/orders")}
                            media={<BiCart className=" h-6 w-6 text-amber-500" />}
                            link
                            title="Orders" />
                        <ListItem
                            onClick={() => onNavigate("/dashboard/users")}
                            media={<BiUser className=" h-6 w-6 text-fuchsia-500" />}
                            link
                            title="Users" />
                        <ListItem
                            onClick={onToggleSettings}
                            media={<FaCog className=" h-6 w-6 text-blue-500" />}
                            link
                            title="Settings" />
                    </List>
                </Page>
            </Panel>
            <Dialog
                opened
                onBackdropClick={onToggleSettings}
                title={
                    <div className="flex justify-between">
                        <span>Settings</span>
                        <Button
                            onClick={onToggledit}
                            clear
                            small
                            className=" !w-auto !px-2"
                            rounded>
                            <AiFillEdit className=" h-6 w-6" />
                        </Button>
                    </div>
                }
                className=" k-color-brand-primary lg:w-96"
                content={
                    settings?.edit ? (
                        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="email" className="block text-sm font-medium">COD Message</label>
                                <input
                                    id="cod-message"
                                    {...register("cod_message")}
                                    className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    placeholder="COD Message"
                                    aria-describedby="cod-message" />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="currency" className="block text-sm font-medium">Currency</label>
                                <input
                                    id="currency"
                                    {...register("currency")}
                                    className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    placeholder="Currency"
                                    aria-describedby="Currency" />
                            </div>
                            <Button
                                className=" mt-2">Update</Button>
                        </form>
                    ) : (
                        <List margin="my-0">
                            <ListItem
                                title="COD Message"
                                footer={settingsData?.codMessage}
                                link
                            />
                            <ListItem
                                title="Currency"
                                footer={settingsData?.currency}
                                link
                                chevron />
                        </List>
                    )
                } />
        </>
    )
}
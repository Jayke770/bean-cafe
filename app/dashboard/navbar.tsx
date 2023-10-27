"use client"
import { Icon, Link, List, ListItem, Navbar, Page, Panel, NavbarBackLink } from "konsta/react"
import { BiCart, BiFoodMenu, BiHomeAlt, BiSolidCoffeeBean, BiUser } from "react-icons/bi"
import { HiOutlineBell, HiOutlineBars3BottomRight, HiMiniXMark } from "react-icons/hi2"
import NextLink from 'next/link'
import { useTheme } from "@/components/themeProvider";
import { motion } from "framer-motion"
import { BsFillSunFill, BsMoonStars } from "react-icons/bs"
import { useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
export default function DashboardNavbar() {
    const path = usePathname()
    const router = useRouter()
    const { onToggleTheme, theme } = useTheme()
    const [openPanel, setOpenPanel] = useState<boolean>()
    const onTogglePanel = () => setOpenPanel(e => !e)
    const onBack = () => router.back()
    const onNavigate = (path: string) => {
        router.push(path)
        onTogglePanel()
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
                        <Link navbar iconOnly>
                            <Icon badge="">
                                <HiOutlineBell className='h-6 w-6' />
                            </Icon>
                        </Link>
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
                    </List>
                </Page>
            </Panel>
        </>
    )
}
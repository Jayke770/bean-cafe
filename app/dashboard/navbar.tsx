"use client"
import { Icon, Link, Navbar } from "konsta/react"
import { BiSolidCoffeeBean } from "react-icons/bi"
import { HiOutlineBell } from "react-icons/hi2"
import NextLink from 'next/link'
import { useTheme } from "@/components/themeProvider";
import { motion } from "framer-motion"
import { BsFillSunFill, BsMoonStars } from "react-icons/bs"
export default function DashboardNavbar() {
    const { onToggleTheme, theme } = useTheme()
    return (
        <Navbar
            titleClassName='!font-bold'
            title='Dashboard'
            className=' k-color-brand-primary'
            left={
                <>
                    <NextLink href={"/dashboard"} className=" h-full w-full flex justify-center items-center">
                        <Link navbar iconOnly component="div">
                            <BiSolidCoffeeBean className=" w-7 h-7 text-brand-primary" />
                        </Link>
                    </NextLink>
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
                </>
            } />
    )
}
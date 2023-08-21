"use client"
import NavbarAdmin from "./navbar";
import Cards from "./cards";
import Orders from "./orders";
import Charts from './charts'
import { BiSolidCoffeeBean } from 'react-icons/bi'
import NextLink from 'next/link'
import { useCallback, useState } from "react";
import { Navbar, Link, Icon } from 'konsta/react'
import { HiBars3BottomRight, HiOutlineBell } from 'react-icons/hi2'
export default function DashBoard() {
    const [openSideNav, setOpenSideNav] = useState<boolean>()
    const onToggleSideNav = useCallback(() => setOpenSideNav(e => !e), [setOpenSideNav])
    return (
        <>
            <nav className={`${openSideNav ? "block" : "hidden"} transition-all fixed lg:block w-18 bg-md-light-surface-2 dark:bg-md-dark-surface-2 k-color-brand-primary h-full`}>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center h-16 w-full outline-none cursor-pointer border-b border-brand-primary/30 ">
                        <BiSolidCoffeeBean className=" w-7 h-7 text-brand-primary" />
                    </div>
                </div>
            </nav>
            <div className={`${openSideNav ? "ml-18" : "ml-0"} lg:ml-18 transition-all flex flex-col gap-4`}>
                <Navbar
                    titleClassName='!font-bold'
                    title='Dashboard'
                    className=' k-color-brand-primary'
                    left={
                        <Link onClick={onToggleSideNav} navbar iconOnly className=' lg:hidden'>
                            <Icon>
                                <HiBars3BottomRight className='h-6 w-6' />
                            </Icon>
                        </Link>
                    }
                    right={
                        <>
                            <Link navbar iconOnly>
                                <Icon badge="">
                                    <HiOutlineBell className='h-6 w-6' />
                                </Icon>
                            </Link>
                        </>
                    } />
                <Cards />
                <Charts />
                <Orders />
            </div>
        </>
    )
}
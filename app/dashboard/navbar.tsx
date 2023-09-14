"use client"
import { Icon, Link, Navbar } from "konsta/react"
import { BiSolidCoffeeBean } from "react-icons/bi"
import { HiOutlineBell } from "react-icons/hi2"
import NextLink from 'next/link'
export default function DashboardNavbar() {
    return (
        <Navbar
            titleClassName='!font-bold'
            title='Dashboard'
            className=' k-color-brand-primary'
            left={
                <>
                    <NextLink href={"/admin/dashboard"} className=" h-full w-full flex justify-center items-center">
                        <Link navbar iconOnly component="div">
                            <BiSolidCoffeeBean className=" w-7 h-7 text-brand-primary" />
                        </Link>
                    </NextLink>
                </>
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
    )
}
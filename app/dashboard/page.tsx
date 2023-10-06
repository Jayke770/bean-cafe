"use client"
import Cards from "./cards";
import Orders from "./orders";
import Charts from './charts'
import { useCallback, useEffect, useState } from "react";
import { HiXMark } from 'react-icons/hi2'
import { Navbar, Link, Icon, Panel, Page } from 'konsta/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
export default function DashBoard() {
    const router = useRouter()
    const { data: session } = useSession()
    const [openSideNav, setOpenSideNav] = useState<boolean>()
    const onToggleSideNav = useCallback(() => setOpenSideNav(e => !e), [setOpenSideNav])
    // useEffect(() => {
    //     if (!session || session?.user?.role === "user") router.push("/home")
    // }, [router, session])
    return (
        <>
            <Panel
                opened={openSideNav}
                onBackdropClick={onToggleSideNav}
                floating>
                <Page className=" k-color-brand-primary">
                    <Navbar
                        title="Menu"
                        right={
                            <Link onClick={onToggleSideNav} iconOnly navbar className=" k-color-brand-red">
                                <Icon>
                                    <HiXMark className=" h-5 w-5 text-red-500" />
                                </Icon>
                            </Link>
                        } />
                </Page>
            </Panel>
            <div className="transition-all flex flex-col gap-4 mt-4">
                <Cards />
                <Charts />
                <Orders />
            </div>
        </>
    )
}
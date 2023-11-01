"use client"
import Cards from "./cards";
import Orders from "./orders";
import Charts from './charts'
import { useCallback, useState } from "react";
import { HiXMark } from 'react-icons/hi2'
import { Navbar, Link, Icon, Panel, Page } from 'konsta/react'
import { type Session } from "next-auth";
export default function DashBoard({ session }: { session?: Session }) {
    const [openSideNav, setOpenSideNav] = useState<boolean>()
    const onToggleSideNav = useCallback(() => setOpenSideNav(e => !e), [setOpenSideNav])
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
            <div className="transition-all flex flex-col gap-4 mt-4 pb-10-safe">
                <Cards />
                <Charts />
                <Orders />
            </div>
        </>
    )
}
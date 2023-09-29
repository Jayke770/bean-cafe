"use client"
import { Button, Card, List, ListItem, MenuList, MenuListItem } from "konsta/react";
import { useSession } from 'next-auth/react'
import Image from "next/image";
import { BsArrowLeft } from 'react-icons/bs'
import NextLink from 'next/link'
import AccountLoader from "@/components/Client/account/loader";
import AccountDialog from "@/components/Client/account/dialog";
import { motion } from 'framer-motion'
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react"
import { RiShoppingCartLine, RiAccountCircleLine } from 'react-icons/ri'
export default function Account() {
    const { data: session, status } = useSession()
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.2, delay: 0.01 }}
            className='h-full z-5 w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-brand-secondary/20'>
            {status === "authenticated" ? (
                <>
                    <Card margin="m-0" contentWrap={false} className=" overflow-auto k-color-brand-primary !rounded-none">
                        <div className="flex w-full justify-between p-2">
                            <NextLink href="/home">
                                <Button clear rounded className="!px-2.5 k-color-brand-primary w-auto">
                                    <BsArrowLeft className=" h-7 w-7" />
                                </Button>
                            </NextLink>
                            <Button onClick={() => signOut({ callbackUrl: "/home", redirect: true })} clear rounded className="!px-2.5 k-color-brand-red !w-auto">
                                <MdLogout className=" h-7 w-7" />
                            </Button>
                        </div>
                        <div className="flex flex-col pb-5 pt-3 justify-center w-full items-center h-full">
                            <Image
                                src={session?.user.image ?? "/logo.png"}
                                alt={session?.user.name ?? ""}
                                width={300}
                                height={300}
                                priority
                                className=" h-18 w-18 aspect-square rounded-full" />
                            <div className="flex flex-col mt-3 items-center">
                                <h1 className=" dark:text-zinc-300">{session?.user.name}</h1>
                                <span className="dark:text-zinc-400 text-sm">{session?.user?.email}</span>
                            </div>
                        </div>
                    </Card>
                    <MenuList className=" k-color-brand-primary !my-4 ">
                        <MenuListItem
                            media={<RiAccountCircleLine className=" h-7 w-7 text-brand-primary" />}
                            title="Account Information" />
                        <MenuListItem
                            media={<RiShoppingCartLine className=" h-7 w-7 text-brand-primary" />}
                            title="Orders" />
                    </MenuList>
                </>
            ) : <AccountLoader />}
            {status === "unauthenticated" && <AccountDialog />}
        </motion.main>
    )
}
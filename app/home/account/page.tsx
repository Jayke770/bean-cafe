"use client"
import { Button, Card } from "konsta/react";
import { useSession } from 'next-auth/react'
import Image from "next/image";
import { BsArrowLeft } from 'react-icons/bs'
import NextLink from 'next/link'
import AccountLoader from "@/components/Client/account/loader";
import AccountDialog from "@/components/Client/account/dialog";
export default function Account() {
    const { data: session, status } = useSession()
    return (
        <main className='h-full z-5 w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-brand-secondary/20'>
            {status === "authenticated" ? (
                <>
                    <Card margin="m-0" contentWrap={false} className=" overflow-auto k-color-brand-primary !rounded-none relative">
                        <div className=" h-60 ">
                            <div className="flex absolute p-2">
                                <NextLink href="/home">
                                    <Button clear rounded className="!px-2.5 k-color-brand-primary w-auto">
                                        <BsArrowLeft className=" h-7 w-7" />
                                    </Button>
                                </NextLink>
                            </div>
                            <div className="flex flex-col justify-center w-full items-center h-full">
                                <Image
                                    src={session?.user.image ?? "/logo.png"}
                                    alt={session?.user.name ?? ""}
                                    width={300}
                                    height={300}
                                    priority
                                    className=" h-18 w-18 aspect-square rounded-full" />
                                <div className="flex flex-col mt-5 items-center">
                                    <h1 className=" dark:text-zinc-300">{session?.user.name}</h1>
                                    <span className="dark:text-zinc-400">{session?.user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </>
            ) : (
                <>
                    <AccountLoader />
                    <AccountDialog />
                </>
            )}
        </main>
    )
}
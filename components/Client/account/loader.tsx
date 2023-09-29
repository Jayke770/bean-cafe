"use client"
import { Button, Card } from "konsta/react";
import { BsArrowLeft } from 'react-icons/bs'
import NextLink from 'next/link'
import Skeleton from "react-loading-skeleton";
export default function AccountLoader() {
    return (
        <main className='h-full z-5 w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-brand-secondary/20'>
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
                        <Skeleton width={"4.5rem"} height={"4.5rem"} borderRadius={"100%"} />
                        <div className="flex flex-col mt-5 items-center">
                            <Skeleton width={"5rem"} height={"1rem"} />
                            <Skeleton width={"2.5rem"} height={"1rem"} />
                        </div>
                    </div>
                </div>
            </Card>
        </main>
    )
}
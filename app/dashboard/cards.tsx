"use client"
import { Card } from "konsta/react"
import { BiFoodMenu, BiCart, BiUser } from "react-icons/bi"
import Link from 'next/link'
import Stats from "@/lib/Admin/stats"
import Skeleton from "react-loading-skeleton"
export default function Cards() {
    const { stats } = Stats()
    return (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
            <Link href={"/dashboard/items"}>
                <Card
                    margin="m-0"
                    className=" k-color-brand-primary !rounded-md shadow-sm ">
                    {stats ? (
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl">{stats?.items ?? "..."}</span>
                                <span className="text-sm">Total Items</span>
                            </div>
                            <BiFoodMenu className=" h-8 w-8" />
                        </div>
                    ) : (
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <Skeleton width={"2rem"} />
                                <Skeleton width={"3rem"} />
                            </div>
                            <Skeleton width={"2rem"} height={"2rem"} borderRadius={"100%"} />
                        </div>
                    )}
                </Card>
            </Link>
            <Link href={"/dashboard/orders"}>
                <Card
                    margin="m-0"
                    className=" k-color-brand-primary !rounded-md shadow-sm ">
                    {stats ? (
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl">{stats?.orders ?? "..."}</span>
                                <span className="text-sm">Total Orders</span>
                            </div>
                            <BiCart className=" h-8 w-8" />
                        </div>
                    ) : (
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <Skeleton width={"2rem"} />
                                <Skeleton width={"3rem"} />
                            </div>
                            <Skeleton width={"2rem"} height={"2rem"} borderRadius={"100%"} />
                        </div>
                    )}
                </Card>
            </Link>
            <Link href={"/dashboard/users"}>
                <Card
                    margin="m-0"
                    className=" k-color-brand-primary !rounded-md shadow-sm ">
                    {stats ? (
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl">{stats?.users ?? "..."}</span>
                                <span className="text-sm">Total Users</span>
                            </div>
                            <BiUser className=" h-8 w-8" />
                        </div>
                    ) : (
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <Skeleton width={"2rem"} />
                                <Skeleton width={"3rem"} />
                            </div>
                            <Skeleton width={"2rem"} height={"2rem"} borderRadius={"100%"} />
                        </div>
                    )}
                </Card>
            </Link>
        </div>
    )
}
"use client"
import { Card } from "konsta/react"
import { BiFoodMenu, BiCart , BiUser} from "react-icons/bi"
export default function Cards() {
    return (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
            <Card
                margin="m-0"
                className=" k-color-brand-primary !rounded-md ">
                <div className="flex justify-between w-full items-center">
                    <div className="flex flex-col">
                        <span className="font-bold text-xl">100</span>
                        <span className="text-sm">Total Items</span>
                    </div>
                    <BiFoodMenu className=" h-8 w-8" />
                </div>
            </Card>
            <Card
                margin="m-0"
                className=" k-color-brand-primary !rounded-md ">
                <div className="flex justify-between w-full items-center">
                    <div className="flex flex-col">
                        <span className="font-bold text-xl">200</span>
                        <span className="text-sm">Total Orders</span>
                    </div>
                    <BiCart className=" h-8 w-8" />
                </div>
            </Card>
            <Card
                margin="m-0"
                className=" k-color-brand-primary !rounded-md ">
                <div className="flex justify-between w-full items-center">
                    <div className="flex flex-col">
                        <span className="font-bold text-xl">200</span>
                        <span className="text-sm">Total Clients</span>
                    </div>
                    <BiUser className=" h-8 w-8" />
                </div>
            </Card>
        </div>
    )
}
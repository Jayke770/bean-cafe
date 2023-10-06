"use client"
import { Orders } from '@/types'
import { Button } from "konsta/react";
import Link from 'next/link';
import { BsCheckCircleFill } from 'react-icons/bs'
import * as changeCase from 'change-case'
import { motion } from "framer-motion"
import Skeleton from 'react-loading-skeleton';
export function Success({ data }: { data?: Orders }) {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3, delay: 0 }}
            className=" shadow-sm relative p-4 m-4 rounded-2xl bg-md-light-surface-1 dark:bg-md-dark-surface-1 text-md-light-on-surface dark:text-md-dark-on-surface  k-color-brand-primary w-full md:w-160 ">
            <div className="w-full flex items-center absolute justify-center z-50 -top-8 left-0">
                <div className=" dark:bg-md-dark-surface-1 p-4 rounded-full bg-md-light-surface-1 ">
                    <BsCheckCircleFill className=" w-10 h-10 text-teal-500 " />
                </div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center mt-8">
                <h1 className="text-2xl font-semibold">Payment Done!</h1>
                <span className="text-sm">Thank you for your payment.</span>
            </div>
            <div className="flex text-sm flex-col gap-2 max-h-160 overflow-auto mt-4 px-4">
                <div className=" w-full flex justify-between items-center">
                    <span className=" font-normal">Order ID:</span>
                    <span className=" font-light">{data?.orderId}</span>
                </div>
                <div className=" w-full flex justify-between items-center">
                    <span className=" font-normal">Payment Method:</span>
                    <span className=" font-light">{changeCase.sentenceCase(data?.payment_method ?? "")}</span>
                </div>
                <div className=" w-full flex justify-between items-center">
                    <span className=" font-normal">Total:</span>
                    <span className=" font-light">₱ {parseFloat(data?.total_payment ?? "0").toLocaleString()}</span>
                </div>
            </div>
            <div className="px-3.5 w-full flex gap-2 mt-5">
                <Link href={"/home"} className=' w-full'>
                    <Button
                        className=" k-color-brand-primary">Go Back</Button>
                </Link>
                <Link href={`/order?id=${data?.orderId}`} className=' w-full'>
                    <Button
                        className=" k-color-brand-green">View Order</Button>
                </Link>
            </div>
        </motion.div>
    )
}
export function SuccessLoading() {
    return (
        <div className=" shadow-sm relative p-4 m-4 rounded-2xl bg-md-light-surface-1 dark:bg-md-dark-surface-1 text-md-light-on-surface dark:text-md-dark-on-surface  k-color-brand-primary w-full md:w-160 ">
            <div className="w-full flex items-center absolute justify-center z-50 -top-8 left-0">
                <div className=" dark:bg-md-dark-surface-1 p-4 rounded-full bg-md-light-surface-1 ">
                    <Skeleton height={"2.5rem"} width={"2.5em"} borderRadius={"100%"} />
                </div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center mt-8">
                <Skeleton height={"1.5rem"} width={"5rem"} />
                <Skeleton height={"1rem"} width={"3rem"} />
            </div>
            <div className="flex text-sm flex-col gap-2 max-h-160 overflow-auto mt-4 px-4">
                <div className=" w-full flex justify-between items-center">
                    <Skeleton height={"1rem"} width={"5rem"} />
                    <Skeleton height={"1rem"} width={"4rem"} />
                </div>
                <div className=" w-full flex justify-between items-center">
                    <Skeleton height={"1rem"} width={"3rem"} />
                    <Skeleton height={"1rem"} width={"3rem"} />
                </div>
                <div className=" w-full flex justify-between items-center">
                    <Skeleton height={"1rem"} width={"6rem"} />
                    <Skeleton height={"1rem"} width={"2rem"} />
                </div>
            </div>
            <div className="px-3.5 mt-5 flex gap-2 w-full">
                <div className=' w-full'>
                    <Skeleton height={"2.5rem"} width={"100%"} />
                </div>
                <div className=' w-full'>
                    <Skeleton height={"2.5rem"} width={"100%"} />
                </div>
            </div>
        </div>
    )
}
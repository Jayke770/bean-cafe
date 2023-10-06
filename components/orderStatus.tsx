"use client"
import { Badge } from "konsta/react"
import * as changeCase from 'change-case'
import type { OrderStatus } from '@/types'
export default function OrderStatus({ status }: { status?: OrderStatus }) {
    return (
        <>
            {status === "pending" && (
                <Badge
                    colors={{
                        bg: "bg-amber-500 dark:bg-amber-900",
                        text: "text-white dark:text-amber-500"
                    }} >{changeCase.sentenceCase(status ?? "")}</Badge>
            )}
            {status === "completed" && (
                <Badge
                    colors={{
                        bg: " bg-teal-500 dark:bg-teal-900",
                        text: "text-white dark:text-teal-500"
                    }} >{changeCase.sentenceCase(status ?? "")}</Badge>
            )}
            {status === "processing" && (
                <Badge>{changeCase.sentenceCase(status ?? "")}</Badge>
            )}
            {(status === "cancelled" || status === "denied") && <Badge className=" k-color-brand-red " >{changeCase.sentenceCase(status ?? "")}</Badge>}
        </>
    )
}
'use client'
import OrderInfo from '@/lib/User/orderInfo';
import { Success, SuccessLoading } from '@components/payment_card'
import { Button } from "konsta/react";
import { useSearchParams } from 'next/navigation'
export default function PaytmentSuccess() {
    const searchParams = useSearchParams()
    const { orderData, orderDataLoading } = OrderInfo(searchParams.get("orderId"))
    return (
        <div className="flex fixed top-0 left-0 z-50 w-screen h-screen justify-center items-center bg-brand-white dark:bg-brand-secondary/20">
            {orderDataLoading ? <SuccessLoading /> : <Success data={orderData} />}
        </div>
    )
}
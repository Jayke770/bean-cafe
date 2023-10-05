"use client"
import "rc-steps/assets/index.css"
import MainStep, { Step } from 'rc-steps'
import { BsInfoCircle } from 'react-icons/bs'
import { Card } from 'konsta/react'
export default function OrderInfo() {
    return (
        <div className="p-4 h-full z-5 w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-brand-secondary/20">
            <MainStep
                current={0}
                direction='horizontal'
                items={[
                    {
                        icon: <BsInfoCircle className="w-8 h-8" />,
                        title: "Submit Order"
                    },
                    {
                        icon: <BsInfoCircle className="w-8 h-8" />,
                        title: "Prepairing Order"
                    },
                    {
                        icon: <BsInfoCircle className="w-8 h-8" />,
                        title: "Done"
                    }
                ]}
            />
        </div>
    )
}
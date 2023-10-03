"use client"
import { Card } from "konsta/react";
import Skeleton from "react-loading-skeleton";
import { motion } from 'framer-motion'
export default function StatsLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3, delay: 0 }}
            className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card
                    key={i}
                    margin="m-0"
                    className=" k-color-brand-primary !rounded-md ">
                    <div className="flex justify-between w-full items-center">
                        <div className="flex flex-col">
                            <Skeleton width="2rem" />
                            <Skeleton width="3rem" />
                        </div>
                        <Skeleton width="2rem" height={"2rem"} borderRadius={"100%"} />
                    </div>
                </Card>
            ))}
        </motion.div>
    )
}
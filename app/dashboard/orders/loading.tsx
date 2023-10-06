"use client"
import Skeleton from "react-loading-skeleton"
import { motion } from 'framer-motion'
export default function loading() {
    return (
        <motion.div
            key={"orders-loading"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3, delay: 0 }}
            className="p-4 w-full">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="m-0 p-4 overflow-hidden  bg-md-light-surface-1 dark:bg-md-dark-surface-1 text-md-light-on-surface dark:text-md-dark-on-surface  k-color-brand-primary rounded-md  ">
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <Skeleton width="2rem" />
                                <Skeleton width="3rem" />
                            </div>
                            <Skeleton width="2rem" height={"2rem"} borderRadius={"100%"} />
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-col w-full mt-3'>
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                        <div className="border rounded-lg shadow dark:border-brand-primary/50 border-brand-secondary/50">
                            <div className="py-3 px-4 flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between lg:items-center">
                                <div className='text-brand-primary font-bold text-xl'>
                                    <Skeleton width={"5rem"} />
                                </div>
                                <div className='flex gap-2'>
                                    <div className="relative w-full lg:max-w-xs">
                                        <label htmlFor="hs-table-search" className="sr-only">Search</label>
                                        <Skeleton height={"2.75rem"} width={"4rem"} />
                                    </div>
                                    <Skeleton height={"2.75rem"} width={"4rem"} />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                                    <thead className=" k-color-brand-primary bg-md-light-surface-1 dark:bg-md-dark-surface-1">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                                <Skeleton width={"2rem"} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                                <Skeleton width={"2rem"} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                                <Skeleton width={"2rem"} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                                <Skeleton width={"2rem"} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                                <Skeleton width={"2rem"} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                                <Skeleton width={"2rem"} />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                    <Skeleton width={"2rem"} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                    <Skeleton width={"7rem"} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                    <Skeleton width={"2rem"} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                    <Skeleton width={"6rem"} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                    <Skeleton width={"6rem"} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                    <Skeleton width={"5rem"} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
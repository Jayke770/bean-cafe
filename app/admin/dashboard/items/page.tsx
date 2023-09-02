"use client"
import { Button, Fab, Card, Preloader } from 'konsta/react'
import { BsThreeDots } from 'react-icons/bs'
import { Checkbox } from 'konsta/react'
import { MdAdd } from 'react-icons/md';
import { useCallback, useState } from 'react';
import AddItemOrAddon from './add_item_or_addon';
import { BiFoodMenu, BiSolidMessageSquareAdd } from 'react-icons/bi';
import Items from '@lib/Admin/Items'
import Addons from "@lib/Admin/Addons"
export default function Orders() {
    const { addons } = Addons()
    const { items, itemsLoading } = Items()
    const [openNewItem, setOpenNewItem] = useState<boolean>()
    const onToggleNewItem = useCallback(() => setOpenNewItem(e => !e), [setOpenNewItem])
    return (
        <>
            <Fab
                onClick={onToggleNewItem}
                text="New Item/Add On"
                icon={<MdAdd />}
                className=' fixed bottom-5 right-4 k-color-brand-primary' />
            <AddItemOrAddon addons={addons} opened={openNewItem} onToggleNewItem={onToggleNewItem} />
            <div className='p-4'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2'>
                    <Card
                        margin="m-0"
                        className=" k-color-brand-primary !rounded-md ">
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl">{items?.length ?? 0}</span>
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
                                <span className="font-bold text-xl">{addons?.length ?? 0}</span>
                                <span className="text-sm">Total Add Ons</span>
                            </div>
                            <BiSolidMessageSquareAdd className=" h-8 w-8" />
                        </div>
                    </Card>
                </div>
                <div className="flex flex-col mt-3">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 w-full inline-block align-middle">
                            <div className="border rounded-lg shadow dark:border-brand-primary/50 border-brand-secondary/50">
                                <div className="py-3 px-4 flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between lg:items-center">
                                    <div className='text-brand-primary font-bold text-xl'>Items</div>
                                    <div className='flex gap-2'>
                                        <div className="relative w-full lg:max-w-xs">
                                            <label htmlFor="hs-table-search" className="sr-only">Search</label>
                                            <input
                                                type="text"
                                                name="hs-table-search"
                                                id="hs-table-search"
                                                className="py-3 pl-10 pr-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                                placeholder="Search for items" />
                                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                                                <svg className="h-3.5 w-3.5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <select
                                            className="py-3 px-4 w-full lg:w-auto dark:bg-transparent dark:focus:bg-black dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                            <option>All</option>
                                            <option>Coffee</option>
                                            <option>Burgers</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                                        <thead className=" k-color-brand-primary bg-md-light-surface-1 dark:bg-md-dark-surface-1">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"></th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                                            {items?.map(item => (
                                                <tr key={item._id}>
                                                    <td className='px-6 py-4'>
                                                        <Checkbox className=' k-color-brand-primary ' />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 uppercase">{item.item_id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{item.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 first-letter:uppercase ">{item?.category ?? "Others"}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                        <span>₱ 100</span>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <Button
                                                            clear
                                                            outline
                                                            small
                                                            className={`!w-auto k-color-brand-primary !px-2`}>
                                                            <BsThreeDots className=' h-5 w-5' />
                                                        </Button>
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
            </div>
        </>
    )
}
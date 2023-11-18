"use client"
import { Fab, Card, Table, TableHead, TableRow, TableBody, TableCell } from 'konsta/react'
import { MdAdd } from 'react-icons/md';
import { useCallback, useState } from 'react';
import AddItemOrAddon from './add_item_or_addon';
import { BiFoodMenu, BiSolidMessageSquareAdd } from 'react-icons/bi';
import { Items } from '@/lib/Admin/items'
import Addons from "@/lib/Admin/addons"
import Image from 'next/image';
import { type Session } from "next-auth";
import * as changeCase from 'change-case'
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import Settings from '@/lib/settings';
import Categories from '@/lib/categories';
import { useDebounce } from 'rooks';
export default function Orders({ session }: { session?: Session }) {
    const { settings } = Settings()
    const { categories } = Categories()
    const { addons } = Addons()
    const [category, setCategory] = useState<string>("all")
    const { items, itemsLoading } = Items({ category })
    const [openNewItem, setOpenNewItem] = useState<boolean>()
    const onToggleNewItem = useCallback(() => setOpenNewItem(e => !e), [setOpenNewItem])
    const onSetCategory = useDebounce((data: string) => setCategory(e => data), 200)
    return (
        <>
            <Fab
                onClick={onToggleNewItem}
                icon={<MdAdd />}
                className=' fixed bottom-5 z-20 right-4 k-color-brand-primary' />
            <AddItemOrAddon opened={openNewItem} onToggleNewItem={onToggleNewItem} />
            <div className='p-4'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2'>
                    <Card
                        margin="m-0"
                        className=" k-color-brand-primary !rounded-md ">
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl">{items?.length ?? 0}</span>
                                <span className="text-sm">Items</span>
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
                                <span className="text-sm">Add Ons</span>
                            </div>
                            <BiSolidMessageSquareAdd className=" h-8 w-8" />
                        </div>
                    </Card>
                </div>
                <Card contentWrap={false} margin='m-0' className='mt-3 block k-color-brand-primary !rounded-md '>
                    <div className=' flex flex-col gap-2 mt-3'>
                        <div className='flex flex-col gap-2 md:flex-row w-full justify-between px-4'>
                            <h1 className='text-2xl font-bold py-2'>Items</h1>
                            <div className='flex flex-col md:flex-row gap-2'>
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
                                    onChange={e => onSetCategory(e.target.value)}
                                    className="py-3 px-4 w-full lg:w-auto dark:bg-transparent dark:focus:bg-black dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                    <option value={'all'}>All</option>
                                    {categories?.map(category => <option key={category._id} value={category.type.toLowerCase()}>{category.type}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className='overflow-x-auto  w-full'>
                            <Table>
                                <TableHead>
                                    <TableRow header>
                                        {itemsLoading ? (
                                            <>
                                                <TableCell header>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell header>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell header>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell header>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell header>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell header>
                                                    <Skeleton />
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell header>Icon</TableCell>
                                                <TableCell header>ID</TableCell>
                                                <TableCell header>Name</TableCell>
                                                <TableCell header>Category</TableCell>
                                                <TableCell header>Price</TableCell>
                                                <TableCell header>Sold</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemsLoading && Array.from({ length: 10 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {items?.map(item => (
                                        <TableRow key={item.item_id}>
                                            <TableCell className='w-20'>
                                                <Image
                                                    src={item?.image}
                                                    width={300}
                                                    height={300}
                                                    alt={item?.name}
                                                    className='w-20 rounded-lg object-cover aspect-square' />
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/dashboard/items/${item.item_id}`}
                                                    className=' underline'>
                                                    {item.item_id}
                                                </Link>
                                            </TableCell>
                                            <TableCell className=' whitespace-nowrap'>{item.name}</TableCell>
                                            <TableCell className=' whitespace-nowrap'>{changeCase.sentenceCase(item.category ?? "")}</TableCell>
                                            <TableCell className=' whitespace-nowrap'>
                                                {item?.sizes?.length <= 0 ? (
                                                    <>
                                                        {settings?.currency}
                                                        {item?.price?.toLocaleString()}
                                                    </>
                                                ) : (
                                                    <div className='flex gap-2'>
                                                        <span>{settings?.currency}{item.sizes[0].price}</span>
                                                        {item.sizes.length > 1 && <span> - {settings?.currency}{item.sizes[item.sizes.length - 1].price}</span>}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{item.sold}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </Card >
            </div >
        </>
    )
}
"use client"
import { Popup, Page, Navbar, Icon, Link, Chip, Button, Segmented, SegmentedButton, List, ListItem, Checkbox, Toggle, Radio, Preloader } from "konsta/react"
import { HiXMark } from "react-icons/hi2"
import ImageInput from "@/components/ImageInput"
import { Input, TextArea, Select } from "@/components/Input"
import { useLocalstorageState } from "rooks"
import { useCallback, useState } from "react"
import Sizes from "@admin_components/Items/Sizes"
import { AnimatePresence, type Variants, motion } from "framer-motion"
import { useDailog, DialogInfo, DialogSuccess, DialogLoading } from '@components/dialog'
import { RiLoader5Fill } from 'react-icons/ri'
import { BsFillCheckCircleFill, BsInfoCircleFill } from 'react-icons/bs'
import { SIZES } from '@lib/constants'
import type { ApiResponse, AddOns } from '@/types'
import { CATEGORIES } from '@lib/constants'
import Image from "next/image"
import Categories from "@/lib/categories"
import { useForm } from 'react-hook-form'

import Addons from "@/lib/Admin/addons"
type Tab = "Item" | "Add-on" | "Category"
const Itemvariants: Variants = {
    initial: {
        x: -100,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1
    },
    exit: {
        x: -100,
        opacity: 0
    },
}
const Addonvariants: Variants = {
    initial: {
        x: 110,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1
    },
    exit: {
        x: 110,
        opacity: 0
    },
}
interface AddonOption {
    name?: string;
    price?: number;
}
interface NewAddon {
    name?: string;
    options: AddonOption[];
    category?: "coffee" | "burger";
}
interface NewItem {
    name?: string
    price?: number,
    quantiry?: number,
    description?: string
    sizes: NewItemSize[],
    addons: string[]
}
interface NewItemSize {
    type: string,
    price?: number,
    stocks?: number
}
export default function AddItemorAddon({ onToggleNewItem, opened }: { opened?: boolean, onToggleNewItem: () => void }) {
    const [addonType, setAddonType] = useLocalstorageState<string>("addon-type")
    const { addons, addonsLoading } = Addons(addonType)
    const { onShowDialog } = useDailog()
    const { handleSubmit, register } = useForm()
    const { categories, mutate: updateCategories } = Categories()
    const [newAddon, setNewAddon] = useState<NewAddon>({ options: [] })
    const [AddItemSize, setAddItemSize] = useState<boolean>(false)
    const [newItem, setNewItem] = useState<NewItem>({ sizes: [], addons: [] })
    const [tab, setTab] = useLocalstorageState<Tab>("AddItemorAddon", "Item")
    const onToggleTab = useCallback((data: Tab) => setTab(e => data), [setTab])
    const onSubmitItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            onShowDialog({
                content: <DialogLoading text="Saving Item" />
            })
            const req = await fetch("/api/dashboard/items", {
                method: 'post',
                body: new FormData(e.target as any)
            })
            if (req.ok) {
                const res: ApiResponse = await req.json()
                onShowDialog({
                    timer: 2000,
                    content: res?.status ? <DialogSuccess text={res?.message} /> : <DialogInfo text={res?.message} />
                })
            } else {
                throw new Error(`${req.status} ${req.statusText}`)
            }
        } catch (e: any) {
            onShowDialog({
                timer: 2000,
                content: <DialogInfo text={e?.message} />
            })
        }
    }
    const onSubmitAddOn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            onShowDialog({
                content: <DialogLoading text="Saving Add-On" />
            })
            const req = await fetch("/api/dashboard/items/addon", {
                method: 'post',
                body: new FormData(e.target as any)
            })
            if (req.ok) {
                const res: ApiResponse = await req.json()
                onShowDialog({
                    timer: 2000,
                    content: res?.status ? <DialogSuccess text={res?.message} /> : <DialogInfo text={res?.message} />
                })
            } else {
                throw new Error(`${req.status} ${req.statusText}`)
            }
        } catch (e: any) {
            onShowDialog({
                timer: 2000,
                content: <DialogInfo text={e?.message} />
            })
        }
    }
    const onSetAddonOption = useCallback((data: AddonOption) => setNewAddon(e => ({ ...e, options: [...e.options, data] })), [])
    const onRemoveOption = useCallback((i: number) => setNewAddon(e => ({ ...e, options: [...e.options.slice(0, i), ...e.options.slice(i + 1)] })), [])
    const onAddNewItemSize = useCallback((data: NewItemSize) => setNewItem(e => ({ ...e, sizes: [...e.sizes, { price: data.price, type: data.type, stocks: data.stocks }] })), [])
    const onRemoveSize = useCallback((i: number) => setNewItem(e => ({ ...e, sizes: [...e.sizes.slice(0, i), ...e.sizes.slice(i + 1)] })), [])
    const onToggleItemAddon = useCallback((id: string) => {
        const index = newItem.addons.findIndex(x => x === id)
        index >= 0 ? setNewItem(e => ({ ...e, addons: [...e.addons.slice(0, index), ...e.addons.slice(index + 1)] })) : setNewItem(e => ({ ...e, addons: [...e.addons, id] }))
    }, [newItem.addons])
    const onToggleAddItemSize = () => setAddItemSize(e => !e)
    const onSubmiCategory = async (e: any) => {
        try {
            onShowDialog({
                content: <DialogLoading text="Saving Category" />
            })
            const req = await fetch("/api/dashboard/category", {
                method: 'post',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(e)
            })
            updateCategories()
            if (req.ok) {
                const res: ApiResponse = await req.json()
                onShowDialog({
                    timer: 2000,
                    content: res?.status ? <DialogSuccess text={res?.message} /> : <DialogInfo text={res?.message} />
                })
            } else {
                throw new Error(`${req.status} ${req.statusText}`)
            }
        } catch (e: any) {
            onShowDialog({
                timer: 2000,
                content: <DialogInfo text={e?.message} />
            })
        }
    }
    const onDeleteCategory = async (id: string) => {
        try {
            onShowDialog({
                content: <DialogLoading text="Deleting Category" />
            })
            const req = await fetch("/api/dashboard/category", {
                method: 'delete',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ id })
            })
            updateCategories()
            if (req.ok) {
                const res: ApiResponse = await req.json()
                onShowDialog({
                    timer: 2000,
                    content: res?.status ? <DialogSuccess text={res?.message} /> : <DialogInfo text={res?.message} />
                })
            } else {
                throw new Error(`${req.status} ${req.statusText}`)
            }
        } catch (e: any) {
            onShowDialog({
                timer: 2000,
                content: <DialogInfo text={e?.message} />
            })
        }
    }
    return (
        <Popup
            opened={opened}
            onBackdropClick={onToggleNewItem}>
            <Page className=' k-color-brand-primary'>
                <Navbar
                    title={`New ${tab}`}
                    right={
                        <Link onClick={onToggleNewItem} navbar iconOnly className=' k-color-brand-red'>
                            <Icon>
                                <HiXMark className=' text-brand-red w-6 h-6' />
                            </Icon>
                        </Link>
                    } />
                <div className="h-[calc(100%-64px)] relative overflow-hidden">
                    {/* Tab */}
                    <div className="px-4 py-2 translucent z-10">
                        <Segmented strong>
                            <SegmentedButton
                                className=" k-color-brand-primary "
                                onClick={() => onToggleTab("Item")}
                                active={tab === "Item"}
                                strong>Item</SegmentedButton>
                            <SegmentedButton
                                className=" k-color-brand-primary "
                                onClick={() => onToggleTab("Add-on")}
                                active={tab === "Add-on"}
                                strong>Add On</SegmentedButton>
                            <SegmentedButton
                                className=" k-color-brand-primary "
                                onClick={() => onToggleTab("Category")}
                                active={tab === "Category"}
                                strong>Categories</SegmentedButton>
                        </Segmented>
                    </div>
                    <AnimatePresence mode="wait">
                        {tab === "Item" && (
                            <motion.form
                                key={tab}
                                variants={Itemvariants}
                                initial={"initial"}
                                animate={"animate"}
                                exit={"exit"}
                                transition={{ ease: "backInOut", duration: 0.3 }}
                                onSubmit={onSubmitItem}
                                className="flex flex-col gap-2 z-0 overflow-auto h-full">
                                <div className="flex flex-col gap-2 overflow-auto pb-40-safe p-4">
                                    <ImageInput accept="image/*" name="image" />
                                    <input type="hidden" value={JSON.stringify(newItem.sizes)} name="sizes" />
                                    <input type="hidden" value={JSON.stringify(newItem.addons)} name="addons" />
                                    <div className="flex flex-col gap-2 mt-2 ">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                required
                                                label="Name"
                                                name="name"
                                                placeholder="e.g. Coffee" />
                                            <Select
                                                onChange={e => setAddonType(e.target.value)}
                                                label="Category"
                                                name="category">
                                                <option value={undefined}>Select Category</option>
                                                {categories?.map(category => <option key={category?.type} value={category?.type.toLowerCase()}>{category?.type}</option>)}
                                            </Select>
                                        </div>
                                        <TextArea
                                            required
                                            label="Description"
                                            name="description"
                                            className=" h-40 resize-none "
                                            placeholder="e.g. Best Coffee" />
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="block text-sm font-medium ">Add Size</span>
                                            <Toggle onChange={onToggleAddItemSize} checked={AddItemSize} className=" k-color-brand-primary" />
                                        </div>
                                        {AddItemSize ? (
                                            <div className="flex flex-col">
                                                <Sizes
                                                    sizes={SIZES.filter(data => !newItem.sizes.find(x => x.type === data.toLowerCase()))}
                                                    onAdd={data => data && onAddNewItemSize(data)} />
                                                <div className="flex mt-2 flex-wrap">
                                                    {newItem?.sizes.map((size, i) => (
                                                        <Chip
                                                            key={i}
                                                            className="m-0.5 uppercase"
                                                            deleteButton
                                                            onDelete={() => onRemoveSize(i)}>
                                                            {size.type} - ₱{size.price}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    label="Price"
                                                    name="price"
                                                    inputMode="numeric"
                                                    type="number"
                                                    placeholder="e.g. 10" />
                                                <Input
                                                    label="Stocks"
                                                    name="stocks"
                                                    inputMode="numeric"
                                                    type="number"
                                                    placeholder="e.g. 10" />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-2">
                                            {addonsLoading && <Preloader className=" w-full self-center mt-3 " />}
                                            {addons?.length > 0 && (
                                                <>
                                                    <span className="block text-sm font-medium">Add Ons</span>
                                                    <List margin="my-0">
                                                        {addons?.map(addon => (
                                                            <ListItem
                                                                key={addon.id}
                                                                title={addon?.name}
                                                                link
                                                                chevron={false}
                                                                onClick={() => onToggleItemAddon(addon.id)}
                                                                after={
                                                                    <Checkbox
                                                                        checked={!!newItem?.addons.find(x => x === addon.id)}
                                                                        readOnly
                                                                        className=" pointer-events-none" />
                                                                }
                                                                media={
                                                                    <Image
                                                                        src={addon.image}
                                                                        width={300}
                                                                        height={300}
                                                                        alt={addon.name}
                                                                        className="h-10 w-10 aspect-square object-cover" />
                                                                } />
                                                        ))}
                                                    </List>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full z-10 absolute inset-x-0 bottom-0 p-4 translucent ">
                                    <Button
                                        className=" k-color-brand-primary">Submit</Button>
                                </div>
                            </motion.form>
                        )}
                        {tab === "Add-on" && (
                            <motion.form
                                key={tab}
                                variants={Addonvariants}
                                initial={"initial"}
                                animate={"animate"}
                                exit={"exit"}
                                transition={{ ease: "backInOut", duration: 0.3 }}
                                onSubmit={onSubmitAddOn}
                                className="flex flex-col gap-2 z-0 overflow-auto h-full">
                                <div className="flex flex-col gap-2 overflow-auto pb-40-safe p-4">
                                    <ImageInput accept="image/*" name="image" />
                                    <div className="flex flex-col gap-2 mt-2 ">
                                        <div className="grid lg:grid-cols-2 gap-2">
                                            <Input
                                                label="Add-on Name"
                                                name="name"
                                                placeholder="e.g. Milk" />
                                            <Select
                                                label="Category"
                                                name="category">
                                                <option value={undefined}>Select Category</option>
                                                {categories?.map(category => <option key={category?.type} value={category?.type.toLowerCase()}>{category?.type}</option>)}
                                            </Select>
                                            <Input
                                                label="Price"
                                                name="price"
                                                type="number"
                                                inputMode="numeric"
                                                placeholder="e.g. 10" />
                                            <Input
                                                label="Stocks"
                                                name="stocks"
                                                type="number"
                                                inputMode="numeric"
                                                placeholder="e.g. 10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full z-10 absolute inset-x-0 bottom-0 p-4 translucent ">
                                    <Button
                                        className=" k-color-brand-primary">Submit</Button>
                                </div>
                            </motion.form>
                        )}
                        {tab === "Category" && (
                            <motion.form
                                key={tab}
                                onSubmit={handleSubmit(onSubmiCategory)}
                                variants={Addonvariants}
                                initial={"initial"}
                                animate={"animate"}
                                exit={"exit"}
                                transition={{ ease: "backInOut", duration: 0.3 }}
                                className="flex flex-col gap-2 z-0 overflow-auto h-full w-full">
                                <div className="grid gap-2 w-full pb-40-safe p-4 overflow-auto">
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor={"category"} className="block text-sm font-medium">Category</label>
                                        <input
                                            {...register("category")}
                                            id={"category"}
                                            name={"category"}
                                            className={`py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`}
                                            placeholder="Category"
                                            required />
                                    </div>
                                    <div className="flex gap-2 flex-wrap ">
                                        {categories?.map(category => (
                                            <Chip
                                                onDelete={() => onDeleteCategory(category._id)}
                                                deleteButton
                                                key={category.type}>{category.type}</Chip>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full z-10 absolute inset-x-0 bottom-0 p-4 translucent ">
                                    <Button
                                        className=" k-color-brand-primary">Submit</Button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </Page>
        </Popup>
    )
}

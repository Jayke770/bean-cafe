"use client"
import { Popup, Page, Navbar, Icon, Link, Chip, Button, Segmented, SegmentedButton, List, ListItem, Checkbox } from "konsta/react"
import { HiXMark } from "react-icons/hi2"
import ImageInput from "@/components/ImageInput"
import { Input, TextArea, Select } from "@/components/Input"
import { useLocalstorageState } from "rooks"
import { useCallback, useState } from "react"
import AddOnOption from '@admin_components/Items/AddOnOption'
import Sizes from "@admin_components/Items/Sizes"
import { AnimatePresence, type Variants, motion } from "framer-motion"
import { useDailog } from '@components/dialog'
import { RiLoader5Fill } from 'react-icons/ri'
import { BsFillCheckCircleFill, BsInfoCircleFill } from 'react-icons/bs'
import { SIZES } from '@lib/constants'
import type { ApiResponse, AddOns } from '@/types'
import Image from "next/image"
type Tab = "Item" | "Add-on"
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
interface Addon extends AddOns {
    _id: string;
}
export default function AddItemorAddon({ onToggleNewItem, opened, addons }: { addons?: Addon[], opened?: boolean, onToggleNewItem: () => void }) {
    const { onShowDialog } = useDailog()
    const [newAddon, setNewAddon] = useState<NewAddon>({ options: [] })
    const [newItem, setNewItem] = useState<NewItem>({ sizes: [], addons: [] })
    const [tab, setTab] = useLocalstorageState<Tab>("AddItemorAddon", "Item")
    const onToggleTab = useCallback(() => setTab(e => e === "Item" ? "Add-on" : "Item"), [setTab])
    const onSubmitItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            onShowDialog({
                content: (
                    <div className="flex flex-col items-center justify-center  gap-3">
                        <span className=" text-lg font-bold">Saving Item</span>
                        <RiLoader5Fill className=" h-8 w-8 animate-spin text-brand-primary " />
                    </div>
                )
            })
            const req = await fetch("/api/admin/items", {
                method: 'post',
                body: new FormData(e.target as any)
            })
            if (req.ok) {
                const res: ApiResponse = await req.json()
                onShowDialog({
                    timer: 2000,
                    content: (
                        res?.status ? (
                            <div className="flex flex-col items-center justify-center  gap-3">
                                <BsFillCheckCircleFill className=" h-8 w-8 text-teal-500 " />
                                <span className=" text-lg font-bold">{res?.message}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center  gap-3">
                                <BsInfoCircleFill className=" h-8 w-8  text-blue-500 " />
                                <span className=" text-lg font-bold">{res?.message}</span>
                            </div>
                        )
                    )
                })
            } else {
                throw new Error(`${req.status} ${req.statusText}`)
            }
        } catch (e: any) {
            onShowDialog({
                timer: 2000,
                content: (
                    <div className="flex flex-col items-center justify-center  gap-3">
                        <BsInfoCircleFill className=" h-8 w-8  text-red-500 " />
                        <span className=" text-lg font-bold">{e.message}</span>
                    </div>
                )
            })
        }
    }
    const onSubmitAddOn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            onShowDialog({
                content: (
                    <div className="flex flex-col items-center justify-center  gap-3">
                        <span className=" text-lg font-bold">Saving Add-On</span>
                        <RiLoader5Fill className=" h-8 w-8 animate-spin text-brand-primary " />
                    </div>
                )
            })
            const req = await fetch("/api/admin/items/addon", {
                method: 'post',
                body: new FormData(e.target as any)
            })
            if (req.ok) {
                const res: ApiResponse = await req.json()
                onShowDialog({
                    timer: 2000,
                    content: (
                        res?.status ? (
                            <div className="flex flex-col items-center justify-center  gap-3">
                                <BsFillCheckCircleFill className=" h-8 w-8 text-teal-500 " />
                                <span className=" text-lg font-bold">{res?.message}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center  gap-3">
                                <BsInfoCircleFill className=" h-8 w-8  text-blue-500 " />
                                <span className=" text-lg font-bold">{res?.message}</span>
                            </div>
                        )
                    )
                })
            } else {
                throw new Error(`${req.status} ${req.statusText}`)
            }
        } catch (e: any) {
            onShowDialog({
                timer: 2000,
                content: (
                    <div className="flex flex-col items-center justify-center  gap-3">
                        <BsInfoCircleFill className=" h-8 w-8  text-red-500 " />
                        <span className=" text-lg font-bold">{e.message}</span>
                    </div>
                )
            })
        }
    }
    const onSetAddonOption = useCallback((data: AddonOption) => setNewAddon(e => ({ ...e, options: [...e.options, data] })), [])
    const onRemoveOption = useCallback((i: number) => setNewAddon(e => ({ ...e, options: [...e.options.slice(0, i), ...e.options.slice(i + 1)] })), [])
    const onAddNewItemSize = useCallback((data: NewItemSize) => setNewItem(e => ({ ...e, sizes: [...e.sizes, { price: data.price, type: data.type }] })), [])
    const onRemoveSize = useCallback((i: number) => setNewItem(e => ({ ...e, sizes: [...e.sizes.slice(0, i), ...e.sizes.slice(i + 1)] })), [])
    const onToggleItemAddon = useCallback((id: string) => {
        const index = newItem.addons.findIndex(x => x === id)
        index >= 0 ? setNewItem(e => ({ ...e, addons: [...e.addons.slice(0, index), ...e.addons.slice(index + 1)] })) : setNewItem(e => ({ ...e, addons: [...e.addons, id] }))
    }, [newItem.addons])
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
                                onClick={onToggleTab}
                                active={tab === "Item"}
                                strong>Item</SegmentedButton>
                            <SegmentedButton
                                className=" k-color-brand-primary "
                                onClick={onToggleTab}
                                active={tab === "Add-on"}
                                strong>Add On</SegmentedButton>
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
                                                label="Category"
                                                name="category">
                                                <option value={undefined}>Select Category</option>
                                                <option value={"coffee"}>Coffee</option>
                                                <option value={"burger"}>Burger</option>
                                            </Select>
                                        </div>
                                        <TextArea
                                            required
                                            label="Description"
                                            name="description"
                                            className=" h-40 resize-none "
                                            placeholder="e.g. Best Coffee" />
                                        <div className="flex flex-col">
                                            <div className="flex flex-col">
                                                <span className="block text-sm font-medium">Sizes</span>
                                                <Sizes
                                                    sizes={SIZES.filter(data => !newItem.sizes.find(x => x.type === data.toLowerCase()))}
                                                    onAdd={data => data && onAddNewItemSize(data)} />
                                            </div>
                                            <div className="flex mt-2">
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
                                        <div className="flex flex-col gap-2">
                                            <span className="block text-sm font-medium px-3.5">Add Ons</span>
                                            <List margin="my-0">
                                                {addons?.map(addon => (
                                                    <ListItem
                                                        key={addon._id}
                                                        title={addon?.name}
                                                        link
                                                        chevron={false}
                                                        onClick={() => onToggleItemAddon(addon._id)}
                                                        after={
                                                            <Checkbox
                                                                checked={!!newItem?.addons.find(x => x === addon._id)}
                                                                readOnly
                                                                className=" pointer-events-none" />
                                                        }
                                                        media={
                                                            <Image
                                                                src={`/api/files?type=addons&file_path=${addon.image}`}
                                                                width={300}
                                                                height={300}
                                                                alt={addon.name}
                                                                className="h-10 w-10" />
                                                        } />
                                                ))}
                                            </List>
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
                                    <input type="hidden" name="options" value={JSON.stringify(newAddon?.options)} />
                                    <div className="flex flex-col gap-2 mt-2 ">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                label="Add-on Name"
                                                name="name"
                                                placeholder="e.g. Milk" />
                                            <Select
                                                label="Category"
                                                name="category">
                                                <option value={undefined}>Select Category</option>
                                                <option value={"coffee"}>Coffee</option>
                                                <option value={"burger"}>Burger</option>
                                            </Select>
                                        </div>
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-col">
                                                <div className="block text-sm font-medium">Options</div>
                                                <AddOnOption onAdd={data => onSetAddonOption(data)} />
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {newAddon?.options?.map((addon, i) => (
                                                    <Chip
                                                        key={i}
                                                        className="m-0.5"
                                                        deleteButton
                                                        onDelete={() => onRemoveOption(i)}>
                                                        {addon.name} - ₱{addon.price}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>
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

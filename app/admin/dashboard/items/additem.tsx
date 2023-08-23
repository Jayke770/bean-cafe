"use client"
import { Popup, Page, Navbar, Icon, Link, Chip, Button } from "konsta/react"
import { HiXMark } from "react-icons/hi2"
import ImageInput from "@/components/ImageInput"
import { Input, TextArea, Select } from "@/components/Input"
export default function AddItem({ onToggleNewItem, opened }: { opened?: boolean, onToggleNewItem: () => void }) {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }
    return (
        <Popup
            opened={opened}
            onBackdropClick={onToggleNewItem}>
            <Page className=' k-color-brand-primary'>
                <Navbar
                    title='New Item'
                    right={
                        <Link onClick={onToggleNewItem} navbar iconOnly className=' k-color-brand-red'>
                            <Icon>
                                <HiXMark className=' text-brand-red w-6 h-6' />
                            </Icon>
                        </Link>
                    } />
                <form onSubmit={onSubmit} className="flex flex-col gap-2 h-[calc(100%-64px)] relative overflow-hidden">
                    <div className="flex flex-col gap-2 overflow-auto pb-20-safe p-4">
                        <ImageInput accept="image/*" name="image" />
                        <div className="flex flex-col gap-2 mt-2 ">
                            <Input
                                label="Name"
                                name="name"
                                placeholder="e.g. Coffee" />
                            <TextArea
                                label="Description"
                                name="decription"
                                className=" h-40 resize-none "
                                placeholder="e.g. Best Coffee" />
                            <Input
                                label="Price"
                                name="price"
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g. Coffee" />
                            <div className="flex flex-col gap-2">
                                <span className="block text-sm font-medium">Size</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="py-1 px-4 block dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                        Small
                                    </button>
                                    <button
                                        type="button"
                                        className="py-1 px-4 block dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                        Medium
                                    </button>
                                    <button
                                        type="button"
                                        className="py-1 px-4 block dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                        Large
                                    </button>
                                    <button
                                        type="button"
                                        className="py-1 px-4 block dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                        Extra Large
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="block text-sm font-medium">Add Ons</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="py-1 px-4 block dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                        Milk
                                    </button>
                                    <button
                                        type="button"
                                        className="py-1 px-4 block dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                        Ice Cream
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full absolute inset-x-0 bottom-0 p-4">
                        <Button
                            className=" k-color-brand-primary">Add Item</Button>
                    </div>
                </form>
            </Page>
        </Popup>
    )
}
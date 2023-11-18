"use client"
import { Badge, Card, Checkbox, List, ListItem, Segmented, SegmentedButton, Icon, Preloader, Button, Popup, Page, Navbar, Link, Searchbar, ListInput, Dialog, DialogButton, Chip } from "konsta/react";
import { motion } from 'framer-motion'
import { ItemInfo } from '@lib/Admin/items'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import * as changeCase from 'change-case'
import Skeleton from 'react-loading-skeleton';
import { useLocalstorageState, useDebounce } from "rooks";
import { useState } from "react";
import toast from 'react-hot-toast'
import type { ApiResponse, IItemSizes } from '@/types'
import { HiMiniXMark } from 'react-icons/hi2'
import Addons from '@lib/Admin/addons'
import Swal from "@/lib/swal";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import Settings from "@/lib/settings";
import Sizes from "@admin_components/Items/Sizes"
import { HiOutlineXMark } from "react-icons/hi2";
type UpdateItemTab = "addon" | "sizes" | "others" | "prices"

interface SizeData {
    type: string,
    price?: number,
    stocks?: number
}
interface Options {
    isUpdatingBestSeller?: boolean,
    isUpdatingAddon?: boolean,
    openAddons?: boolean,
    openSizes?: boolean,
    searchAddon?: string,
    editPrice?: string,
    newPrice?: number,
    newSizes?: SizeData[]
}
export default function ItemData() {
    const { settings } = Settings()
    const params = useParams()
    const router = useRouter()
    const [options, setOptions] = useState<Options>()
    const [updateTab, setUpdateTab] = useLocalstorageState<UpdateItemTab>("update-item-tab", "addon")
    const { item, itemLoading, mutate: UpdateItem } = ItemInfo(params.id as string)
    const { addons, addonsLoading, mutate: UpdateAddon } = Addons(item?.category, options?.searchAddon)
    const onSetUpdateTab = (tab: UpdateItemTab) => setUpdateTab(e => tab)
    const onSetBestSeller = () => {
        toast.promise(((): Promise<ApiResponse> => {
            setOptions(e => ({ ...e, isUpdatingBestSeller: true }))
            return new Promise(async (resolve, reject) => {
                try {
                    const req = await fetch("/api/dashboard/items/best-seller", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ id: item?.item_id })
                    })
                    if (req.ok) {
                        const res: ApiResponse = await req.json()
                        UpdateItem()
                        setOptions(e => ({ ...e, isUpdatingBestSeller: false }))
                        res?.status ? resolve(res) : reject(res.message)
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                } catch (e: any) {
                    setOptions(e => ({ ...e, isUpdatingBestSeller: false }))
                    reject(e.message)
                }
            })
        })(), {
            loading: 'Checking Item...',
            success: (data: ApiResponse) => `${data.message}`,
            error: e => e,
        })
    }
    const onToggleAddons = () => setOptions(e => ({ ...e, openAddons: !e?.openAddons }))
    const onSearchAddon = useDebounce((e: any) => setOptions(old => ({ ...old, searchAddon: e.target.value })), 500)
    const onUpdateAddon = (id: string) => {
        toast.promise(((): Promise<ApiResponse> => {
            setOptions(e => ({ ...e, isUpdatingAddon: true }))
            return new Promise(async (resolve, reject) => {
                try {
                    const req = await fetch("/api/dashboard/items/update-addon", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ addon_id: id, item_id: item?.item_id })
                    })
                    if (req.ok) {
                        const res: ApiResponse = await req.json()
                        UpdateItem()
                        UpdateAddon()
                        setOptions(e => ({ ...e, isUpdatingAddon: false }))
                        res?.status ? resolve(res) : reject(res.message)
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                } catch (e: any) {
                    setOptions(e => ({ ...e, isUpdatingAddon: false }))
                    reject(e.message)
                }
            })
        })(), {
            loading: 'Updating Addon...',
            success: (data: ApiResponse) => `${data.message}`,
            error: e => e,
        })
    }
    const onToggleEditPrice = (size?: string) => setOptions(e => ({ ...e, editPrice: size }))
    const onUpdatePrice = (id: string) => {
        toast.promise(((): Promise<ApiResponse> => {
            return new Promise(async (resolve, reject) => {
                try {
                    const req = await fetch("/api/dashboard/items/update-size", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ id: item?.item_id, type: options?.editPrice, price: options?.newPrice })
                    })
                    if (req.ok) {
                        const res: ApiResponse = await req.json()
                        UpdateItem()
                        UpdateAddon()
                        setOptions(e => ({ ...e, isUpdatingAddon: false }))
                        res?.status ? resolve(res) : reject(res.message)
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                } catch (e: any) {
                    setOptions(e => ({ ...e, isUpdatingAddon: false }))
                    reject(e.message)
                }
            })
        })(), {
            loading: 'Updating Price...',
            success: (data: ApiResponse) => `${data.message}`,
            error: e => e,
        })
    }
    const onDeleteItem = () => {
        Swal.fire({
            icon: "warning",
            titleText: "Delete Item",
            text: 'Are you sure want to delete this item? This action cannot be undone!',
            confirmButtonText: "Delete",
            showCancelButton: true
        }).then(a => {
            if (a.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    toast: true,
                    showConfirmButton: false,
                    titleText: "Deleting Item...",
                    willOpen: async () => {
                        Swal.showLoading()
                        try {
                            const req = await fetch("/api/dashboard/items", {
                                method: 'delete',
                                headers: {
                                    "content-type": "application/json"
                                },
                                body: JSON.stringify({ id: item?.item_id })
                            })
                            if (req.ok) {
                                const data: ApiResponse = await req.json()
                                Swal.fire({
                                    icon: data?.status ? "success" : "info",
                                    toast: true,
                                    timer: 2000,
                                    titleText: data?.message,
                                    showConfirmButton: false
                                }).then(() => router.replace("/dashboard/items"))
                            } else {
                                throw new Error(`${req.status} ${req.statusText}`)
                            }
                        } catch (e: any) {
                            Swal.fire({
                                icon: "error",
                                toast: true,
                                timer: 3000,
                                titleText: e.message,
                            })
                        }
                    }
                })
            }
        })
    }
    const onToggleSizes = () => setOptions(e => ({ ...e, openSizes: !e?.openSizes }))
    const onAddSize = (data: SizeData) => {
        const itemData = options?.newSizes?.find(x => x.type === data.type)
        const alreadyAdded = item.sizes.find(x => x.type === data.type)
        if (!itemData && !alreadyAdded) setOptions(e => ({ ...e, newSizes: [...e?.newSizes ?? [], data] }))
    }
    const onRemoveSize = (index: number) => {
        let oldSizes = options?.newSizes
        if ((oldSizes?.length ?? 0) > 0) {
            oldSizes?.splice(index, 1)
            setOptions(e => ({ ...e, newSizes: oldSizes }))
        }
    }
    const onUpdateSize = () => {
        Swal.fire({
            icon: "warning",
            titleText: "Update Item Size",
            text: 'Are you sure want update sizes?',
            showCancelButton: true
        }).then(a => {
            if (a.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    titleText: "Updating Size...",
                    toast: true,
                    showConfirmButton: false,
                    willOpen: async () => {
                        Swal.showLoading()
                        try {
                            const req = await fetch("/api/dashboard/items/update-size?type=new", {
                                method: "post",
                                headers: {
                                    'content-type': "application/json"
                                },
                                body: JSON.stringify({
                                    id: item?.item_id,
                                    sizes: options?.newSizes
                                })
                            })
                            if (req.ok) {
                                const res: ApiResponse = await req.json()
                                UpdateItem()
                                Swal.fire({
                                    icon: res?.status ? "success" : "info",
                                    titleText: res?.message,
                                    toast: true,
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                            } else {
                                throw new Error(`${req?.status} ${req?.statusText}`)
                            }
                        } catch (e: any) {
                            Swal.fire({
                                icon: "error",
                                titleText: e.message,
                                toast: true,
                                showConfirmButton: false,
                                timer: 2000
                            })
                        }
                    }
                })
            }
        })
    }
    const onDeleteSize = (size: string) => {
        Swal.fire({
            icon: "warning",
            titleText: "Delete Size",
            text: 'Are you sure want to delete this item size? This action cannot be undone!',
            confirmButtonText: "Delete",
            showCancelButton: true
        }).then(a => {
            if (a.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    toast: true,
                    showConfirmButton: false,
                    titleText: "Deleting Item...",
                    willOpen: async () => {
                        Swal.showLoading()
                        try {
                            const req = await fetch("/api/dashboard/items/update-size", {
                                method: 'delete',
                                headers: {
                                    "content-type": "application/json"
                                },
                                body: JSON.stringify({ id: item?.item_id, size })
                            })
                            if (req.ok) {
                                const data: ApiResponse = await req.json()
                                UpdateItem()
                                Swal.fire({
                                    icon: data?.status ? "success" : "info",
                                    toast: true,
                                    timer: 2000,
                                    titleText: data?.message,
                                    showConfirmButton: false
                                })
                            } else {
                                throw new Error(`${req.status} ${req.statusText}`)
                            }
                        } catch (e: any) {
                            Swal.fire({
                                icon: "error",
                                toast: true,
                                timer: 3000,
                                titleText: e.message,
                            })
                        }
                    }
                })
            }
        })
    }
    return (
        <>
            <div className="flex flex-col lg:flex-row transition-all gap-2 p-4 lg:h-[calc(100vh-64px)]">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="h-full">
                    <Card
                        margin="m-0"
                        className="h-full w-full lg:w-96 k-color-brand-primary"
                        contentWrap={false}>
                        <div className=" h-full overflow-auto p-4">
                            <div className="mb-4 flex justify-between">
                                {itemLoading ? (
                                    <>
                                        <Skeleton width={"5rem"} />
                                        <div className="block">
                                            <Skeleton width={"2rem"} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-2xl font-bold">{item?.name}</h1>
                                        <div className="block">
                                            {item?.isBestSeller && <Badge className=" k-color-brand-primary mr-2" >Best Seller</Badge>}
                                            <Badge className=" k-color-brand-green" >{item?.sold} Sold</Badge>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='shadow-lg  bg-brand-white/60 h-48 rounded-2xl overflow-hidden'>
                                <Image
                                    priority
                                    src={item?.image ?? "/logo.png"}
                                    alt={item?.name ?? "loading"}
                                    width={300}
                                    height={300}
                                    className=' aspect-square h-full w-full object-cover lg:object-contain ' />
                            </div>
                            <div className="flex flex-col gap-5 mt-5">
                                <div className="flex flex-col">
                                    {itemLoading ? (
                                        <>
                                            <Skeleton width={"5rem"} height={"1.5rem"} />
                                            <Skeleton width={"100%"} />
                                            <Skeleton width={"60%"} />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xl font-semibold">Description</span>
                                            <div className=" break-words text-sm font-thin ">{item?.description}</div>
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {itemLoading ? (
                                        <>
                                            <Skeleton width={"5rem"} height={"1.5rem"} />
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="flex  justify-between">
                                                    <Skeleton width={"2rem"} />
                                                    <Skeleton width={"1.5rem"} />
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xl font-semibold">Price List</span>
                                            {item?.price ? (
                                                <div className="flex justify-between">
                                                    <span>Regular</span>
                                                    <span className=" font-light">{settings?.currency}{item?.price?.toLocaleString()}</span>
                                                </div>
                                            ) : (
                                                item?.sizes?.map(size => (
                                                    <div key={size.id} className="flex justify-between">
                                                        <span>{changeCase.sentenceCase(size?.type ?? "")}</span>
                                                        <span className=" font-light">{settings?.currency}{size?.price?.toLocaleString()}</span>
                                                    </div>
                                                ))
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {itemLoading ? (
                                        <>
                                            <Skeleton width={"5rem"} />
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="flex  justify-between">
                                                    <Skeleton width={"2rem"} />
                                                    <Skeleton width={"1.5rem"} />
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xl font-semibold">Addons</span>
                                            {item?.addons?.map(addon => (
                                                <div key={addon.id} className="flex justify-between">
                                                    <span>{addon?.name}</span>
                                                    <span className=" font-light">{settings?.currency}{addon?.price}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                    className="h-full flex w-full ">
                    <Card
                        margin="m-0"
                        className="h-full w-full k-color-brand-primary">
                        <div className="lg:w-80">
                            <Segmented strong>
                                <SegmentedButton
                                    strong
                                    onClick={() => onSetUpdateTab("addon")}
                                    active={updateTab === "addon"}>Addon</SegmentedButton>
                                <SegmentedButton
                                    strong
                                    onClick={() => onSetUpdateTab("sizes")}
                                    active={updateTab === "sizes"}>Sizes</SegmentedButton>
                                <SegmentedButton
                                    strong
                                    onClick={() => onSetUpdateTab("prices")}
                                    active={updateTab === "prices"}>Prices</SegmentedButton>
                                <SegmentedButton
                                    strong
                                    onClick={() => onSetUpdateTab("others")}
                                    active={updateTab === "others"}>Others</SegmentedButton>
                            </Segmented>
                        </div>
                        {updateTab === "addon" && (
                            <List margin="my-4">
                                {itemLoading ? (
                                    <>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <ListItem
                                                key={i}
                                                media={<Skeleton width={"2rem"} />}
                                                title={<Skeleton width={"3rem"} />}
                                                subtitle={<Skeleton width={"4rem"} />}
                                                after={<Skeleton width={"2rem"} />} />
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div className="px-3.5 font-bold text-lg">Selected Addons</div>
                                        {item?.addons?.map(addon => (
                                            <ListItem
                                                key={addon.id}
                                                media={
                                                    <Image
                                                        src={addon?.image ?? "/logo.png"}
                                                        width={300}
                                                        height={300}
                                                        alt={addon?.name ?? "loading"}
                                                        loading="lazy"
                                                        className=" rounded-xl h-10 w-10" />
                                                }
                                                title={addon?.name}
                                                subtitle={`${settings?.currency} ${addon?.price}`}
                                                after={`Stock: ${addon?.stocks}`} />
                                        ))}
                                        <div className="px-3.5  justify-center w-full  mt-2 flex">
                                            <div className="flex gap-2 lg:w-80 w-full">
                                                <Button
                                                    onClick={onToggleAddons}
                                                    small
                                                    tonal
                                                    className=" k-color-brand-green">
                                                    Manage Addon
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </List>
                        )}
                        {updateTab === "sizes" && (
                            <List margin="my-4">
                                {itemLoading ? (
                                    <>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <ListItem
                                                key={i}
                                                title={<Skeleton width={"3rem"} />}
                                                subtitle={<Skeleton width={"4rem"} />}
                                                after={<Skeleton width={"2rem"} />} />
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {item?.sizes?.length <= 0 ? (
                                            <ListItem
                                                key={"regular"}
                                                title={"Regular"}
                                                subtitle={`${settings?.currency} ${item.price}`} />
                                        ) : (
                                            item?.sizes?.map(size => (
                                                <ListItem
                                                    key={size.id}
                                                    title={changeCase.sentenceCase(size.type)}
                                                    subtitle={`${settings?.currency} ${size.price}`}
                                                    after={
                                                        <Button
                                                            small
                                                            rounded
                                                            clear
                                                            onClick={() => onDeleteSize(size.type)}
                                                            className=" k-color-brand-red !px-2.5">
                                                            <HiOutlineXMark className=" h-5 w-5 text-red-500" />
                                                        </Button>
                                                    } />
                                            ))
                                        )}
                                    </>
                                )}
                                <div className="px-3.5  justify-center w-full  mt-2 flex">
                                    <div className="flex gap-2 lg:w-80 w-full">
                                        <Button
                                            onClick={onToggleSizes}
                                            small
                                            tonal
                                            className=" k-color-brand-green">
                                            Manage Sizes
                                        </Button>
                                    </div>
                                </div>
                            </List>
                        )}
                        {updateTab === "others" && (
                            <List margin="my-4">
                                <ListItem
                                    media={
                                        options?.isUpdatingBestSeller ? <Preloader size=" h-4 w-4" /> : (
                                            <Checkbox
                                                checked={item?.isBestSeller}
                                                onChange={onSetBestSeller} />
                                        )
                                    }
                                    title="Best Seller"
                                    footer="Add Item to Best Seller Category" />
                                <ListItem
                                    onClick={onDeleteItem}
                                    title="Delete Item"
                                    media={
                                        <RiDeleteBin5Fill className=" h-4 w-4 text-red-500" />
                                    }
                                    link />
                            </List>
                        )}
                        {updateTab === "prices" && (
                            <List margin="my-0" className=" mt-2">
                                {item?.sizes?.length <= 0 ? (
                                    <ListItem
                                        link
                                        key={"regular-size"}
                                        label
                                        title={`Regular - ${settings?.currency}${item?.price}`}
                                        onClick={() => onToggleEditPrice("regular")} />
                                ) : (
                                    <>
                                        {item?.sizes?.map(size => (
                                            <ListItem
                                                link
                                                key={size.id}
                                                label
                                                title={`${changeCase.sentenceCase(size.type)} - ${settings?.currency}${size?.price}`}
                                                onClick={() => onToggleEditPrice(size?.type)} />
                                        ))}
                                    </>
                                )}
                            </List>
                        )}
                    </Card>
                </motion.div>
            </div>
            {/* Add addon */}
            <Popup
                opened={options?.openAddons}
                onBackdropClick={onToggleAddons}>
                <Page className=" k-color-brand-primary">
                    <Navbar
                        title="Available Addons"
                        right={
                            <Link onClick={onToggleAddons} iconOnly navbar className=" k-color-brand-red">
                                <Icon>
                                    <HiMiniXMark className="h-6 w-6 text-brand-red " />
                                </Icon>
                            </Link>
                        } />
                    <div className="flex relative px-4 my-1 w-full">
                        <Searchbar
                            disableButton
                            onDisable={() => setOptions(old => ({ ...old, searchAddon: undefined }))}
                            onInput={onSearchAddon} />
                    </div>
                    <List margin="my-0">

                        {/* Loading */}
                        {addonsLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <ListItem
                                    key={i}
                                    title={<Skeleton width={"2rem"} />}
                                    link
                                    chevron={false}
                                    after={
                                        <Skeleton width={"2rem"} />
                                    }
                                    media={
                                        <Skeleton height={"2.5rem"} width={"2.5rem"} borderRadius={"25%"} />
                                    } />
                            ))
                        )}
                        {/* Selected Addon */}
                        <div className="px-3.5">
                            <span>Selected Addon</span>
                        </div>
                        {item?.addons?.map(addon => (
                            <ListItem
                                key={addon.id}
                                title={addon?.name}
                                chevron={false}
                                after={
                                    options?.isUpdatingAddon ? <Preloader size="h-4 w-4" /> : (
                                        <Checkbox
                                            onChange={() => onUpdateAddon(addon.id)}
                                            checked={!!item?.addons?.find(y => y.id === addon.id)} />
                                    )
                                }
                                media={
                                    <Image
                                        src={addon.image}
                                        width={300}
                                        height={300}
                                        alt={addon.name}
                                        className="h-10 w-10 aspect-square rounded-xl object-cover" />
                                } />
                        ))}
                        {/* Available addon */}
                        <div className="px-3.5">
                            <span>Available Addon</span>
                        </div>
                        {addons?.filter(x => !item?.addons?.find(y => y.id === x.id)).map(addon => (
                            <ListItem
                                key={addon.id}
                                title={addon?.name}
                                chevron={false}
                                after={
                                    options?.isUpdatingAddon ? <Preloader size="h-4 w-4" /> : (
                                        <Checkbox
                                            onChange={() => onUpdateAddon(addon.id)}
                                            checked={!!item?.addons?.find(y => y.id === addon.id)} />
                                    )
                                }
                                media={
                                    <Image
                                        src={addon.image}
                                        width={300}
                                        height={300}
                                        alt={addon.name}
                                        className="h-10 w-10 aspect-square rounded-xl object-cover" />
                                } />
                        ))}
                    </List>
                </Page>
            </Popup>
            {/* edit price */}
            <Dialog
                opened={!!options?.editPrice}
                className=" k-color-brand-primary"
                onBackdropClick={() => onToggleEditPrice(undefined)}
                title="Update Price"
                content={
                    <>
                        <input
                            type="number"
                            placeholder="Price"
                            inputMode="numeric"
                            onChange={e => setOptions(data => ({ ...data, newPrice: parseFloat(e.target.value ?? "0") }))}
                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" />
                    </>
                }
                buttons={
                    <>
                        <DialogButton
                            onClick={() => onToggleEditPrice(undefined)}
                            className=" k-color-brand-red">Cancel</DialogButton>
                        <DialogButton
                            disabled={!options?.editPrice || !options?.newPrice}
                            onClick={onUpdatePrice}
                            className=" k-color-brand-primary">Update</DialogButton>
                    </>
                } />
            {/* edit sizes */}
            <Dialog
                opened={options?.openSizes}
                onBackdropClick={onToggleSizes}
                title="Available Sizes"
                className=" k-color-brand-primary w-full lg:w-160 "
                content={
                    <div className="flex flex-col gap-2">
                        {settings && (
                            <Sizes
                                sizes={settings?.sizes.filter(x => !item?.sizes.find(y => y.type === x.toLowerCase()))}
                                onAdd={onAddSize} />
                        )}
                        <div className="flex mt-2 flex-wrap">
                            {options?.newSizes?.map((size, i) => (
                                <Chip
                                    key={i}
                                    className="m-0.5 uppercase"
                                    onClick={() => onRemoveSize(i)}
                                    deleteButton>
                                    {size.type} - ₱{size.price}
                                </Chip>
                            ))}
                        </div>
                        <Button
                            disabled={(options?.newSizes?.length ?? 0) <= 0}
                            onClick={onUpdateSize}
                            className=" mt-2">Update Size</Button>
                    </div>
                }
            />
        </>
    )
}
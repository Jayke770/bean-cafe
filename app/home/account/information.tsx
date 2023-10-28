"use client"
import { Actions, Card, List, ListItem, Button, ListInput } from 'konsta/react'
import moment from 'moment-timezone'
import type { Session } from 'next-auth'
import { useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input/input'
import toast from "react-hot-toast";
import { ApiResponse } from '@/types'
import { RiLoader5Fill } from 'react-icons/ri'
interface Props {
    show?: boolean,
    userInfo: Session['user'],
    onToggleAccountInfo: () => void
}
export default function AcountInformation(props: Props) {
    const { handleSubmit, register } = useForm()
    const [phoneNumber, setPhoneNumber] = useState<string>(props?.userInfo?.phone_number ?? "")
    const [editAccount, setEditAcccount] = useState<boolean>()
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const onEditAccount = () => setEditAcccount(e => !e)
    const onSubmitEditAccount = (data: any) => {
        if (!isProcessing) {
            setIsProcessing(true)
            toast.promise(((): Promise<any> => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const formData = { ...data, phone_number: phoneNumber }
                        const req = await fetch("/api/user/info", {
                            method: "post",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify(formData)
                        })
                        if (req.ok) {
                            const res: ApiResponse = await req.json()
                            if (res?.status) {
                                resolve(res)
                            } else {
                                throw new Error(res?.message)
                            }
                        } else {
                            throw new Error(`${req?.status} ${req?.statusText}`)
                        }
                    } catch (e: any) {
                        reject(e.message)
                    }
                })
            })(), {
                loading: 'Please wait...',
                success: (data: ApiResponse) => {
                    setIsProcessing(false)
                    return data?.message ?? ""
                },
                error: e => {
                    setIsProcessing(false)
                    return e
                }
            })
        }
    }
    return (
        <Actions
            opened={props.show}
            onBackdropClick={props.onToggleAccountInfo}>
            <Card
                margin='m-0'
                className=' rounded-b-none k-color-brand-primary '>
                <div className='flex justify-between px-3.5'>
                    <span className=' text-lg  text-brand-primary font-bold'>{editAccount ? "Edit Account" : "Account Information"}</span>
                    <Button
                        rounded
                        small
                        onClick={onEditAccount}
                        className='!w-auto k-color-brand-red !px-2 '
                        clear>
                        <AiFillEdit className='h-5 w-5' />
                    </Button>
                </div>

                {editAccount ? (
                    <form
                        className='flex flex-col gap-2 px-3.5 mt-1'
                        onSubmit={handleSubmit(onSubmitEditAccount)}>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="name" className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                id="name"
                                {...register("name")}
                                className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="Jhon Doe"
                                defaultValue={props?.userInfo?.name ?? ""}
                                aria-describedby="name" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register("email")}
                                className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="Email"
                                defaultValue={props?.userInfo?.email ?? ""}
                                aria-describedby="email" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="address" className="block text-sm font-medium">Address</label>
                            <input
                                type="text"
                                id="address"
                                {...register("address")}
                                className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="Address"
                                defaultValue={props?.userInfo?.address ?? ""}
                                aria-describedby="address" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="input-label-with-helper-text" className="block text-sm font-medium">Phone Number</label>
                            <PhoneInput
                                onChange={e => setPhoneNumber(e?.toString() ?? "")}
                                className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="Phone Number"
                                value={props?.userInfo?.phone_number ?? ""}
                                defaultCountry='PH' />
                        </div>
                        <Button
                            disabled={isProcessing}>
                            {isProcessing ? <RiLoader5Fill className=" text-brand-primary h-6 w-6 animate-spin " /> : <span>Update</span>}
                        </Button>
                    </form>
                ) : (
                    <List margin='my-0' className=' mt-1'>
                        <ListItem
                            header="Name"
                            subtitle={props?.userInfo?.name} />
                        <ListItem
                            header="Email"
                            subtitle={props?.userInfo?.email} />
                        <ListItem
                            header="Address"
                            subtitle={props?.userInfo?.address ?? "N/A"} />
                        <ListItem
                            header="Phone Number"
                            subtitle={props?.userInfo?.phone_number ?? "N/A"} />
                        <ListItem
                            header="Joined"
                            subtitle={moment(props.userInfo?.created).format('MMMM Do YYYY, h:mm:ss A')} />
                    </List>
                )}
            </Card>
        </Actions >
    )
}
import { Dialog, Button } from "konsta/react";
import { FcGoogle } from "react-icons/fc";
import { motion } from 'framer-motion'
import { type SignInResponse, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import toast from "react-hot-toast";
import { useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import PhoneInput from 'react-phone-number-input/input'
type CardType = "signup" | "login"
export default function AccountDialog() {
    const { handleSubmit, register } = useForm()
    const [phoneNumber, setPhoneNumber] = useState<string>()
    const [card, setCard] = useState<CardType>("signup")
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const onSubmit = async (data: any) => {
        if (!isProcessing) {
            setIsProcessing(true)
            toast.promise(((): Promise<any> => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const formData = { ...data, phone_number: phoneNumber }
                        const res = await signIn("credentials", {
                            redirect: false,
                            ...formData,
                            type: card,
                            callbackUrl: "/home"
                        })
                        res?.ok ? resolve(res) : reject(res?.error)
                    } catch (e: any) {
                        reject(e.message)
                    }
                })
            })(), {
                loading: 'Please wait...',
                success: (data: SignInResponse) => {
                    setIsProcessing(false)
                    return data?.error ?? "Please wait..."
                },
                error: e => {
                    setIsProcessing(false)
                    return e
                }
            })
        }
    }
    const onToggleCard = () => setCard(e => e === "login" ? "signup" : 'login')
    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
            className=" h-screen w-screen overflow-hidden fixed inset-0 z-50 ">
            <Dialog opened className=" k-color-brand-primary w-full md:w-160 ">
                <div className='flex flex-col w-full gap-2 px-2'>
                    <span className='font-bold text-xl text-brand-primary pb-3'>Get Started</span>
                    <Button
                        onClick={() => signIn("google", { callbackUrl: "/home/account" })}
                        clear
                        outline
                        className=' k-color-brand-white'>
                        <div className='h-full w-full flex items-center justify-center gap-2'>
                            <FcGoogle className=' h-5 w-5' />
                            <span className=' text-black dark:text-zinc-200 '>Sign in with Google</span>
                        </div>
                    </Button>
                    <hr className=' border-1 border-black dark:border-brand-primary my-3' />
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className=" flex flex-col gap-2">
                        {card === "signup" ? (
                            <>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className="block text-sm font-medium">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            {...register("name")}
                                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                            placeholder="Jhon Doe"
                                            aria-describedby="name" />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="input-label-with-helper-text" className="block text-sm font-medium">Email</label>
                                        <input
                                            type="email"
                                            {...register("email")}
                                            id="input-label-with-helper-text"
                                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                            placeholder="your@email.com"
                                            aria-describedby="hs-input-helper-text" />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="input-label-with-helper-text" className="block text-sm font-medium">Phone Number</label>
                                    <PhoneInput
                                        onChange={e => setPhoneNumber(e?.toString() ?? "")}
                                        className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                        placeholder="Phone Number"
                                        defaultCountry='PH' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="input-label-with-helper-text" className="block text-sm font-medium">Address</label>
                                    <input
                                        {...register("address")}
                                        id="address"
                                        className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                        placeholder="Address"
                                        aria-describedby="hs-input-helper-text" />
                                </div>
                                <div className=" grid grid-cols-2 gap-2">
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="pass" className="block text-sm font-medium">Password</label>
                                        <input
                                            type="password"
                                            id="pass"
                                            {...register("password")}
                                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                            placeholder="******"
                                            aria-describedby="pass" />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="cpass" className="block text-sm font-medium">Confirm Password</label>
                                        <input
                                            type="password"
                                            id="cpass"
                                            {...register("confirm_password")}
                                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                            placeholder="******"
                                            aria-describedby="cpass" />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 mt-3'>
                                    <Button
                                        disabled={isProcessing}>
                                        {isProcessing ? <RiLoader5Fill className=" text-brand-primary h-6 w-6 animate-spin " /> : <span>Register</span>}
                                    </Button>
                                    <div className='w-full flex items-center justify-center gap-1'>
                                        <span className=' font-medium'>Already have an Account?</span>
                                        <button
                                            onClick={onToggleCard}
                                            type='button'
                                            className=' font-bold underline outline-none cursor-pointer'>Login</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="input-label-with-helper-text" className="block text-sm font-medium">Email</label>
                                    <input
                                        {...register("email")}
                                        id="email"
                                        type="email"
                                        className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                        placeholder="Email"
                                        aria-describedby="hs-input-helper-text" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="pass" className="block text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        id="pass"
                                        {...register("password")}
                                        className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                        placeholder="******"
                                        aria-describedby="pass" />
                                </div>
                                <div className='flex flex-col gap-4 mt-3'>
                                    <Button
                                        disabled={isProcessing}>
                                        {isProcessing ? <RiLoader5Fill className=" text-brand-primary h-6 w-6 animate-spin " /> : <span>Login</span>}
                                    </Button>
                                    <div className='w-full flex items-center justify-center gap-1'>
                                        <span className=' font-medium'>Need an Account?</span>
                                        <button
                                            onClick={onToggleCard}
                                            type='button'
                                            className=' font-bold underline outline-none cursor-pointer'>Register</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </Dialog>
        </motion.div>
    )
}
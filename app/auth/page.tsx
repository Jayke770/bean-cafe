"use client"
import { Button, Card, Preloader } from "konsta/react"
import { SignInResponse, signIn, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
const variants: Variants = {
    initial: {
        opacity: 0,
        scale: 1.1
    },
    animate: {
        opacity: 1,
        scale: 1
    },
    exit: {
        opacity: 0,
        scale: 1.1
    }
}
export default function AdminAuth() {
    const { status } = useSession()
    const router = useRouter()
    const { handleSubmit, register } = useForm()
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const onSubmit = async (data: any) => {
        if (!isProcessing) {
            setIsProcessing(true)
            toast.promise(((): Promise<any> => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const res = await signIn("credentials", {
                            redirect: false,
                            ...data,
                            type: "login",
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
                    if (data?.ok) router.push(data?.url ?? "")
                    return data?.error ?? "Please wait..."
                },
                error: e => {
                    setIsProcessing(false)
                    return e
                }
            })
        }
    }
    return (
        <AnimatePresence mode="wait">
            {(status === "loading" || status === "authenticated") && (
                <Preloader className=" k-color-brand-primary" />
            )}
            {status === "unauthenticated" && (
                <motion.div
                    variants={variants}
                    initial={"initial"}
                    animate={"animate"}
                    exit={"exit"}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                    className="w-full md:w-[400px] m-4">
                    <Card
                        raised
                        margin="m-0"
                        className=" k-color-brand-primary w-full translucent z-10 ">
                        <div className="p-4">
                            <div className="flex flex-col mb-5 gap-1">
                                <h1 className="text-3xl font-bold text-brand-primary">Bean Cafe</h1>
                                <span className="">Hi, Welcome Back 👋</span>
                            </div>
                            <Button
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                clear
                                outline
                                className=' k-color-brand-white'>
                                <div className='h-full w-full flex items-center justify-center gap-2'>
                                    <FcGoogle className=' h-5 w-5' />
                                    <span className=' text-black dark:text-zinc-200 '>Sign in with Google</span>
                                </div>
                            </Button>
                            <hr className=' border-1 border-black dark:border-brand-primary my-5' />
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col gap-2.5">
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register("email")}
                                        name="email"
                                        className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                        placeholder="jhon@email.com"
                                        aria-describedby="email" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        {...register("password")}
                                        name="password"
                                        className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                        placeholder="********"
                                        aria-describedby="password" />
                                </div>
                                <Button className="mt-1 roun ">Sign in</Button>
                            </form>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
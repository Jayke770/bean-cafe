"use client"
import { Button, Card } from "konsta/react"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
export default function LoginCard() {
    return (
        <Card
            raised
            className=" k-color-brand-primary w-full md:w-[400px] translucent z-10 ">
            <div className="p-4">
                <div className="flex flex-col mb-5 gap-1">
                    <h1 className="text-3xl font-bold text-brand-primary">Bean Cafe</h1>
                    <span className="">Hi, Welcome Back 👋</span>
                </div>
                <Button
                    onClick={() => signIn("google", { callbackUrl: "/home" })}
                    clear
                    outline
                    className=' k-color-brand-white'>
                    <div className='h-full w-full flex items-center justify-center gap-2'>
                        <FcGoogle className=' h-5 w-5' />
                        <span className=' text-black dark:text-zinc-200 '>Sign in with Google</span>
                    </div>
                </Button>
                <hr className=' border-1 border-black dark:border-brand-primary my-5' />
                <div className="flex flex-col gap-2.5">
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            placeholder="jhon@email.com"
                            aria-describedby="email" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            placeholder="******"
                            aria-describedby="password" />
                    </div>
                    <Button className="mt-3">Sign in</Button>
                </div>
            </div>
        </Card>
    )
}
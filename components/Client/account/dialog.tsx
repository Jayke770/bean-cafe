import { Dialog, Button } from "konsta/react";
import { FcGoogle } from "react-icons/fc";
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
export default function AccountDialog() {
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
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="name" className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            placeholder="Jhon Doe"
                            aria-describedby="name" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="input-label-with-helper-text" className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            id="input-label-with-helper-text"
                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            placeholder="your@email.com"
                            aria-describedby="hs-input-helper-text" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="pass" className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            id="pass"
                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            placeholder="******"
                            aria-describedby="pass" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="cpass" className="block text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            id="cpass"
                            className="py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            placeholder="******"
                            aria-describedby="cpass" />
                    </div>
                    <div className='flex flex-col gap-4 mt-3'>
                        <Button>
                            Register
                        </Button>
                        <div className='w-full flex items-center justify-center gap-1'>
                            <span className=' font-medium'>Already have an Account?</span>
                            <button
                                type='button'
                                className=' font-bold underline outline-none cursor-pointer'>Login</button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </motion.div>
    )
}
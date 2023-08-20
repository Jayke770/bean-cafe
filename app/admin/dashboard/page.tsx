"use client"
import NavbarAdmin from "./navbar";
import Cards from "./cards";
import { motion, AnimatePresence, Variants } from 'framer-motion'
const variants: Variants = {
    initial: {
        opacity: 0,
        x: -50
    },
    animate: {
        opacity: 1,
        x: 1
    },
    exit: {
        opacity: 0,
        x: -50
    }
}
export default function DashBoard() {
    return (
        <AnimatePresence mode="wait">
            <nav className=" fixed hidden lg:block w-18 bg-md-light-surface-2 dark:bg-md-dark-surface-2 k-color-brand-primary h-full">

            </nav>
            <div className="lg:ml-18 transition-all">
                <NavbarAdmin />
                <Cards />
            </div>
        </AnimatePresence>
    )
}
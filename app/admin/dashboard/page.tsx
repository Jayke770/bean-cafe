"use client"
import NavbarAdmin from "./navbar";
import Cards from "./cards";
import Orders from "./orders";
import Charts from './charts'
export default function DashBoard() {
    return (
        <>
            <nav className=" fixed hidden lg:block w-18 bg-md-light-surface-2 dark:bg-md-dark-surface-2 k-color-brand-primary h-full">

            </nav>
            <div className="lg:ml-18 transition-all flex flex-col gap-4">
                <NavbarAdmin />
                <Cards />
                <Charts />
                <Orders />
            </div>
        </>
    )
}
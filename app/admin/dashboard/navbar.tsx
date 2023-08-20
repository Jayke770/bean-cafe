"use client"
import { Navbar, Link, Icon } from 'konsta/react'
import { HiOutlineBell } from 'react-icons/hi2'
export default function NavbarAdmin() {
    return (
        <Navbar
            titleClassName='!font-bold'
            title='Dashboard'
            className=' k-color-brand-primary'
            right={
                <>
                    <Link navbar iconOnly>
                        <Icon badge="">
                            <HiOutlineBell className='h-6 w-6' />
                        </Icon>
                    </Link>
                </>
            } />
    )
}
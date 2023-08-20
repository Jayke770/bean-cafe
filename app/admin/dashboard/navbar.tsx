"use client"
import { Navbar, Link, Icon } from 'konsta/react'
import { HiBars3BottomRight, HiOutlineBell } from 'react-icons/hi2'
export default function NavbarAdmin() {
    return (
        <Navbar
            titleClassName='!font-bold'
            title='Dashboard'
            className=' k-color-brand-primary'
            left={
                <Link navbar iconOnly className=' lg:hidden'>
                    <Icon>
                        <HiBars3BottomRight className='h-6 w-6' />
                    </Icon>
                </Link>
            }
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
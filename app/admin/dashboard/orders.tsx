"use client"
import { faker } from '@faker-js/faker'
import { Button, List, ListItem } from 'konsta/react'
import { BsThreeDots } from 'react-icons/bs'
import { FaCircleXmark, FaCircleCheck } from 'react-icons/fa6'
import { Popover } from 'konsta/react'
import { useCallback, useState } from 'react'
export default function Orders() {
  const [openAction, setOpenAction] = useState<{ open?: boolean, target?: string }>()
  const onToggleAction = useCallback((target: string) => setOpenAction(e => ({ ...e, open: !e?.open, target: target })), [setOpenAction])
  return (
    <>
      <div className="flex flex-col px-4">
        <div className="-m-1.5">
          <div className="p-1.5 w-full inline-block align-middle">
            <div className="border rounded-lg shadow dark:border-brand-primary/50 border-brand-secondary/50">
              <div className="py-3 px-4 flex justify-between items-center">
                <div className='text-brand-primary font-bold text-xl'>Order List</div>
                <div className="relative max-w-xs">
                  <label htmlFor="hs-table-search" className="sr-only">Search</label>
                  <input
                    type="text"
                    name="hs-table-search"
                    id="hs-table-search"
                    className="py-3 pl-10 pr-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    placeholder="Search for items" />
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                    <svg className="h-3.5 w-3.5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full divide-y table-auto  divide-brand-primary/20 dark:divide-brand-secondary">
                  <thead className=" k-color-brand-primary bg-md-light-surface-1 dark:bg-md-dark-surface-1">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">No.</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Address</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Orders</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total Payment</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{i + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 uppercase">{faker.string.nanoid(12)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{faker.person.fullName()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{faker.location.streetAddress()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{faker.word.words()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">₱ {faker.string.numeric({ length: { max: 5, min: 1 } })}</td>
                        <td className='flex h-full w-full items-center justify-end pr-6 pl-5 py-4 '>
                          <Button
                            onClick={() => onToggleAction(`.order-action-${i}`)}
                            clear
                            outline
                            small
                            className={`order-action-${i} !w-auto k-color-brand-primary !px-2`}>
                            <BsThreeDots className=' h-5 w-5' />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popover
        opened={openAction?.open}
        onBackdropClick={onToggleAction}
        target={openAction?.target}
        className=' k-color-brand-primary'>
        <List nested>
          <ListItem
            media={
              <FaCircleCheck className=' h-5 w-5 text-brand-green' />
            }
            title='Approve'
            link />
          <ListItem
            title='Disapprove'
            media={
              <FaCircleXmark className=' h-5 w-5 text-red-500 ' />
            }
            link />
        </List>
      </Popover>
    </>
  )
}
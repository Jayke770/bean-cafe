"use client"
import Users from "@/lib/Admin/users"
import moment from "moment-timezone"
export default function UsersPage() {
    const { users, usersLoading } = Users()
    return (
        <div className="p-4">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                    <div className="border rounded-lg shadow dark:border-brand-primary/50 border-brand-secondary/50">
                        <div className="py-3 px-4 flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between lg:items-center">
                            <div className='text-brand-primary font-bold text-xl'>{usersLoading ? "Please wait..." : "Users"}</div>
                            <div className='flex gap-2'>
                                <div className="relative w-full lg:max-w-xs">
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
                                <select
                                    className="py-3 px-4 w-full lg:w-auto dark:bg-transparent dark:focus:bg-black dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                                    <option>All</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                                <thead className=" k-color-brand-primary bg-md-light-surface-1 dark:bg-md-dark-surface-1">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                                    {users?.map(user => (
                                        <tr key={user._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{moment(user.created).fromNow()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
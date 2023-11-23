"use client"
import { useCallback, useState } from 'react'
import { Orders } from '@lib/Admin/orders'
import CountUp from 'react-countup'
import { Orders as Ord } from '@/types'
import OrderInfoDialog from '@/components/Admin/orders/info'
import emoji from 'react-easy-emoji'
import * as changeCase from 'change-case'
import OrderStatus from '@/components/orderStatus'
import moment from 'moment-timezone'
import { useLocalstorageState } from 'rooks'
import Settings from '@/lib/settings'
export default function OrdersData() {
  const { settings } = Settings()
  const [orderStatus, setOrderStatus] = useLocalstorageState<Ord['status'] | "all">("order-status", "pending")
  const { orders } = Orders(orderStatus)
  const [openAction, setOpenAction] = useState<{ open?: boolean, target?: string }>()
  const onToggleAction = useCallback((target: string) => setOpenAction(e => ({ ...e, open: !e?.open, target: target })), [setOpenAction])
  const [viewOrder, setViewOrder] = useState<{ orderData?: Ord | undefined, showInfo?: boolean }>()
  const onSetViewOrder = useCallback((data: Ord) => setViewOrder(e => ({ ...e, orderData: data, showInfo: true })), [])
  const onToggleOrderInfo = useCallback(() => setViewOrder(e => ({ ...e, showInfo: !e?.showInfo })), [])
  const onSetOrderStatus = (data: any) => setOrderStatus(e => data)
  return (
    <>
      <div className="flex flex-col px-4">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <div className="border rounded-lg shadow dark:border-brand-primary/50 border-brand-secondary/50">
              <div className="py-3 px-4 flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between lg:items-center">
                <div className='text-brand-primary font-bold text-xl'>Recent Orders</div>
                <div className='flex flex-col-reverse md:flex-row gap-2'>
                  <div className="relative w-full lg:max-w-xs">
                    <label htmlFor="hs-table-search" className="sr-only">Search</label>
                    <input
                      type="text"
                      name="hs-table-search"
                      id="hs-table-search"
                      className="py-3 pl-10 pr-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      placeholder="Search for orders" />
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                      <svg className="h-3.5 w-3.5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </div>
                  </div>
                  <select
                    onChange={e => onSetOrderStatus(e.target.value)}
                    className="py-3 px-4 w-full lg:w-auto dark:bg-transparent dark:focus:bg-black dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                    <option value={"all"}>All</option>
                    <option value={"pending"}>Pending</option>
                    <option value={"completed"}>Completed</option>
                    <option value={"cancelled"}>Cancelled</option>
                    <option value={"processing"}>Processing</option>
                    <option value={"denied"}>Denied</option>
                    <option value={"out for delivery"}>Out for Delivery</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                  <thead className=" k-color-brand-primary bg-md-light-surface-1 dark:bg-md-dark-surface-1">
                    <tr>

                      <th scope="col" className="px-6 py-3 w-5 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Paid</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Payment Method</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Total Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase whitespace-nowrap">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/20 dark:divide-brand-secondary">
                    {orders?.map(order => (
                      <tr
                        onClick={() => onSetViewOrder(order)}
                        className=' cursor-pointer '
                        key={order.orderId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {emoji(order?.isPaid ? "✅" : "❌")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{order.orderId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{order?.name ?? "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{changeCase.sentenceCase(order.payment_method ?? "")}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          <CountUp
                            decimals={2}
                            prefix={settings?.currency ?? ""}
                            end={parseFloat(order.total_payment) + parseFloat(order?.fee ?? "0")} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          <OrderStatus status={order.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{moment(order.created).fromNow()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OrderInfoDialog
        order={viewOrder?.orderData}
        onToggleOrderInfo={onToggleOrderInfo}
        show={viewOrder?.showInfo} />
    </>
  )
}
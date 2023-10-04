"use client"
import { Actions, Badge, Button, Card, List, ListGroup, ListItem, Popover, Radio } from "konsta/react";
import { OrderStatus, Orders } from '@/types'
import * as changeCase from 'change-case'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSort } from 'react-icons/fa'
import { useState } from "react";
import { ItemEmpty } from "@/components/empty";
import { BsArrowLeft } from 'react-icons/bs'
import OrderInfo from "@/lib/User/orderInfo";
import { Coffee } from "@components/loader"
import Image from 'next/image'
import OrderStatusBadge from "@/components/orderStatus";
interface Props {
    show?: boolean,
    orders?: Orders[],
    onToggleOrders: () => void,
    onSetOrderType: (data?: OrderStatus) => void,
    orderType?: OrderStatus
}
interface Options {
    openSort?: boolean,
    selected_order_id?: string
}
const ORDER_STATUSES = ["pending", "completed", "cancelled", "denied"]
export default function AccountOrders(props: Props) {
    const [options, setOptions] = useState<Options>()
    const { orderData, orderDataLoading } = OrderInfo(options?.selected_order_id)
    const onToggleSort = () => setOptions(e => ({ ...e, openSort: !e?.openSort }))
    const onSetOrderType = (data?: any) => {
        props.onSetOrderType(data)
        onToggleSort()
    }
    const onSetOrderId = (id?: string) => setOptions(e => ({ ...e, selected_order_id: id }))
    return (
        <>
            <Actions
                opened={props.show}
                onBackdropClick={props.onToggleOrders}>
                <Card
                    margin='m-0'
                    className=' rounded-b-none k-color-brand-primary max-h-[70vh] overflow-auto'>
                    <AnimatePresence mode="wait">
                        {options?.selected_order_id ? (
                            !orderDataLoading ? (
                                <motion.div
                                    key={"order-info"}
                                    initial={{ opacity: 0, y: -200 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -200 }}
                                    transition={{ type: "spring", duration: 0.3, delay: 0 }}
                                    className="w-full h-full">
                                    <div className=" w-full flex items-center justify-between ">
                                        <div className="flex items-cnter">
                                            <Button
                                                onClick={() => onSetOrderId()}
                                                small
                                                clear
                                                rounded
                                                className="!w-auto !px-2">
                                                <BsArrowLeft className=" w-6 h-6" />
                                            </Button>
                                            <span className=' text-lg px-3.5 text-brand-primary font-bold'>Order Info</span>
                                        </div>
                                        <div>
                                            {orderData?.status === "pending" && <Badge className=" bg-amber-500 dark:bg-amber-900 dark:text-amber-500" >{changeCase.sentenceCase(orderData?.status ?? "")}</Badge>}
                                            {orderData?.status === "completed" && <Badge className=" bg-teal-500 dark:bg-teal-900 dark:text-teal-500" >{changeCase.sentenceCase(orderData?.status ?? "")}</Badge>}
                                            {orderData?.status === "pending" || orderData?.status === "cancelled" && <Badge className=" k-color-brand-red " >{changeCase.sentenceCase(orderData?.status ?? "")}</Badge>}
                                        </div>
                                    </div>
                                    <List margin="my-0" className="mt-3">
                                        {orderData?.items.map(item => (
                                            <ListItem
                                                key={item.id}
                                                media={
                                                    <Image
                                                        src={`/api/files?type=item&id=${item.item_id}`}
                                                        width={300}
                                                        height={300}
                                                        alt={item.item_id}
                                                        className=' mx-3 rounded-lg w-10 object-cover aspect-square' />
                                                }
                                                title={item.item_name}
                                                footer={
                                                    <div className="flex flex-col">
                                                        {item.size && <span>Size: {changeCase.sentenceCase(item.size ?? "")}</span>}
                                                        <span>Quantity: {item.quantity}</span>
                                                        <span>Total: ₱ {item.price * item.quantity}</span>
                                                    </div>
                                                } />
                                        ))}
                                    </List>
                                    <div className="flex px-3.5 mt-3">
                                        <Button small className=" k-color-brand-red">Cancel Order</Button>
                                    </div>
                                </motion.div>
                            ) : <Coffee />
                        ) : (
                            <motion.div
                                key={"orders"}
                                initial={{ opacity: 0, y: -200 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -200 }}
                                transition={{ ease: "easeInOut", duration: 0.3, delay: 0 }}
                                className="w-full h-full">
                                <div className=" w-full  flex justify-between items-baseline">
                                    <span className=' text-lg px-3.5 text-brand-primary font-bold'>Orders</span>
                                    <Button
                                        onClick={onToggleSort}
                                        small
                                        clear
                                        tonal
                                        id="sort"
                                        className="!w-auto flex items-center gap-2">
                                        Sort
                                        <FaSort />
                                    </Button>
                                </div>
                                <List margin='my-0' className=' mt-2' inset>
                                    {(props.orders?.length ?? 0) <= 0 && <ItemEmpty />}
                                    {props?.orders?.map(order => (
                                        <ListItem
                                            key={order.orderId}
                                            link
                                            onClick={() => onSetOrderId(order.orderId)}
                                            title={
                                                <div className="flex flex-col">
                                                    {order.items.map(item => (
                                                        <div key={item.id}>
                                                            <span className="text-sm">{item.item_name} {item.size ? `- ${changeCase.sentenceCase(item.size ?? "")}` : ""}</span>
                                                            <span className="text-xs"> - {item.quantity}x</span>
                                                        </div>
                                                    ))}
                                                    <span className="font-bold text-sm">Total: {`₱${order.total_payment}`}</span>
                                                </div>
                                            }
                                            after={
                                                <OrderStatusBadge status={order.status} />
                                            } />
                                    ))}
                                </List>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </Actions>
            <Popover
                className=" k-color-brand-primary"
                opened={options?.openSort}
                target={"#sort"}
                onBackdropClick={onToggleSort}>
                <List nested>
                    <ListItem
                        key={"default"}
                        title={"Default"}
                        link
                        chevron={false}
                        onClick={() => onSetOrderType(undefined)}
                        media={<Radio readOnly checked={!props.orderType} className=" pointer-events-none" />} />
                    {ORDER_STATUSES?.map(status => (
                        <ListItem
                            key={status}
                            link
                            chevron={false}
                            onClick={() => onSetOrderType(status)}
                            media={<Radio readOnly checked={props.orderType === status} className=" pointer-events-none" />}
                            title={changeCase.sentenceCase(status)} />
                    ))}
                </List>
            </Popover>
        </>
    )
}
"use client"
import { Actions, Button, Card, List, ListItem, Segmented, SegmentedButton } from "konsta/react";
import { Orders } from '@/types'
import * as changeCase from 'change-case'
interface Props {
    show?: boolean,
    orders?: Orders[],
    onToggleOrders: () => void
}
export default function AccountOrders(props: Props) {
    return (
        <Actions
            opened={props.show}
            onBackdropClick={props.onToggleOrders}>
            <Card className=' k-color-brand-primary max-h-[70vh] overflow-auto '>
                <div className=" w-full  flex justify-between items-baseline">
                    <span className=' text-lg px-3.5 text-brand-primary font-bold'>Orders</span>
                    <Button
                        small
                        clear
                        className="!w-auto">Sort</Button>
                </div>
                <List margin='my-0' className=' mt-2' inset>
                    {props?.orders?.map(order => (
                        <ListItem
                            key={order.orderId}
                            link
                            title={
                                <div className="flex flex-col">
                                    {order.items.map(item => (
                                        <div key={item.id}>
                                            <span className="text-sm">{item.item_name} - {changeCase.sentenceCase(item.size ?? "")}</span>
                                            <span className="text-xs"> - {item.quantity}x</span>
                                        </div>
                                    ))}
                                </div>
                            }
                            after={`₱${order.total_payment}`} />
                    ))}
                </List>
            </Card>
        </Actions>
    )
}
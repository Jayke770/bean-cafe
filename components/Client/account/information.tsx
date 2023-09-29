"use client"
import { Actions, Card, List, ListItem } from 'konsta/react'
import moment from 'moment-timezone'
import type { Session } from 'next-auth'
interface Props {
    show?: boolean,
    userInfo: Session['user'],
    onToggleAccountInfo: () => void
}
export default function AcountInformation(props: Props) {
    return (
        <Actions
            opened={props.show}
            onBackdropClick={props.onToggleAccountInfo}>
            <Card
                margin='m-0'
                className=' rounded-b-none k-color-brand-primary '>
                <span className=' text-lg px-3.5 text-brand-primary font-bold'>Account Information</span>
                <List margin='my-0' className=' mt-2'>
                    <ListItem
                        header="Name"
                        subtitle={props?.userInfo?.name} />
                    <ListItem
                        header="Address"
                        subtitle={props?.userInfo?.email} />
                    <ListItem
                        header="Address"
                        subtitle={props?.userInfo?.address ?? "N/A"} />
                    <ListItem
                        header="Phone Number"
                        subtitle={props?.userInfo?.phone_number ?? "N/A"} />
                    <ListItem
                        header="Joined"
                        subtitle={moment(props.userInfo?.created).format('MMMM Do YYYY, h:mm:ss a')} />
                </List>
            </Card>
        </Actions>
    )
}
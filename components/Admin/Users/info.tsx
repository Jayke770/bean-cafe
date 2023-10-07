"use client"
import { Popover, Card } from "konsta/react"
interface Props {
    opened?: boolean,
    user_id?: string,
    onToggleUserInfo: () => void
}
export default function UserInfo(props: Props) {
    return (
        <Popover
            draggable
            opened={props?.opened}
            onBackdropClick={props.onToggleUserInfo}
            target={`#user-${props?.user_id}`}
            className=" k-color-brand-primary">
            <div className="p-4">
                fas
            </div>
        </Popover>
    )
}
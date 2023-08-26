"use client"
import { createContext, useCallback, useContext, useState } from 'react'
import { Notification } from 'konsta/react'
interface NoticationType {
    onNotify: ({
        icon,
        title,
        subtitle,
        titleRightText }: {
            icon?: React.ReactNode,
            title: string,
            subtitle?: string,
            titleRightText?: string
        }) => void
}
interface NotificationData {
    icon?: React.ReactNode,
    title?: string,
    subtitle?: string,
    titleRightText?: string,
    opened?: boolean
}
const NotificationCtx = createContext<any>(undefined)
export function NoticationProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<NotificationData>()
    const onNotify = useCallback((param: NotificationData) => {
        setData(e => ({
            title: param?.title ?? "",
            icon: param?.icon ?? "",
            opened: true,
            subtitle: param?.subtitle,
            titleRightText: param?.titleRightText
        }))
        setTimeout(() => {
            setData(e => ({ ...e, opened: !e?.opened }))
        }, 2000)
    }, [])
    return (
        <NotificationCtx.Provider value={{ onNotify: onNotify }}>
            {children}
            <Notification
                translucent
                className=' k-color-brand-primary'
                opened={data?.opened}
                title={data?.title}
                titleRightText={data?.titleRightText}
                subtitle={data?.subtitle}
                icon={data?.icon} />
        </NotificationCtx.Provider>
    )
}
export const useNotification = () => useContext<NoticationType>(NotificationCtx)
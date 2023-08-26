"use client"
import { Dialog } from 'konsta/react'
import { createContext, useState, useCallback, useContext } from 'react'
interface DialogType {
    onShowDialog: ({
        title,
        content,
        buttons,
        timer
    }: {
        title?: string,
        content?: React.ReactNode,
        buttons?: React.ReactNode,
        timer?: number
    }) => void,
    onCloseDialog: () => void
}
interface DialogData {
    title?: string,
    content?: React.ReactNode,
    buttons?: React.ReactNode
    opened?: boolean,
    timer?: number
}
const DialogCtx = createContext<any>(undefined)
export function DialogProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<DialogData>()
    const onShowDialog = useCallback((param: DialogData) => {
        setData(e => ({
            ...e,
            buttons: param?.buttons,
            content: param?.content,
            title: param?.title,
            opened: true
        }))
        if (param.timer) setTimeout(() => setData(e => ({ ...e, opened: false })), param.timer)
    }, [])
    const onCloseDialog = useCallback(() => setData(e => ({ ...e, opened: false })), [])
    return (
        <DialogCtx.Provider value={{ onShowDialog, onCloseDialog }}>
            {children}
            <Dialog
                className=' k-color-brand-primary'
                opened={data?.opened}
                title={data?.title}
                buttons={data?.buttons}
                content={data?.content} />
        </DialogCtx.Provider>
    )
}
export const useDailog = () => useContext<DialogType>(DialogCtx)
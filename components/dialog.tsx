"use client"
import { Dialog, DialogButton } from 'konsta/react'
import { createContext, useState, useCallback, useContext } from 'react'
import { BsFillCheckCircleFill, BsInfoCircleFill } from 'react-icons/bs'
import { RiLoader5Fill } from 'react-icons/ri'
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
export const DialogSuccess = ({ text }: { text?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center  gap-3">
            <BsFillCheckCircleFill className=" h-8 w-8 text-teal-500 " />
            <span className=" text-lg font-bold">{text}</span>
        </div>
    )
}
export const DialogLoading = ({ text }: { text?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center  gap-3">
            <span className=" text-lg font-bold">{text}</span>
            <RiLoader5Fill className=" h-8 w-8 animate-spin text-brand-primary " />
        </div>
    )
}
export const DialogInfo = ({ text }: { text?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center  gap-3">
            <BsInfoCircleFill className=" h-8 w-8  text-blue-500 " />
            <span className=" text-lg font-bold">{text}</span>
        </div>
    )
}
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
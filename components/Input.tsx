import type { HTMLAttributes, HTMLInputTypeAttribute, } from "react"
export function Input({ name, label, placeholder, type, className, inputMode }: {
    inputMode?: "search" | "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal"
    className?: string,
    type?: HTMLInputTypeAttribute,
    name: string,
    label: string,
    placeholder?: string
}) {
    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor={name} className="block text-sm font-medium">{label}</label>
            <input
                type={type ?? "text"}
                id={name}
                inputMode={inputMode}
                className={`${className ?? ""} py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`}
                placeholder={placeholder ?? ""}
                aria-describedby={name} />
        </div>
    )
}
export function TextArea({ name, label, placeholder, className }: { className?: string, name: string, label: string, placeholder?: string }) {
    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor={name} className="block text-sm font-medium">{label}</label>
            <textarea
                id={name}
                className={`${className ?? ""} py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`}
                placeholder={placeholder ?? ""}
                aria-describedby={name} />
        </div>
    )
}
export function Select({ name, label, className, children }: { children: React.ReactNode, className?: string, name: string, label: string }) {
    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor={name} className="block text-sm font-medium">{label}</label>
            <select
                id={name}
                className={`${className ?? ""} py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`}
                aria-describedby={name}>
                {children}
            </select>
        </div>
    )
}
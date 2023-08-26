import type { ChangeEventHandler, HTMLInputTypeAttribute, } from "react"
export function Input({ name, label, placeholder, type, className, inputMode, disabled, required, readonly, onChange }: {
    inputMode?: "search" | "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal"
    className?: string,
    type?: HTMLInputTypeAttribute,
    name: string,
    label?: string,
    placeholder?: string,
    required?: boolean,
    disabled?: boolean,
    readonly?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement>
}) {
    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor={name} className="block text-sm font-medium">{label ?? ""}</label>
            <input
                type={type ?? "text"}
                id={name}
                name={name}
                onChange={onChange}
                inputMode={inputMode}
                className={`${className ?? ""} py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`}
                placeholder={placeholder ?? ""}
                aria-describedby={name}
                disabled={disabled}
                required={required}
                readOnly={readonly} />
        </div>
    )
}
export function TextArea({ name, label, placeholder, className, disabled, readonly, required, onChange }: {
    required?: boolean,
    disabled?: boolean,
    readonly?: boolean
    className?: string,
    name: string,
    label: string,
    placeholder?: string,
    onChange?: ChangeEventHandler<HTMLInputElement>
}) {
    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor={name} className="block text-sm font-medium">{label}</label>
            <textarea
                //@ts-ignore
                onChange={onChange}
                id={name}
                name={name}
                className={`${className ?? ""} py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`}
                placeholder={placeholder ?? ""}
                aria-describedby={name}
                disabled={disabled}
                required={required}
                readOnly={readonly} />
        </div>
    )
}
export function Select({ name, label, className, children, disabled, required, onChange }: {
    children: React.ReactNode,
    className?: string,
    name: string,
    label: string,
    required?: boolean,
    disabled?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement>
}) {
    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor={name} className="block text-sm font-medium">{label}</label>
            <select
                //@ts-ignore
                onChange={onChange}
                id={name}
                name={name}
                className={`${className ?? ""} py-3 px-4 block w-full dark:bg-transparent dark:border-brand-primary/50 border-brand-secondary/50 border transition-all rounded-md outline-none text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`}
                aria-describedby={name}
                disabled={disabled}
                required={required}>
                {children}
            </select>
        </div>
    )
}
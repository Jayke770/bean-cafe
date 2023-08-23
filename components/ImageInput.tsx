import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { BsCloudUpload } from 'react-icons/bs'
import Image from 'next/image'
export default function ImageInput({ name, accept }: { name: string, accept: string }) {
    const [previewImage, setPreviewImage] = useState<string>()
    const onHandleImagePreview = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => setPreviewImage(e => reader.result as string)
        } else {
            setPreviewImage(e => undefined)
        }
    }, [])
    return (
        <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3, delay: 0.1 }}
            htmlFor={`dropzone-file-${name.trim()}`} className="cursor-pointer flex w-full flex-col items-center rounded-xl border-2 border-dashed border-brand-primary dark:bg-md-dark-surface-1 p-6 text-center">
            {previewImage ? (
                <Image
                    height={300}
                    width={300}
                    src={previewImage as any}
                    alt="preview"
                    className=" h-40 w-full object-contain" />
            ) : (
                <>
                    <BsCloudUpload className="h-10 w-10 text-brand-primary" />
                    <h2 className="mt-4 text-xl dark:text-zinc-300 tracking-wide">Click to upload</h2>
                    <p className="mt-2 dark:text-zinc-400  text-xs tracking-wide">SVG, PNG, JPG or GIF </p>
                </>
            )}
            <input
                onChange={onHandleImagePreview}
                id={`dropzone-file-${name.trim()}`}
                type="file"
                name={name}
                accept={accept}
                className=" hidden" />
        </motion.label>
    )
}
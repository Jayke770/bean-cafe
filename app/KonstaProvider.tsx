"use client"
import { App } from "konsta/react"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
export default function LayoutMain({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ProgressBar
                height="3px"
                color="#cc9c68"
                options={{ showSpinner: true }}
                shallowRouting
            />
            <App theme='material' safeAreas dark>
                {children}
            </App>
        </>
    )
}
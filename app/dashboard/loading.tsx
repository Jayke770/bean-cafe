"use client"
import Skeleton from "react-loading-skeleton"
export default function loading() {
    return (
        <div className="transition-all flex flex-col gap-4 mt-4">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="m-0 p-4 overflow-hidden  bg-md-light-surface-1 dark:bg-md-dark-surface-1 text-md-light-on-surface dark:text-md-dark-on-surface  k-color-brand-primary rounded-md  ">
                        <div className="flex justify-between w-full items-center">
                            <div className="flex flex-col">
                                <Skeleton width="2rem" />
                                <Skeleton width="3rem" />
                            </div>
                            <Skeleton width="2rem" height={"2rem"} borderRadius={"100%"} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
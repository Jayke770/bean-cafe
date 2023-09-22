import Skeleton from 'react-loading-skeleton'
export default function ItemLoader() {
    return (
        <>
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className='z-0 rounded-2xl bg-md-light-surface-1 dark:bg-md-dark-surface-1 k-color-brand-secondary'>
                    <div className='p-4'>
                        <Skeleton height={"11rem"} className='shadow-lg' borderRadius={"1rem"} />
                        <div className='flex flex-col mt-3'>
                            <Skeleton width={"3rem"} />
                            <div className='flex justify-between'>
                                <Skeleton width={"2rem"} />
                                <Skeleton width={"1.5rem"} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
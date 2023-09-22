import Skeleton from 'react-loading-skeleton';
import ItemLoader from '@/components/Client/items/loader';
export default function loading() {
    return (
        <main className=' w-full transition-all'>
            <nav className='flex justify-between items-center px-3 pt-4'>
                <div className='w-full'>
                    <Skeleton width={"7rem"} height={"1rem"} />
                    <Skeleton width={"2.5rem"} height={"1rem"} />
                </div>
                <div className='flex gap-2 justify-end w-full'>
                    <Skeleton width={"3rem"} height={"3rem"} className='!rounded-full' />
                    <Skeleton width={"3rem"} height={"3rem"} className='!rounded-full' />
                </div>
            </nav>
            <section className='w-full z-10 px-3 whitespace-nowrap snap-proximity gap-2 overflow-auto py-3'>
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className='inline-flex ml-2 first:ml-0'>
                        <Skeleton height={"2.5rem"} width={"5rem"} borderRadius={"9999px"} />
                    </div>
                ))}
            </section>
            <section className='grid px-4 gap-2.5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 mt-5'>
                <ItemLoader />
            </section>
        </main>
    )
}
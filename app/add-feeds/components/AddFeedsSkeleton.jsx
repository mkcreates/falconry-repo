// components
import Skeleton from '@/components/ui/Skeleton'

const AddFeedsSkeleton = () => {
    return (
        <>
            <Skeleton className='w-3/6 h-6 mb-7' />

            <Skeleton className='w-32 h-6 mb-3' />

            <div className='grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
                {Array(5).fill('x').map((x,i) => (
                    <Skeleton className='w-full h-16 rounded-xl' key={i} />
                ))}
            </div>
        </>
    )
}
 
export default AddFeedsSkeleton
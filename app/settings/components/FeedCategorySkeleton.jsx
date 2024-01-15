// components
import Skeleton from '@/components/ui/Skeleton'

const FeedCategorySkeleton = () => {
    return (
        <>
            <Skeleton className='h-6 w-1/2 mb-7' />
            
            <Skeleton className='h-6 w-24 mb-3' />
            
            <Skeleton className='h-12 w-full mb-7' />

            <Skeleton className='h-6 w-32 mb-3' />

            {Array(4).fill('#').map((d,i) => (
                <div className='flex items-center justify-between mb-3' key={i}>
                    <div className='grow mr-3'>
                        <Skeleton className='h-6 w-full xs:w-4/5' />
                    </div>

                    <div className='flex'>
                        <Skeleton className='h-8 w-8 rounded-[999px!important] mr-2' />
                        <Skeleton className='h-8 w-8 rounded-[999px!important] mr-2' />
                        <Skeleton className='h-8 w-8 rounded-[999px!important]' />
                    </div>
                </div>
            ))}
        </>
    )
}
 
export default FeedCategorySkeleton
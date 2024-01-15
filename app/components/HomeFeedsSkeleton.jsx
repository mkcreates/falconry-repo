// components
import Skeleton from '@/components/ui/Skeleton'

const HomeFeedsSkeleton = () => {
    return (
        <>
            {Array(8).fill('x').map((x,i) => (
                <div className='hidden first:block [&:nth-child(2)]:block [&:nth-child(3)]:block [&:nth-child(4)]:block md:block [&:nth-child(5)]:block mb-5' key={i}>
                    <div className='relative w-full mb-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-full relative" viewBox="0 0 16 10.5"></svg>
                        <Skeleton className='absolute top-0 w-full h-full' />
                    </div>
                    
                    <Skeleton className='w-full h-6 mb-2' />
                    <Skeleton className='w-2/3 h-6' />
                </div>
            ))}
        </>
    )
}
 
export default HomeFeedsSkeleton
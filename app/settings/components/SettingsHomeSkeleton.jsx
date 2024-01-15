// components
import Skeleton from '@/components/ui/Skeleton'

const SettingsHomeSkeleton = () => {
    return (
        <>
            <Skeleton className='h-6 w-1/3 mb-7' />

            <div className='flex items-center mb-7'>
                <Skeleton className='h-20 w-20 rounded-[999px!important] mr-2' />

                <div>
                    <Skeleton className='h-6 w-24 rounded-[999px!important] mb-2' />
                    <Skeleton className='h-6 w-28 rounded-[999px!important]' />
                </div>
            </div>

            <Skeleton className='h-8 w-full mb-3' />
            <Skeleton className='h-24 w-1/2 mb-3' />
            <Skeleton className='h-6 w-28 mb-3' />
            <Skeleton className='h-8 w-20 mb-7' />

            <Skeleton className='h-6 w-20 mb-7' />

            <Skeleton className='h-8 w-20' />
        </>
    )
}
 
export default SettingsHomeSkeleton
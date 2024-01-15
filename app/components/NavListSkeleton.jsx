import Skeleton from "./ui/Skeleton"

const NavListSkeleton = () => {
    return (
        <div className="mt-4">
            <div className="flex justify-between mb-5">
                <Skeleton className='h-5 w-24 dark:bg-darkBg1' />
                <Skeleton className='h-5 w-6 dark:bg-darkBg1' />
            </div>

            <Skeleton className='h-5 w-2/3 mb-2 dark:bg-darkBg1' />
            <Skeleton className='h-5 w-3/5 mb-2 dark:bg-darkBg1' />
            <Skeleton className='h-5 w-4/5 dark:bg-darkBg1' />
        </div>
    )
}
 
export default NavListSkeleton
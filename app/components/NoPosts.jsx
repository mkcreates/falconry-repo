import { RocketLaunch } from "@phosphor-icons/react/dist/ssr"

const NoPosts = () => {
    return (
        <div className='flex flex-col items-center w-fit mx-auto p-4 text-center mt-8'>
          <RocketLaunch size={80} className='text-black/30 dark:text-white/40 mb-4' />
          <p className='text-black/80 dark:text-white/80 text-sm'>Taking a journey into the unknown of no posts...</p>
        </div>
    )
}
 
export default NoPosts
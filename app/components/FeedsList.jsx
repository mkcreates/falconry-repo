// modules
import Image from 'next/image'
import Link from 'next/link'
import { useGlobalContext } from '@/lib/globalContext'
import Button from './ui/Button'

const NavLists = ({ closer }) => {
    const { feeds } = useGlobalContext()

    return (
        <>
            <div className='flex items-center justify-between mb-2'>
                <p className='text-xs text-black/80 dark:text-white/80 mr-3'>
                    <b className='mr-1'>{feeds.length}</b> Feeds
                </p>
                
                <Link href='/add-feeds?fromfeeds=1' onClick={() => closer(false)}>
                    <Button type='button2' size='small' className='font-semibold text-[0.813rem] px-4'>Find more feeds</Button>
                </Link>
            </div>


            <div className='navList w-full'>
                {feeds.map((feed, i) => (
                    <Link
                        href={'/?feed='+feed._id}
                        prefetch={false}
                        key={i}
                        className='flex items-center'
                        onClick={() => closer(false)}
                    >
                        <div className='imgconl'>
                            {feed.icon ?
                                <Image src={feed.icon} alt={feed.name} width={23} height={23} />
                            :
                                <div className='no-img'>
                                    {feed.name.slice(0,1)}
                                </div>
                            }
                        </div>

                        <div className='fname'>{feed.name.slice(0,25)}</div>
                    </Link>
                ))}
            </div>
        </>
    )
}
 
export default NavLists
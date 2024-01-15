"use client"

// modules
import Image from 'next/image'
import Link from 'next/link'
import { useGlobalContext } from '@/lib/globalContext'
import { useSearchParams } from 'next/navigation'

// components
import Badge from './ui/Badge'
import NavListSkeleton from './NavListSkeleton'

// icons
import {
    Plus, Square, Triangle, Circle, CaretDown
} from '@phosphor-icons/react'

const NavLinks = ({ setCategoryModal, setFeedModal }) => {
    const { categories, feeds } = useGlobalContext()
    const searchPrm = useSearchParams()

    return (
        <>
            {categories ?
                <div className='links'>
                    <div className='seperator'>
                        <span onClick={() => setCategoryModal(true)}>
                            CATEGORIES <CaretDown size={12} />
                        </span>
                        <Link href='/settings/categories' className='forsep' prefetch={true}>
                            <Badge type='badge1'>
                                <Plus size={16} />
                            </Badge>
                        </Link>
                    </div>

                    {categories && categories.slice(0, 3).map((cat, index) => (
                        <Link
                            href={'/?cat='+cat._id}
                            prefetch={false}
                            key={cat._id}
                            className={(searchPrm.has('cat') && searchPrm.get('cat') === cat._id) ? 'active' : ''}
                        >
                            {index === 0 && <Triangle size={16} />}
                            {index === 1 && <Square size={16} />}
                            {index === 2 && <Circle size={16} />}
                            {cat.name}
                        </Link>
                    ))}
                </div>
            :
                <NavListSkeleton />
            }



            {feeds ?
                <div className='links mb-10 border-none'>
                    <div className='seperator'>
                        <span onClick={() => setFeedModal(true)}>
                            FEEDS <CaretDown size={12} />
                        </span>
                        <Link href='/settings/feeds' className='forsep' prefetch={true}>
                            <Badge type='badge1'>
                                <Plus size={16} />
                            </Badge>
                        </Link>
                    </div>

                    {feeds && feeds.slice(0, 3).map((feed, index) => (
                        <Link
                            href={'/?feed='+feed._id}
                            prefetch={false}
                            key={feed._id}
                            className={(searchPrm.has('feed') && searchPrm.get('feed') === feed._id) ? 'active' : ''}
                        >
                            <div className='imgcon'>
                                {feed.icon ?
                                    <Image src={feed.icon} alt={feed.name} fill />
                                :
                                    <div className='no-img'>
                                        {feed.name.slice(0,1)}
                                    </div>
                                }
                            </div>
                            {feed.name.slice(0,25)}
                        </Link>
                    ))}
                </div>
            :
                <div className='mt-10'>
                    <NavListSkeleton />
                </div>
            }
        </>
    )
}
 
export default NavLinks
"use client"

// modules
import feedScroll from '@/lib/feedIsScrolled'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const MainContentLayout = ({ children, morePosts }) => {
    const top = useRef(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        top.current.scrollTop = 0
    }, [searchParams])
    return (
        <div
            className='grow w-full overflow-y-auto'
            onScroll={(event) => {
                feedScroll(event)
                morePosts(event)
            }}
            ref={top}
            id='postCon'
        >
            <div className='main-padding h-full'>
                {children}
            </div>
        </div>
    )
}
 
export default MainContentLayout
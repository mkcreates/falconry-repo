"use client"

import feedScroll from '@/lib/feedIsScrolled'

const ProfileLayout = ({ children }) => {
    return (
        <div
            className='grow h-full relative overflow-y-auto'
            onScroll={(event) => feedScroll(event)}
        >
            {children}
        </div>
    )
}
 
export default ProfileLayout
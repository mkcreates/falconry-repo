"use client"

import Tippy from "@tippyjs/react"

const FeedImgCon = ({ children, name, keyValue }) => {
    return (
        <Tippy content={name}>
            <div key={keyValue} className='relative w-[25px] h-[25px] shrink-0 dark:text-white/80 bg-lightBg3 dark:bg-darkBg2 border dark:border-white/5 rounded-full mr-2 overflow-hidden'>
                {children}
            </div>
        </Tippy>
    )
}
 
export default FeedImgCon
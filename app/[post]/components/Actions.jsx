"use client"

import { useGlobalContext } from '@/lib/globalContext'
import { useState, useEffect } from 'react'
import Tippy from '@tippyjs/react'
import Badge from '@/components/ui/Badge'
import { BookmarkSimple, Share, SpinnerGap } from '@phosphor-icons/react'

const Actions = ({ post }) => {
    const { user } = useGlobalContext()
    const [bkLoading, setBkLoading] = useState(false)
    const [bk, setBk] = useState(false)

    const share = async () => {
        if (navigator.share) {
            await navigator.share({
                title: document.title,
                url: window.location.href
            })
        } else {
            alert('Web Share API not supported on this browser.')
        }
    }

    const updateBookmark = async () => {
        setBkLoading(true)

        const req = await fetch('/api/post/updatePost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: post.id,
                bookmarked: !post.bookmarked
            })
        })
     
        const response = await req.json()
    
        if (response.success) {
            setBkLoading(false)
            setBk((prev) => !prev)
        }
    }
    
    useEffect(() => {
        setBk(post.bookmarked)
    }, [])


    return (
        <div className='buttons'>
            {user?.signedIn && user?.data._id === post.user &&
                <Tippy content='Bookmark'>
                    <button>
                        <Badge
                            onClick={updateBookmark}
                            className={'bk mb-4 mr-2 sm:mr-0 '+(bk && 'active')}
                            type='bordered'
                        >
                            {!bkLoading ? <BookmarkSimple size={16} /> : <SpinnerGap size={16} className='animate-spin' />}
                        </Badge>
                    </button>
                </Tippy>
            }

            <Tippy content='Share'>
                <button>
                    <Badge type='bordered' onClick={share}>
                        <Share size={16} />
                    </Badge>
                </button>
            </Tippy>
        </div>
    )
}
 
export default Actions
"use client"

// modules
import { useGlobalContext } from '@/lib/globalContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// components
import Button from '@/components/ui/Button'
import { SpinnerGap } from '@phosphor-icons/react'

const FollowFeeds = (props) => {
    const { user, feeds, setFeeds } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const followFeeds = async () => {
        if (user && user.signedIn) {// user must be signed in to follow feeds
            if (loading) return

            setLoading(true)

            for (const feed of props.feeds) {
                const feedReq = await fetch('/api/feed/publicFeeds', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        feed: {
                            ...feed,
                            user: user.data._id,
                            lastBuildDate: new Date().toISOString()
                        },
                        catId: null
                    })
                })
        
                const feedResponse = await feedReq.json()

                setLoading(false)
        
                if (!feedResponse.error) {
                    setFeeds([feedResponse.saveFeed, ...feeds])

                    // fetch recent posts from newly added RSS feed
                    await fetch('/api/feed/fetchFeed', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            feedLink: feedResponse.saveFeed.link,
                            feedId: feedResponse.saveFeed._id
                        })
                    })
                }
            }
        }
        else {
            router.push('/login')
        }
    }


    return ( 
        <Button
            onClick={followFeeds}
            type='button2'
            size='small'
            className='shrink-0'
            disabled={loading}
        >
            Follow All 
            {loading && <SpinnerGap size={15} className="loader" />}
        </Button>
    )
}
 
export default FollowFeeds
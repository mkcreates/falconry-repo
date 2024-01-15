"use client"

// modules
import Image from "next/image"
import { useState } from "react"
import { useGlobalContext } from "@/lib/globalContext"
import Tippy from "@tippyjs/react"

import { SpinnerGap, WarningCircle } from "@phosphor-icons/react"
import { useRouter, useSearchParams } from "next/navigation"

const FeedCards = ({ feed, keyValue, catName, exist, setFeedError }) => {
    const { user, categories, setCategories, setFeeds, feeds } = useGlobalContext()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const searchParam = useSearchParams()
    const router = useRouter()


    const addCatAndFeed = async () => {
        // add category and feed

        if (loading) return

        // if not in the right add feed path
        if (user.data.dataCollection && !searchParam.has('fromfeeds')) {
            router.push('/add-feeds/?fromfeeds=1')
            return
        }

        // if user does not follow feed alredy, proceed
        if (exist) return

        setLoading(true)
        setError(null)
        setFeedError(false)

        let catResponse
        if (!user.data.dataCollection) {
            const catReq = await fetch('/api/category', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ category: catName })
            })

            catResponse = await catReq.json()

            if (!catResponse.error) setCategories([catResponse.category, ...categories])
        }

        const feedReq = await fetch('/api/feed/publicFeeds', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                feed: feed,
                catId: searchParam.has('fromfeeds') ? null : catResponse.category._id
            })
        })

        const feedResponse = await feedReq.json()

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
        } else {
            // encountered error
            setError(feedResponse.error)
        }

        setLoading(false)
    }

    return (
        <div
            onClick={addCatAndFeed}
            className={"items "+(exist && 'exists bg-stone-100 dark:bg-darkBg2')}
            key={keyValue}
        >
            {loading && <SpinnerGap size={17} className="load" />}

            {error &&
                <Tippy content={error}>
                    <WarningCircle size={17} className="error" />
                </Tippy>
            }

            <div className="img">
                {feed.icon ?
                    <Image src={feed.icon} fill alt={feed.name} />
                :
                    <div className="no-img">{feed.name.slice(0,1)}</div>
                }
            </div>

            <div className="grow">
                <p className="name">{feed.name}</p>
                <p className="link">{feed.link}</p>
            </div>
        </div>
    )
}
 
export default FeedCards
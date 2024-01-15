"use client"

// modules
import feedScroll from "@/lib/feedIsScrolled"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Authenticated from "@/lib/authenticated"
import { useGlobalContext } from "@/lib/globalContext"

// components
import FeedCards from "./components/FeedCards"
import AddFeedsSkeleton from "./components/AddFeedsSkeleton"
import Button from "@/components/ui/Button"
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr"


const SignupAddFeeds = () => {
    // middleware : must be signed in to be here
    Authenticated(true, '/login') // else redirect to home(/login)

    const { user, setUser, setRefreshUser, feeds } = useGlobalContext()
    const [data, setData] = useState(null)
    const [feedError, setFeedError] = useState(false)
    const [loading, setLoading] = useState(false)
    const searchParam = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        (async () => {
            const req = await fetch('/api/feed/publicFeeds', {
                method: 'GET',
                next: { revalidate: 60 * 60 },
            })

            const response = await req.json()

            if (!response.error) {
                setData(response)
            }
        })()
    }, [])


    const done = async () => {
        // if dataCollection true already, take em home
        if (user?.data.dataCollection) {
            router.push('/')
            return
        }

        // get reference of seleceted feeds
        const selectedFeeds = document.querySelectorAll('.exists')

        if (selectedFeeds.length >= 10) {
            // user must follow atleast 10 feeds

            setLoading(true)
            setFeedError(false)

            // update user dataCollection to true
            const req = await fetch('/api/updateUser', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    data: {
                        ...user.data,
                        dataCollection: true
                    },
                    prevUsername: user.data.username
                })
            })

            const response = await req.json()

            if (!response.errors) {
                setUser({
                    data: {...response},
                    signedIn: user.signedIn
                })
                setRefreshUser((prev) => !prev)

                // go to home
                router.push('/')
            } else {
                setFeedError('There was a problem moving on')
                setLoading(false)
            }
        } else {
            setFeedError('Select 10 feeds to proceed')
            setLoading(false)
        }
    }


    return (
        <>
            <div
                className="grow overflow-y-auto px-3 xs:px-5 dark:px-0 pb-6"
                onScroll={(event) => feedScroll(event)}
            >

                <div className="afeedCon min-h-full">
                    {user?.signedIn && data ?
                        <>
                        <div className="head">
                            {user && !user?.data.dataCollection && !searchParam.has('fromfeeds') ?
                                'Select atleast 10 feeds to proceed. You can add more later.'
                                :
                                'Click to add feeds.'
                            }
                        </div>

                            {data && data.map((category, i) => (
                                <div className="mb-7 last:mb-0" key={i}>
                                    <h1 className="cat">{category.name}</h1>

                                    <div className="itemsCon">
                                        {category.feeds.map((feed, fi) => (
                                            
                                                <FeedCards
                                                    key={fi}
                                                    keyValue={fi}
                                                    catName={category.name}
                                                    feed={feed}
                                                    exist={feeds.find(obj => obj.link === feed.link)}
                                                    setFeedError={setFeedError}
                                                />
                                            
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                        :
                        <AddFeedsSkeleton />
                    }
                </div>
                
                {feedError &&
                    <div className="feederror">{feedError}</div>
                }
            </div>


            {data &&
                <div className="flex justify-center py-2">
                    {searchParam.has('fromfeeds') ? 
                        <Link href='/settings/feeds'>
                            <Button type='button2'>Go back to feeds</Button>
                        </Link>
                    :
                        <Button type='button2' onClick={done} disabled={loading}>
                            Done, proceed! {loading && <SpinnerGap size={15} className="animate-spin ml-2" />}
                        </Button>
                    }
                </div>
            }
        </>
    )
}
 
export default SignupAddFeeds
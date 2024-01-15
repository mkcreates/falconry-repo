"use client"

// modules
import { useEffect, useState } from 'react'
import { useGlobalContext } from '@/lib/globalContext'
import { useSearchParams } from 'next/navigation'

// components
import MainContentLayout from '@/layouts/MainContentLayout'
import Button from '@/components/ui/Button'
import NoPosts from '@/components/NoPosts'
import HomeFeedsTop from './components/HomeFeedsTop'
import { Spinner } from '@phosphor-icons/react'
import FeedCardsContainer from './components/FeedCardsContainer'
import NotificationPing from './components/NotificationPing'

//export const dynamic = 'force-dynamic'

export default function Contents() {
  const { user, refreshUser, refreshPosts, setRefreshPosts, notification, setNotification, setNotifyModal } = useGlobalContext()
  const [posts, setPosts] = useState(null)
  const searchParams = useSearchParams()
  const [sort, setSort] = useState('desc')
  const [skip, setSkip] = useState(0)
  const [timeFilter, setTimeFilter] = useState(null)
  const [scrollLoading, setScrollLoading] = useState(false)
  const [loadMoreBtn, setLoadMoreBtn] = useState(true)

  useEffect(() => {
    (async () => {
      if (skip === 0) setPosts(null)
      
      const req = await fetch('/api/post/fetchPosts', {
        method: 'POST',
        next: { revalidate: 0 },
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedId: searchParams.get('feed'),
          categoryId: searchParams.get('cat'),
          bookmarked: searchParams.has('bookmark'),
          ishidden: searchParams.has('hidden'),
          search: searchParams.get('search'),
          hideRead: user?.signedIn ? user?.data.preference.hideAfterRead : false,
          timeFilter: timeFilter,
          sort: sort
        })
      })

      const response = await req.json()

      setPosts(response)
    })()

    return () => setSkip(0)
  }, [searchParams, sort, timeFilter, refreshUser, refreshPosts])


  useEffect(() => {
    (async() => {
      /* i dont like repeatition, not conventional.
         But if it gets it done, we good. I cant kill myself */
      const req = await fetch('/api/post/fetchPosts', {
        method: 'POST',
        next: { revalidate: 0 },
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedId: searchParams.get('feed'),
          categoryId: searchParams.get('cat'),
          bookmarked: searchParams.has('bookmark'),
          ishidden: searchParams.has('hidden'),
          search: searchParams.get('search'),
          hideRead: user?.signedIn ? user?.data.preference.hideAfterRead : false,
          timeFilter: timeFilter,
          sort: sort,
          skip: skip
        })
      })

      const response = await req.json()

      if (response && response.length && skip !== 0) {
        setPosts((prev) => [...prev, ...response])
      }

      setScrollLoading(false)
    })()
  }, [skip])


  const morePosts = async (e) => {
    const postCon = document.getElementById('postCon') // reference to scroll container
    let isScrolled = false

    if (postCon.scrollHeight > postCon.clientHeight) {
      // if container is scrollable, hide load more button
      // and use infinite scroll instead
      setLoadMoreBtn(false)
    }

    if (postCon.scrollTop + postCon.clientHeight === postCon.scrollHeight) {
      if (scrollLoading)  return
      setScrollLoading(true)


      if (!isScrolled) { // check if not scrolled ensure code run once
        setSkip((prev) => prev + 12)

        isScrolled = true // indicate it is scrolled
        return false // final fallback to ensure code runs once
      }
    } else { // when scroll up, indicate scrolled is false
      isScrolled = false
    }
  }


  useEffect(() => {
    /* do thesame thing as top here 
      if container is scrollable, hide load more button
    */
    const postCon = document.getElementById('postCon') // get container
    if (postCon.scrollHeight > postCon.clientHeight) {
      setLoadMoreBtn(false)
    } else {
      setLoadMoreBtn(true)
    }
  }, [posts])


  useEffect(() => {
    const getNewPosts = async () => {
      const req = await fetch('/api/post/getNewPosts', { method: 'GET'  })
      
      return req.json()
    }

    setTimeout(async () => {
      const res = await getNewPosts()
      
      if (res) {
        setNotification(true)

        if (!('notifyModalOff' in localStorage) || localStorage.notifyModalOff === '0') setNotifyModal(true)
      }
    }, 1000 * 8)
  }, [])


  return (
    <>
      <MainContentLayout morePosts={morePosts}>

        <div className='flex items-center justify-between text-black/60 dark:text-white/50 text-xs'>
          <Button
            onClick={()=> setRefreshPosts(prev => !prev)}
            type='button3'
            size='small'
            className='shrink-0 relative'
          >
            Refresh {notification && <NotificationPing />}
          </Button>

          <div className='grow h-px bg-black/[.07] dark:bg-white/5 mx-3 sm:mx-4'></div>

          <HomeFeedsTop
            sort={sort}
            setSort={setSort}
            setTimeFilter={setTimeFilter}
          />
        </div>


        <FeedCardsContainer posts={posts} />
        

        {scrollLoading &&
          <div className='loadMore'>
            <Spinner size={20} /> Loading posts...
          </div>
        }

        {(posts && posts.length > 0) && loadMoreBtn &&
          <div className='absolute bottom-0 left-0 w-full flex items-center justify-center text-center mb-6'>
            <Button type='button2' size='small' onClick={morePosts}>Show More</Button>
          </div>
        }

        {(posts && posts.length === 0) && (
          <NoPosts />
        )}

      </MainContentLayout>

      {user && !user?.signedIn &&
        <div className='text-xs font-semibold text-black/80 dark:text-white/80 py-1 px-3'>
          Login to curate your own feeds and settings..
        </div>
      }
    </>
  )
}

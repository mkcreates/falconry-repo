"use client"

// modules
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import moment from 'moment'
import { usePathname } from 'next/navigation'

// components
import CardOptions from './CardOptions'

const FeedCardItem = ({ keyValue, postData, user }) => {
  const [post, setPost] = useState(postData)
  const [imgLoading, setImgLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const path = usePathname()

  const setColor = (val) => {
    // method to set different bg color on post with no image
    const colors = ['bg-green-400/50', 'bg-red-400/50', 'bg-sky-400/50', 'bg-purple-400/50', 'bg-teal-400/50', 'bg-orange-400/50', 'bg-neutral-400/50', 'bg-yellow-400/50', 'bg-lime-400/50', 'bg-pink-400/50']
    // get the last number. e.g 13 => 3
    let reverse = val.split('').reverse().join('')
    return colors[reverse[0]]
  }

  const updateRead = async () => {
    if (!postData.read && user.signedIn && user.data._id === postData.user) {
      // if post not read and its the user of the post viewing, set to read
      const req = await fetch('/api/post/updateRead', {
          method: 'POST',
          next: {revalidate: 0},
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: post.slug
          })
      })
    }
  }

  return (
        <Link
          href={'/'+post.slug}
          key={keyValue}
          prefetch={false}
          className='feedcon'
          target={path.includes('/u/') ? null : '_blank'}
          onClick={updateRead}
        >
          <div className='feed-items'>
            <div className='cover'>
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-full relative" viewBox="0 0 16 10.5"></svg>
              
              {post.media &&
                <Image
                  src={post.media}
                  alt={post.title}
                  className={'img '+(imgError && 'hidden')}
                  fill quality={35}
                  onLoad={()=> setImgLoading(false)}
                  onError={()=> {setImgError(true); setImgLoading(false) }}
                />
              }


              {(post.media === null || imgLoading) &&
                <div className={'no-img '+setColor(keyValue.toString())}>
                  <Image src='/img/defaultBg.jpg' fill alt='falconry_post' quality={90} className='def' />
                  {post.feed?.icon ?
                    <Image src={post.feed?.icon} alt={post.feed?.name} width={30} height={30} className='icon' />
                  :
                    <div className='no-icon'>
                      {post.feed?.name.slice(0,1)}
                    </div>
                  }
                </div>
              }
            </div>
            

            <div className='info'>
              <div className='top'>
                <span className='mr-3'>
                  {moment(post.pubDate).format('MMM D, YYYY, H a')}
                </span>
                
                {user?.signedIn && user?.data?._id === post.user &&
                  <CardOptions post={post} setPost={setPost} />
                }
              </div>

              <div className='feeder'>
                {post.feed?.icon !== null &&
                  <Image src={post.feed?.icon} alt={post.feed?.name} width={16} height={16} />
                }
                {post.feed?.name.slice(0, 28)}
              </div>

              <div className='title'>
                {post.title.length > 80 ? post.title.slice(0, 80)+'...' : post.title}
              </div>
            </div>
          </div>
        </Link>
  )
}
 
export default FeedCardItem
// modules
import Image from 'next/image'
import moment from 'moment'
import { sanitize } from 'isomorphic-dompurify'
import Link from 'next/link'

// components
import PostLayout from './components/PostLayout'
import NotFound from '@/not-found'
import Button from '@/components/ui/Button'
import Actions from './components/Actions'

// icons
import { Clock, Share, UserCircle } from '@phosphor-icons/react/dist/ssr'


const fetchPost = async (slug) => {
    const req = await fetch(process.env.NEXT_PUBLIC_APP_URL+'/api/post/fetchPost', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slug
        })
    })

    return req.json()
}

export async function generateMetadata({ params }) {
    const post = await fetchPost(params.post)

    if (post === null) return null

    // remove html tags from title, content or description if available
    const title = sanitize(post.title, { ALLOWED_TAGS: [] })
    const description = post.description || post.content
    const metaDiscription = sanitize(description, { ALLOWED_TAGS: [] })

    return {
        title: title,
        openGraph: {
            images: post.media ?? '/postOpenGraph.png',
            type: 'article',
            publishedTime: post.pubDate,
            authors: [post.feed?.website || post.feed?.name, process.env.NEXT_PUBLIC_APP_URL]
        },
        description: description && metaDiscription.replace(/\s+/g, ' ').slice(0, 230),
        generator: process.env.NEXT_PUBLIC_APP_URL,
        applicationName: 'Falconry',
        authors: [
            { name: post.creator || post.feed?.name, url: post.link  },
            { name: 'Falconry', url: process.env.NEXT_PUBLIC_APP_URL }
        ],
        creator: post.creator || post.feed?.name,
        publisher: post.feed?.website || post.feed?.name
    }
}

const FeedHome = async ({ params }) => {
    const post = await fetchPost(params.post)

    if (post === null) return  <NotFound />

    return (
        <PostLayout>

            <div className='feed-con'>
                <div className='cover'>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-full relative" viewBox="0 0 16 8"></svg>
                    <Image src={post.media || '/postOpenGraph.png'} alt={post.title} fill quality={85} />
                </div>

                <div className='content-con'>
                    <div className='content'>

                        <Actions post={{
                            id: post._id,
                            user: post.user,
                            bookmarked: post.bookmarked
                        }} />

                        <div className='holder'>
                            <div className='provider'>
                                {post.feed?.icon ?
                                    <Image src={post.feed?.icon} alt={post.feed?.name} width={20} height={20} />
                                :
                                    <div className='inline-flex items-center justify-center w-[21px] h-[21px] text-xs font-semibold bg-lightBg1 dark:bg-darkBg3 text-black/80 dark:text-white/70 rounded-full mr-2'>
                                        {post.feed?.name.slice(0, 1)}
                                    </div>
                                }
                                {post.feed?.name.slice(0, 30)}
                            </div>

                            <div className='title'>
                                {post.title}
                            </div>

                            <div className='date-time'>
                                <span className='mr-4'>
                                    <UserCircle size={15} /> {(post.creator && post.creator.slice(0,20)) || new URL(post.feed?.website).hostname}
                                </span>
                                <span>
                                    <Clock size={15} /> {moment(post.pubDate).format('MMM D, YYYY')}
                                </span>
                            </div>


                            {post.description &&
                                <div className='contents' dangerouslySetInnerHTML={{ __html: sanitize(post.description) }} />
                            }

                            {post.content &&
                                <div className='contents' dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />
                            }
                            
                            <div className='flex justify-center mt-3'>
                                <Link href={post.link} prefetch={false}  className='w-2/3 xs:min-w-[250px]'>
                                    <Button type='button2' className='w-full text-sm'>
                                        <Share size={15} className='mr-2' />
                                        View original article
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </PostLayout>
    )
}
 
export default FeedHome
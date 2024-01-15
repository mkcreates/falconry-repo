// modules
import Image from 'next/image'
import moment from 'moment'

// components
import NotFound from '@/not-found'
import FollowFeeds from './components/FollowFeeds'
import ProfileLayout from './components/ProfileLayout'
import FeedCardsContainer from '@/components/FeedCardsContainer'
import NoPosts from '@/components/NoPosts'
import FeedImgCon from './components/FeedImgCon'

// icons
import { User } from '@phosphor-icons/react/dist/ssr'


const fetchUser = async (user) => {
    const req = await fetch(process.env.NEXT_PUBLIC_APP_URL+'/api/user/getUser', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user
        })
    })

    return req.json()
}


export async function generateMetadata({ params }) {
    const username = decodeURIComponent(params.user).substring(1)
    const data = await fetchUser(username)

    if (!data) return

    const user = data.user

    return {
        title: `@${user.username} feeds | Falconry`,
        openGraph: {
            images: user.picture ?? '/postOpenGraph.png',
        },
        description: `Check out @${user.username} feeds at Falconry.`,
        generator: process.env.NEXT_PUBLIC_APP_URL,
        applicationName: 'Falconry'
    }
}

export const dynamic = 'force-dynamic'

const Profile = async ({ params }) => {
    const username = decodeURIComponent(params.user).substring(1)
    const user = await fetchUser(username)

    if (!user) return  <NotFound />

    return (
        <ProfileLayout>

            <div className='main-padding h-full'>

                <div className='w-full max-w-3xl mx-auto my-3'>
                    <div className='flex items-center'>
                        <div className='relative shrink-0 w-[70px] h-[70px] bg-lightBg1 dark:bg-darkBg2 rounded-full mr-3 overflow-hidden'>
                            {user.user.picture ?
                                <Image src={user.user.picture} fill alt={user.user.username} quality={60} className='rounded-full object-cover object-center' />
                            :
                                <div className='w-full h-full flex items-center justify-center'>
                                    <User size={45} className='text-stone-500 dark:text-darkBg3' />
                                </div>
                            }
                        </div>

                        <div className='grow'>
                            <div className='sm:flex justify-between items-end mb-1'>
                                <h1 className='text-lg xs:text-xl font-semibold text-black/80 dark:text-white/80'>
                                    @{user.user.username}
                                </h1>
                                <p className='text-[0.813rem] text-black/60 dark:text-white/60'>
                                    Joined {moment(user.user.createdAt).format('MMM D, YYYY')}
                                </p>
                            </div>
                            
                            <p className='text-[0.813rem] text-black/60 dark:text-white/60'>
                                Follows {user.feeds && user.feeds.length} feeds
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center mt-3.5'>
                        <div className='grow relative w-28 h-fit flex overflow-x-hidden mr-1'>
                            {user.feeds && user.feeds.map((feed, i) => (
                                <FeedImgCon key={i} keyValue={i} name={feed.name}>
                                    {feed.icon ?
                                        <Image key={i} src={feed.icon} width={25} height={25} alt={feed.name} quality={90} />
                                    :
                                        <div key={i} className='w-full h-full flex items-center justify-center text-xs text-black/80'>
                                            {feed.name.slice(0,1)}
                                        </div>
                                    }
                                </FeedImgCon>
                            ))}

                            <div className='absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-lightBg1 dark:to-darkBg1'></div>
                        </div>


                        <FollowFeeds feeds={user.feeds} />
                    </div>
                </div>


                <div className='flex items-center mt-6'>
                    <p className='text-sm text-black/60 dark:text-white/60'>Recent 15 articles from @{user.user.username} feeds</p>
                    <div className='hidden xs:block grow h-px ml-2 bg-white/5'></div>
                </div>


                <FeedCardsContainer posts={user.posts} />


                {(user.posts && user.posts.length === 0) && (
                    <NoPosts />
                )}
                
            </div>
        </ProfileLayout>
    )
}
 
export default Profile
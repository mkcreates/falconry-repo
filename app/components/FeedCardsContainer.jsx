"use client"

// modules
import { useGlobalContext } from '@/lib/globalContext'

// components
import FeedCardItem from '@/components/FeedCardItem'
import HomeFeedsSkeleton from '@/components/HomeFeedsSkeleton'

const FeedCardsContainer = ({ posts }) => {
    const { user } = useGlobalContext()

    return (
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 scr900:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 pb-10'>
            {posts ?
                <>
                    {posts.length > 0 && posts.map((post, index) => (
                        <FeedCardItem
                            key={index}
                            keyValue={index}
                            postData={post}
                            user={user}
                        />
                    ))}
                </>

            :

                <HomeFeedsSkeleton />
            }
        </div>
    )
}
 
export default FeedCardsContainer;
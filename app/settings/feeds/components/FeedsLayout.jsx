"use client"

// modules
import { useGlobalContext } from '@/lib/globalContext'

// components
import FeedCategorySkeleton from '../../components/FeedCategorySkeleton'

const FeedsLayout = ({ children }) => {
    const { user } = useGlobalContext()

    return (
        <>
            {user?.signedIn ?
                <>
                    {children}
                </>
            :
                <FeedCategorySkeleton />
            }
        </>
    )
}
 
export default FeedsLayout
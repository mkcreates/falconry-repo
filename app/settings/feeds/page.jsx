// modules
import { Suspense } from 'react'

// components
import FeedCategorySkeleton from '../components/FeedCategorySkeleton'
import FeedsLayout from './components/FeedsLayout'
import AddFeedForm from './components/AddFeedForm'
import EditFeedsList from './components/EditFeedsList'

// define meta data
export const metadata = {
    title: process.env.APP_NAME + ' : Settings > Feeds',
}

const SettingsFeeds = () => {
    return (
        <Suspense fallback={<FeedCategorySkeleton />}>
            <FeedsLayout>
                <AddFeedForm />

                <EditFeedsList />
            </FeedsLayout>
        </Suspense>
        
    )
}
 
export default SettingsFeeds
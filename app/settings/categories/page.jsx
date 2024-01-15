// modules
import { Suspense } from 'react'

// components
import CategoriesOperations from './components/CategoriesOperations'
import FeedCategorySkeleton from '../components/FeedCategorySkeleton'

// define meta data
export const metadata = {
    title: process.env.APP_NAME + ' : Settings > Categories',
}

const SettingsCategories = () => {
    return (
        <>
            <Suspense fallback={<FeedCategorySkeleton />}>
                <CategoriesOperations />
            </Suspense>
        </>
    )
}
 
export default SettingsCategories
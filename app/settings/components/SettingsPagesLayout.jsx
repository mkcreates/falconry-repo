"use client"

// modules
import feedScroll from '@/lib/feedIsScrolled'
import Authenticated from '@/lib/authenticated'

const SettingsPagesLayout = ({children}) => {
    Authenticated(true, '/login')

    return (
        <div
            onScroll={(event) => feedScroll(event)}
            className="grow max-w-[100vw] h-full pb-5 p-3 dark:px-0 overflow-y-auto"
        >
            <div className="w-full md:max-w-2xl bg-white dark:bg-transparent mt-5 dark:mt-0 p-4 py-5 md:p-7 rounded-2xl sm:rounded-3xl shadow dark:shadow-none">
                {children}
            </div>
        </div>
    )
}
 
export default SettingsPagesLayout
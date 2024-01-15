"use client"

// modules
import Link from "next/link"
import { usePathname } from "next/navigation"

// icons
import { Rows, RssSimple, User, CaretRight } from "@phosphor-icons/react"

const SettingsNav = () => {
    const path = usePathname()
    
    return (
        <div id="settingsNav">
            <Link
                href='/settings'
                className={path === '/settings' ? 'active' : ''}
                prefetch={true}
            >
                <User size={17} weight="fill" /> Account
            </Link>
            <Link
                href='/settings/feeds'
                className={path === '/settings/feeds' ? 'active' : ''}
                prefetch={true}
            >
                <RssSimple size={17} weight="fill" /> Feeds
            </Link>
            <Link
                href='/settings/categories'
                className={path === '/settings/categories' ? 'active' : ''}
                prefetch={true}
            >
                <Rows size={17} weight="fill" /> Categories
            </Link>
        </div>
    )
}
 
export default SettingsNav
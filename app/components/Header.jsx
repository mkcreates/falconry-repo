"use client"

// modules
import { useEffect, useState } from 'react'
import {useGlobalContext} from '../lib/globalContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import changeTheme from '@/lib/changeTheme'

// components
import Badge from './ui/Badge'
import UserMenu from './UserMenu'

// icons
import { MagnifyingGlass, Moon, List, Sun, X, Bell, Info } from '@phosphor-icons/react'
import Button from './ui/Button'
import Modal from './ui/Modal'
import NotificationPing from './NotificationPing'

const Header = () => {
    const {
        user,
        setNavbarVisibility,
        notification, setNotification,
        setRefreshPosts,
        notifyModal, setNotifyModal,
        setAbout
    } = useGlobalContext()
    const [themeIcon, setThemeIcon] = useState(null) // state to toggle theme icon
    const [showSearch, setShowSearch] = useState(false)
    const [keyword, setKeyword] = useState('')
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const search = (e) => {
        e.preventDefault()
        if (keyword) router.push('/?search='+keyword)
    }

    useEffect(() => {
        /* watch for change in path & serch params, and if change */

        // restore header back to  default style
        const header = document.querySelector('.header-container')
        header.classList.remove('feedIsScrolled')

        // set theme icon by the current theme <body class='dark'>
        setThemeIcon(document.documentElement.classList[0])

        // hide search form on change, only when param is not search
        if (!searchParams.has('search')) setShowSearch(false)
    }, [pathname, searchParams]) // reset header styles when <- they change

    useEffect(() => {
        const searchInput = document.getElementById('searchInput')
        searchInput.focus()
    }, [showSearch])

    return (
        <div className='header-container'>
            <div className="header main-padding">
                <div className='flex items-center'>
                    <button
                        className='scr900:hidden mr-3'
                        onClick={() => setNavbarVisibility(true)}
                    >
                        <List size={23} />
                    </button>

                    <div
                        className='flex cursor-pointer'
                        onClick={()=> setShowSearch(true)}
                    >
                        <MagnifyingGlass size={20} />
                        <input type='text' placeholder='Search' className='hidden mic:block w-20 pointer-events-none' />
                    </div>
                </div>


                <div className='flex items-center'>
                    {user?.signedIn &&
                        <Badge
                            onClick={() => setNotifyModal(true)}
                            type='badge2' className='mr-2'
                        >
                            <span className='relative'>
                                <Bell size={20} />
                                {notification && <NotificationPing />}
                            </span>
                        </Badge>
                    }

                    <Badge
                        type='badge2'
                        className='mr-2'
                        onClick={() => changeTheme(setThemeIcon)}
                    >
                        {themeIcon == 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </Badge>

                    {!user?.signedIn &&
                        <Badge type='badge2' className='mr-2'
                                onClick={() => setAbout(true)}>
                            <Info size={20} />
                        </Badge>
                    }

                    <UserMenu />
                </div>

                
                <form className={'searchForm scale-y-0 '+(showSearch && 'scale-y-100')} onSubmit={search}>
                    <div className='con'>
                            <X size={20} className='cursor-pointer shrink-0' onClick={()=> {
                                setShowSearch(false)
                                router.push('/')
                            }} />

                            <input
                                type='text'
                                placeholder='Search any post, title, creator, description...'
                                className='grow text-sm'
                                onChange={(e)=> setKeyword(e.target.value)}
                                id='searchInput'
                            />

                            <button type='submit'>
                                <MagnifyingGlass size={20} className='ml-3 shrink-0' />
                            </button>
                    </div>
                </form>
            </div>

            {notification && notifyModal && (
                <Modal title='New Posts' closer={setNotifyModal}>
                    <div className='flex flex-col items-center min-w-[230px]'>
                        <Bell size={50} className='text-black/30 dark:text-white/30' />
                        <p className='text-sm text-black/80 dark:text-white/80 my-2'>You have new articles...</p>

                        <Button
                            onClick={() => {
                                setRefreshPosts(prev => !prev)
                                setNotifyModal(false)
                                setNotification(false)
                            }}
                            type='button2'
                            className='mb-4'
                        >Refresh</Button>

                        <p
                            onClick={() => {
                                localStorage.notifyModalOff === '1' ? localStorage.notifyModalOff = '0' : localStorage.notifyModalOff = '1'
                                setNotifyModal(false)
                            }}
                            className='text-xs text-black/60 dark:text-white/60 underline underline-offset-4 cursor-pointer'
                        >
                            {localStorage.notifyModalOff === '1' ? 'Automatically show this again.' : 'Dont automatically show this.'}
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    )
}
 
export default Header
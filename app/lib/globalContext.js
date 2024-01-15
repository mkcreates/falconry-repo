"use client"

import { usePathname, useRouter } from 'next/navigation'
import { createContext, useState, useContext, useEffect } from 'react'

// define global contex
const Context = createContext()

const GlobalContext = ({ children }) => {
    // global shared states to be passed to context data
    const [user, setUser] = useState(null)
    const [categories, setCategories] = useState(null)
    const [feeds, setFeeds] = useState(null)
    const [refreshUser, setRefreshUser] = useState(false)
    const [refreshPosts, setRefreshPosts] = useState(false)
    const [notification, setNotification] = useState(false)
    const [notifyModal, setNotifyModal] = useState(false)
    const [about, setAbout] = useState(false)
    const [navbarVisible, setNavbarVisibility] = useState(false)
    const router = useRouter()
    const path = usePathname()

    useEffect(() => {
        const checkUser = async () => {
            // check if user is signed in
            const res = await fetch('/api/user', { method: 'GET', cache: 'no-store' })
            const response = await res.json()

            setUser(response)

            // check if user has passed through after signup
            if (response.signedIn && !response.data.dataCollection) {
                // if not,
                setInterval(() => {
                    // redirect to add feeds page when its a auth paths
                    if (path === '/' || path.includes('settings')) {
                        router.push('/add-feeds')
                    }
                }, 1600)
            }
        }
        checkUser()

        
        const fetchCategories = async () => {
            // fetch all user categories
            const res = await fetch('/api/category', { method: 'GET', cache: 'no-store' })
            const response = await res.json()
            
            setCategories(response)
        }
        fetchCategories()


        const fetchFeeds = async () => {
            // fetch all user categories
            const res = await fetch('/api/feed', { method: 'GET', cache: 'no-store' })
            const response = await res.json()
            
            setFeeds(response)
        }
        fetchFeeds()
    }, [refreshUser])

    return ( 
        <Context.Provider
            value={{
                user, setUser,
                refreshUser, setRefreshUser,
                categories, setCategories,
                feeds, setFeeds,
                navbarVisible, setNavbarVisibility,
                refreshPosts, setRefreshPosts,
                notification, setNotification,
                notifyModal, setNotifyModal,
                about, setAbout
            }}
        >
            {children}
        </Context.Provider>
    )
}

export default GlobalContext
export const useGlobalContext = () => useContext(Context)
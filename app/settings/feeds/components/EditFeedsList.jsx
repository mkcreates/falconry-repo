"use client"

// modules
import { useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '@/lib/globalContext'
import Image from 'next/image'
import Tippy from '@tippyjs/react'
import ClipboardJS from 'clipboard'

// components
import Badge from '@/components/ui/Badge'
import { Dropdown, DropdownContent, DropdownItem } from '@/components/ui/Dropdown'

// icons
import { Eye, EyeSlash, Trash, Rows, SpinnerGap, Copy } from '@phosphor-icons/react'

const EditFeedsList = () => {
    const { feeds, setFeeds, categories } = useGlobalContext()
    const [errors, setErrors] = useState(null)
    const [currentError, setCurrentError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [currentSuccess, setCurrentSuccess] = useState(null)
    const [loading, setLoading] = useState(null)
    const listTop = useRef(null)


    const updateFeed = async (id, type, value) => {
        if (loading) return
        
        setLoading(id)

        const req = await fetch('/api/feed', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({feedId: id, type: type, value: value})
        })

        setLoading(null)

        // clear errors & success
        setErrors(null)
        //setSuccess(null)

        const response = await req.json()

        if (response.error) {
            // encountered error
            setErrors(response.error)

            // show error on current item in list
            setCurrentError(id)
        }
        else {
            const newFeed = [...feeds] // spread global feeds
            // get the index of category in focus
            const index = newFeed.findIndex(feed => feed._id === id)
            // change object value by gotten index
            newFeed[index] = response.feed

            // resort feeds bringing newest first
            const sortedFeed = newFeed.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
 
            // update global feeds list
            setFeeds(sortedFeed)

            setSuccess('Feed Updated!')
            setCurrentSuccess(id)

            // scroll page to top to see error
            listTop.current.scrollIntoView()
        }
    }


    const deleteFeed = async (id) => {
        if (loading) return

        setLoading(id)

        const req = await fetch('/api/feed', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ feedId: id })
        })

        setLoading(null)

        // clear errors & success
        setErrors(null)
        setSuccess(null)

        const response = await req.json()

        if (response.error) {
            // encountered error
            setErrors(response.error)
        }
        else {
            // filter out removed feeds
            let filteredFeed = feeds.filter(cat => cat._id !== id)
            setFeeds(filteredFeed)
        }
    }

    useEffect(() => {
        // initialize clipboardjs for copy of feed url
        const clipboard = new ClipboardJS('.copyBtn')
        
        return () => clipboard.destroy()
    }, [])


    return (
        <div className='feedlist'>

            <div className='head lighter' ref={listTop}>
                Feeds
            </div>

            <div className='items-con w-full'>
                {feeds && feeds.map((feed, fi) => {

                    return (
                        <div className='items' key={fi}>
                            <div className='infoscon'>
                                <div className='infos'>
                                    <div className='img'>
                                        {feed.icon ?
                                            <Image src={feed.icon} fill alt='...' />
                                        :
                                            <div className='w-full h-full flex items-center justify-center text-sm text-black/80 dark:text-white/80 font-semibold'>
                                                {feed.name.slice(0,1)}
                                            </div>
                                        }
                                    </div>
                                    <div className='name'>{feed.name.slice(0,25)}</div>
                                </div>

                                {currentError === feed._id && (
                                    <div className="err">{errors}</div>
                                )}

                                {currentSuccess === feed._id && (
                                    <div className="succ">{success}</div>
                                )}
                            </div>

                            <div className='actions'>
                                {loading === feed._id && (
                                    <div><SpinnerGap size={20} className="loader animate-spin mr-1 dark:text-white/80" /></div>
                                )}

                                <Dropdown
                                    position='left'
                                    trigger='clickStay'
                                    hideOnClick
                                    className='flex items-center'
                                    height={150}
                                >
                                    <Tippy content='Change Category'>
                                        <span className='mb-1'>
                                            <Badge type='bordered'>
                                                <Rows size={16} />
                                            </Badge>
                                        </span>
                                    </Tippy>
                                    
                                    <DropdownContent className='[overflow-y:auto!important] [top:auto!important] [bottom:100%]'>
                                        {categories && categories.map((cat, ic) => (
                                            <DropdownItem
                                                key={ic}
                                                onClick={()=> updateFeed(feed._id, 'category', cat._id)}
                                                active={feed.category === cat._id}
                                            >{cat.name}</DropdownItem>
                                        ))}
                                    </DropdownContent>
                                </Dropdown>

                                <Tippy content={feed.isPublic ? 'Make private' : 'Make public'}>
                                    <button
                                        onClick={()=> updateFeed(feed._id, 'isPublic', !feed.isPublic)}
                                        disabled={loading === feed._id}
                                    >
                                        <Badge type='bordered'>
                                            {feed.isPublic ? <Eye size={16} /> : <EyeSlash size={16} />}
                                        </Badge>
                                    </button>
                                </Tippy>

                                <Dropdown
                                    position='left'
                                    trigger='clickStay'
                                    hideOnClick
                                >
                                    <Tippy content='Delete'>
                                        <span>
                                            <Badge type='bordered'>
                                                <Trash size={16} />
                                            </Badge>
                                        </span>
                                    </Tippy>

                                    <DropdownContent>
                                        <DropdownItem onClick={()=> deleteFeed(feed._id)}>Yes</DropdownItem>
                                        <DropdownItem>No</DropdownItem>
                                    </DropdownContent>
                                </Dropdown>

                                <Tippy content='Copy Feed Link'>
                                    <button
                                        className='copyBtn active:scale-125 active:rotate-180 duration-300'
                                        data-clipboard-text={feed.link}
                                    >
                                        <Badge type='bordered'>
                                            <Copy size={16} />
                                        </Badge>
                                    </button>
                                </Tippy>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
 
export default EditFeedsList
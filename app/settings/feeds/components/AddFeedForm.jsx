"use client"

// modules
import { useState } from 'react'
import { useGlobalContext } from '@/lib/globalContext'
import { useImmer } from 'use-immer'
import Link from 'next/link'
import Tippy from '@tippyjs/react'

// components
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import CheckBox from '@/components/ui/CheckBox'
import { Dropdown, DropdownContent, DropdownItem } from '@/components/ui/Dropdown'

// icons
import { CaretDown, Info, Plus, Gear, SpinnerGap } from '@phosphor-icons/react'

const AddFeedForm = () => {
    const [feedFormVisible, showFeedForm] = useState(false)
    const { feeds, setFeeds, categories } = useGlobalContext()
    const [form, setForm] = useImmer({isPublic: true})
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(null)
    const [unexpectedError, setUnexpectedError] = useState(null)
    const [loading, setLoading] = useState(false)


    const updateForm = (e, input) => {
        setForm(data => {
            data[input] = e.target.value
        })
    }

    const handleCheck = (e) => {
        setForm(data => {
            data.isPublic = !data.isPublic
        })
    }

    const handleCategory = (e) => {
        setForm(data => {
            data.category = e.target.getAttribute('value')
            data.categoryName = e.target.innerText
        })
    }

    const submitForm = async e => {
        e.preventDefault()

        setLoading(true)

         // clear errors/success
        setErrors(null); setUnexpectedError(null)

        setSuccess('Fetching feed...')

        const req = await fetch('/api/feed/addFeed', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })

        setLoading(false)

        // clear success
        setSuccess(null)

        const response = await req.json()

        if (response.error) {
            // encountered form validation error
            setErrors(response.error)
        }
        else if (response.unexpectedError) {
            // encountered other error
            setUnexpectedError(response.unexpectedError)
        }
        else {
            // show success alert
            setSuccess('Feed added successfully! Adding recent posts in background...')
            setTimeout(() => setSuccess(null), 7000)

            // clear category input
            e.target.querySelector('input').value = ''
            showFeedForm(false) // hide form

            // update global feed list
            setFeeds([response.feed, ...feeds])

            // fetch recent posts from newly added RSS feed
            await fetch('/api/feed/fetchFeed', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    feedLink: response.feed.link,
                    feedId: response.feed._id
                })
            })
        }
    }


    return (
        <>
            <div className='flex items-center justify-between mb-5'>
                <div className='heading'>
                    <Gear size={16} className='mr-2' /> Settings: Feeds
                </div>

                <Button
                    onClick={() => showFeedForm(!feedFormVisible)}
                    type='button3'
                    size='small'
                >
                    <Plus size={13} className='mr-1' /> New
                </Button>
            </div>
            
            {errors?.errorCount > 0 && (
                <div className="errorHead w-fit">
                    You have <strong>{errors.errorCount}</strong> errors in your form.
                </div>
            )}

            {unexpectedError && (
                <div className="errorHead w-fit">{unexpectedError}</div>
            )}

            {success && (
                <div className="successHead w-fit">{success}</div>
            )}

            {feedFormVisible && 
                <form onSubmit={submitForm}>
                    <div className='mb-3' >
                        <Input
                            label="Type in Feed Link"
                            placeholder="https://bbc.com/feed.xml"
                            onChange={(e) => updateForm(e, 'feed')}
                        />
                        {errors?.feed && <span className="errors">{errors.feed}</span>}
                    </div>

                    <div className='flex flex-wrap items-center'>
                        <div className='inline-flex items-center justify-between mb-3 mr-10'>

                            <Dropdown position='left' trigger='click' hideOnClick={true} height={150}>
                                <div className='default h-full button button1 small w-36'>
                                    {form.category ? form.categoryName : 'Select Category'} 
                                    <CaretDown size={15} className='ml-1' />
                                </div>

                                <DropdownContent className='w-full [overflow-y:auto!important]'>
                                    {categories.map((cat, i) => (
                                        <DropdownItem
                                            key={i}
                                            keyValue={i}
                                            onClick={handleCategory}
                                            value={cat._id}
                                            active={form.category === cat._id}
                                        >
                                            {cat.name}
                                        </DropdownItem>
                                    ))}
                                </DropdownContent>
                            </Dropdown>
                            

                            <Tippy content='Add Category'>
                                <Link href='/settings/categories' prefetch={true}>
                                    <span className='ml-2'>
                                        <Badge type='bordered'>
                                            <Plus size={16} />
                                        </Badge>
                                    </span>
                                </Link>
                            </Tippy>
                        </div>


                        <div className='flex items-center mb-3'>
                            <CheckBox
                                label='Make private?'
                                className='mr-1'
                                id='private'
                                onChange={handleCheck}
                            />
                            
                            <Tippy content='Hide feed from your public profile?' >
                                <Info size={20} className='text-black/40 dark:text-white/40 cursor-pointer' />
                            </Tippy>
                        </div>
                    </div>

                    <div className='mb-4 -mt-3'>
                        {errors?.category && <span className="errors">{errors.category}</span>}
                    </div>

                    <Button
                        type='button3'
                        size='small'
                        submit
                        disabled={loading ? true : false}
                        className='mb-5'
                    >
                        <Plus size={13} className='mr-1' />
                        Add 
                        {loading && <SpinnerGap size={15} className="loader animate-spin" />}
                    </Button>

                    <Link href='/add-feeds/?fromfeeds=1'>
                        <Button type='button2' size='small' className='font-semibold text-[0.813rem] px-4'>Add feeds from list</Button>
                    </Link>
                </form>
            }
        </>
    )
}
 
export default AddFeedForm
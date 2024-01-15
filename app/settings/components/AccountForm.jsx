"use client"

// modules
import Image from 'next/image'
import Link from 'next/link'
import { useGlobalContext } from '@/lib/globalContext'
import { useImmer } from 'use-immer'
import { useRef, useState } from 'react'

// components
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import CheckBox from '@/components/ui/CheckBox'

// icons
import { At, FloppyDisk, Gear, Share, SpinnerGap, Trash, User } from '@phosphor-icons/react'

const AccountForm = () => {
    const { user, setUser } = useGlobalContext()
    const [form, setForm] = useImmer({...user.data})
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const top = useRef(null)

    const updateForm = (e, input) => {
        setForm(data => {
            data[input] = e.target.value
        })
    }

    const handleChecks = (check) => {
        setForm(data => {
            data.preference[check] = !data.preference[check]
        })
    }

    const submitForm = async e => {
        e.preventDefault()
        setLoading(true)

        const req = await fetch('/api/updateUser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data: form,
                prevUsername: user.data.username
            })
        })

        setLoading(false)

        // clear errors
        setErrors(null)

        const response = await req.json()

        if (response.errors) {
            // encountered error
            setErrors(response.errors)

            // scroll page to top to see error
            top.current.scrollIntoView()
        } else {
            // succeeded!
            setUser({
                data: {...response},
                signedIn: user.signedIn
            })

            setSuccess('Changes saved.')
        }
    }

    const handleUpload = async (e) => {
        setUploading(true)

        const fileInput = e.target
        const file = fileInput.files[0]

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'ivhvvz76')

        const maxFileSize = 1 * 1024 * 1024 // 1MB

        // check if file is selected, not more than 1mb, and is an image
        if (file && file.size <= maxFileSize && file.type.startsWith('image/')) {

            const cloudName = 'artisticlogic'
            const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

            const req = await fetch(url, {
                method: 'POST',
                body: formData,
            })

            const response = await req.json()

            if (response.secure_url) {
                // if image is uploaded, save url to form data
                setForm(data => {
                    data.picture = response.secure_url
                })

                // and then trigger form submit
                setTimeout(() => document.getElementById('formButton').click(), 1000)

                // reset file select
                fileInput.value = ''
                setUploading(false)
            }
            
        } else {
            // image validation failed, set alert
            setErrors('File must be an image (jpg, png, webp) and must not exceed 1MB.')
            setUploading(false)
        }
    }

    const removePicture = () => {
        setForm(data => {
            data.picture = null
        })

        // and then trigger form submit
        setTimeout(() => document.getElementById('formButton').click(), 1000)
    }

    return (
        <form className='mb-10' onSubmit={submitForm}>
                
            <div className='heading mb-6' ref={top}>
                <Gear size={16} className='mr-2' /> Settings: Account
            </div>

            {errors && (
                <div className="errorHead mb-3 w-fit">{errors}</div>
            )}

            <div className='flex items-center mb-5'>
                <div className='relative w-20 h-20 overflow-hidden rounded-full mr-4 border dark:border-white/5'>
                    {user.data.picture ?
                        <Image src={user.data.picture} alt={user.data.username} fill quality={60} />
                    :
                        <div className='w-full h-full flex items-center justify-center bg-lightBg1 dark:bg-darkBg2'>
                            <User size={45} className='text-stone-500 dark:text-darkBg3' />
                        </div>
                    }
                </div>

                <div>
                    <div className='flex items-center mb-2'>
                        <input
                            type="file"
                            id="photo"
                            className='w-24 file:rounded-full file:bg-lightBg1  dark:file:bg-darkBg2 file:border-none file:text-xs text-sm file:text-black/90 dark:file:text-white/80 text-black/80 dark:text-white/80 file:px-3 file:py-1 file:mr-3'
                            accept='image/jpeg, image/png, image/webp'
                            onChange={(e) => handleUpload(e)}
                        />
                        {uploading && <SpinnerGap size={19} className="loader animate-spin ml-0.5 dark:text-white/80" />}
                    </div>

                    {user.data.picture &&
                        <Button
                            onClick={removePicture}
                            size='small'
                            className='rounded-full'
                        >
                            <Trash size={15} className='mr-2' /> Remove Picture
                        </Button>
                    }
                </div>
            </div>

            <Input
                className='mb-5' 
                label="Username"
                defaultValue={user.data.username}
                placeholder="peterPan001"
                icon={<At size={17} className='mr-1' />}
                iconPosition='left'
                required
                onChange={(e) => updateForm(e, 'username')}
            />

            <CheckBox
                label='Allow public access to profile?'
                className='mb-1'
                id='share'
                onChange={() => handleChecks('profileIsPublic')}
                checked={user.data.preference.profileIsPublic}
            />
            <div className='text mb-3'>
                This option allows public viewing of your curated feeds profile.
            </div>

            <div className='text lighter mb-0.5'>Your feed will be publicly available at:</div>
            <Link
                href={process.env.NEXT_PUBLIC_APP_URL+'/u/@'+user.data.username}
                className='flex text-sm text-sky-500 dark:text-sky-400 underline underline-offset-2 mb-5'
                prefetch={false}
            >
                <Share size={18} className='mr-1' /> {process.env.NEXT_PUBLIC_APP_URL+'/u/@'+user.data.username}
            </Link>

            <CheckBox
                label='Receive weekly email notifications on new feeds.'
                className='mb-5 hidden'
                id='email'
                onChange={() => handleChecks('receiveEmail')}
                checked={user.data.preference.receiveEmail}
            />

            <CheckBox
                label='Hide read articles.'
                className='mb-4'
                id='hide'
                onChange={() => handleChecks('hideAfterRead')}
                checked={user.data.preference.hideAfterRead}
            />

            <div className='flex justify-between items-center'>
                <Button
                    type='button3'
                    className='order-2 sm:order-1'
                    id='formButton'
                    submit
                    disabled={loading ? true : false}
                >
                    <FloppyDisk size={15} className='mr-2' /> Save Changes
                    {loading && <SpinnerGap size={15} className="loader" />}
                </Button>

                {success && (
                    <div className="successHead order-1 sm:order-2 mb-0">{success}</div>
                )}
            </div>

        </form>
    )
}
 
export default AccountForm
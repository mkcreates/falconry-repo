"use client"

// modules
import Image from 'next/image'
import Button from './ui/Button'
import { useGlobalContext } from '@/lib/globalContext'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// icons
import { GithubLogo, Info, SpinnerGap, User, UserGear } from '@phosphor-icons/react'

const UserMenu = () => {
    const { user, setRefreshUser, setAbout } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const logout = async () => {
        setLoading(true)

        const req = await fetch('/api/logout', {method: 'POST' })
        const response = await req.json()

        setLoading(false)

        if (response.signedOut) {
            setRefreshUser((prev) => !prev)
            
            setTimeout(() => {
                setAbout(true)
                router.push('/')
            }, 2000)
        }
    }

    return (
        <>
            {user && (
                <>
                    {user.signedIn ?
                        <div className='group relative w-7 h-7 ml-1'>
                            <div className='w-full h-full bg-lightBg3 dark:bg-darkBg2 rounded-full'>
                                {user?.data.picture ?
                                    <Image src={user.data.picture} fill alt={user.data.username} className='rounded-full cursor-pointer' />
                                :
                                    <div className='w-full h-full flex items-center justify-center '>
                                        <User size={17} />
                                    </div>
                                }
                            </div>

                            <div className='userMenu'>
                                <div className='name'>
                                    <p className='font-semibold mb-1'>{user.data.username}</p>
                                    <p>{user.data.email}</p>
                                </div>

                                <div className='links'>
                                    <Link href='/settings'>
                                        <UserGear size={15} /> Account
                                    </Link>

                                    <Link href={process.env.NEXT_PUBLIC_APP_URL+'/u/@'+user.data.username}>
                                        <User size={15} /> Public Profile
                                    </Link>

                                    <Link onClick={(e) => {
                                        e.preventDefault()
                                        setAbout(true)
                                    }} href='#'>
                                        <Info size={15} /> About
                                    </Link>

                                    <Link href='https://github.com/artisticLogicMK/falconry' target='_blank'>
                                        <GithubLogo size={15} /> Source Code
                                    </Link>
                                </div>

                                <div className='outCon'>
                                    <Button
                                        onClick={logout} className='out'
                                        disabled={loading ? true : false}
                                    >
                                        Logout
                                        {loading && <SpinnerGap size={15} className="loader" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    :
                        <Link href='/login' prefetch={true}>
                            <Button size='small' type='button2' className='ml-2'>Login</Button>
                        </Link>
                    }
                </>
            )}
        </>
    )
}
 
export default UserMenu
"use client"

// modules
import Link from 'next/link'
import { useEffect, useRef } from "react"
import gsap from 'gsap'

// components
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

// icons
import { X } from '@phosphor-icons/react'
import Image from 'next/image'

const SignupNotice = ({ closer }) => {
    // element references
    const bg = useRef(null)
    const content = useRef(null)

    const closeNotice = () => {
        // animate notice out
        window.noticeAnimate.reverse().timeScale(-2)
    }

    useEffect(() => {
        // animate notice in
        window.noticeAnimate = gsap.timeline({ defaults: { ease: "linear", delay: 0, yoyo: true },
            onReverseComplete: () => { // after reverse, close notice
                closer(false)
            },
            // store in session that signup notice has been shown already
            onComplete: () => sessionStorage.signupNotice = '1'
        })
        .to(bg.current, {opacity: 1, duration: 1})
        .to(content.current, {opacity: 1, scale: 1, duration: 0.4}, '-=0.5')
    }, [])

    return (
        <div
            ref={bg}
            className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-darkBg2 bg-[url(../img/signupBg.svg)] bg-cover bg-center z-20 py-5 px-3 overflow-y-auto opacity-0'
        >
            <div
                ref={content}
                className='relative w-full max-w-sm bg-darkBg3 bg-[url(../img/signupNotice.svg)] bg-cover bg-center rounded-3xl shadow-lg overflow-hidden opacity-0 scale-50'
            >
                <Badge
                    onClick={closeNotice}
                    className='absolute top-3 left-3 z-10'
                >
                    <X size={21} />
                </Badge>

                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-full relative" viewBox="0 0 17 20"></svg>

                <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center px-4 xs:px-5 mt-12'>
                    <Image src='/img/welcome.svg' alt='Falconry_Graphic' width={208} height={80} className='mb-2' />

                    <div className='text-sm text-white mb-5'>Hello there! You&apos;re viewing Falconry&apos;s public feeds, login to curate your own feeds and personalize settings..</div>

                    <div className='flex'>
                        <Link
                            href='/login'
                            onClick={closeNotice}
                            className='mr-5'
                            prefetch={true}
                        >
                            <Button type='button3' className='text-sm font-semibold bordered'>
                                Login
                            </Button>
                        </Link>
                        
                        <Link
                            href='/signup'
                            onClick={closeNotice}
                            prefetch={true}
                        >
                            <Button type='button3' className='text-sm font-semibold bordered'>
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default SignupNotice
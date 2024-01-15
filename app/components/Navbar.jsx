"use client"

// modules
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useGlobalContext } from '@/lib/globalContext'
import { usePathname, useSearchParams } from 'next/navigation'

// components
import Button from './ui/Button'
import NavLinks from './NavLinks'
import Modal from './ui/Modal'
import FeedsList from './FeedsList'
import CategoriesList from './CategoriesList'

// assets
import LogoDark from '@/assets/img/logo_dark.svg'
import LogoLight from '@/assets/img/logo_light.svg'

// icons
import {
    Rss, GearSix, Eye, BookmarkSimple, ArrowRight
} from '@phosphor-icons/react'


const Navbar = () => {
    const { user, navbarVisible, setNavbarVisibility } = useGlobalContext()
    const [feedModal, setFeedModal] = useState(false)
    const [categoryModal, setCategoryModal] = useState(false)
    const searchPrm = useSearchParams()
    const path = usePathname()
    
    useEffect(() => {
        // hide navbar when any link is clicked
        const allLinks = document.querySelectorAll('nav a')
        allLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                setNavbarVisibility(false)
            })
        })
    })

    useEffect(() => {
        // close navbar when url path or param changes
        setNavbarVisibility(false)
    }, [path, searchPrm])


    return (
        <>
            <nav
                className={
                    'h-full w-0 scr900:w-fit shrink-0 scr900:bg-none absolute scr900:static top-0 z-10 duration-500 scr900:duration-0 backdrop-blur-[2px] '
                    +(navbarVisible && 'w-full bg-black/[.15] dark:bg-black/40')
                }
            >

                <div
                    className={
                        'absolute top-4 right-3 mic:right-4 w-full '
                        +(navbarVisible ? 'translate-x-0 duration-1000 ease-in-out' : '-translate-x-full')
                    }
                    onClick={() => setNavbarVisibility(false)}
                >
                    <button className={
                        'center bg-lightBg2 dark:bg-darkBg2 rounded-full p-2 shadow-md text-black/60 dark:text-white/60 float-right duration-1000 '
                        +(navbarVisible && 'rotate-180')
                    }>
                        <ArrowRight size={25} weight='bold' />
                    </button>
                </div>


                <div className={
                    'flex flex-col relative bg-lightBg2 dark:bg-darkBg2 w-60 xl:w-64 scr1440:w-72 -translate-x-full scr900:translate-x-0 shadow-lg h-full duration-700 scr900:duration-0 '
                    +(navbarVisible && 'translate-x-0')
                }>

                    <div className='w-3/5 mx-auto my-4 pad-x dark:opacity-90'>
                        <Link href='/' prefetch={false}>
                            <Image src={LogoDark} alt='Falconry Logo' className='hidden dark:block w-full' />
                            <Image src={LogoLight} alt='Falconry Logo' className='dark:hidden w-full' />
                        </Link>
                    </div>


                    <div className='grow overflow-y-auto overflow-x-hidden pad-x'>
                        <div className='links'>
                            <Link
                                href="/"
                                prefetch={false}
                                className={searchPrm.size === 0 && path === '/' ? 'active' : ''}
                            >
                                <Rss size={15} /> All Feed
                            </Link>
                            <Link
                                href={user?.signedIn ? '/?bookmark' : '/login'}
                                prefetch={false}
                                className={searchPrm.has('bookmark') ? 'active' : ''}
                            >
                                <BookmarkSimple size={16} /> Bookmarked
                            </Link>
                            <Link
                                href={user?.signedIn ? '/?hidden' : '/login'}
                                prefetch={false}
                                className={searchPrm.has('hidden') ? 'active' : ''}
                            >
                                <Eye size={16} /> Hidden
                            </Link>
                        </div>


                        <NavLinks
                            setCategoryModal={setCategoryModal}
                            setFeedModal={setFeedModal}
                        />


                        <div className='absolute bottom-0 left-0 w-full bg-lightBg2 dark:bg-darkBg2 pb-3 pad-x'>
                            <Link href='/settings' prefetch={true}>
                                <Button type='button1' className='w-full'>
                                    <GearSix size={15} className='mr-3' /> Settings
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
   
            </nav>


            {feedModal && (
                <Modal title='Feeds List' closer={setFeedModal}>
                    <FeedsList closer={setFeedModal} />
                </Modal>
            )}

            {categoryModal && (
                <Modal title='Categories List' closer={setCategoryModal}>
                    <CategoriesList closer={setCategoryModal} />
                </Modal>
            )}
        </>
    )
}
 
export default Navbar
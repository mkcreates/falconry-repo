"use client"

// modules
import {useGlobalContext} from '../lib/globalContext'
import { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode"

// components
import SignupNotice from '@/components/SignupNotice'
import { SpinnerGap } from '@phosphor-icons/react'
import GoogleButton from './auth/GoogleButton'
import getCookie from '@/lib/getCookieClient'

const Main = ({ children }) => {
    const { navbarVisible, user, refreshUser } = useGlobalContext()
    const [signupNotice, showNotice] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // if signup notice has not been show, wait 50s and then show
        if (!('signupNotice' in sessionStorage)) {
            setTimeout(() => showNotice(true), 5000 * 8)
        }

        // google auth signin here
        window.onSignIn = async (auth) => {

            if (loading) return

            setLoading(true)

            const decoded = jwtDecode(auth.credential)

            const req = await fetch('/api/googleAuth', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(decoded)
            })

            const response = await req.json()

            setLoading(false)

            if (response) {
                window.location.reload()
            }
        }
    }, [])


    useEffect(() => {
        if (!getCookie('F_Token')) {
            document.getElementById('glBtn').style.display = 'block'
        } else {
            document.getElementById('glBtn').style.display = 'none'
        }
    }, [refreshUser])


    return (
        <>
            <div id="g_id_onload"
                data-client_id={process.env.NEXT_PUBLIC_G_CLIENT_ID}
                data-callback="onSignIn"
                data-auto_prompt="false"
            ></div>
            
            <main
                className={'grow scr900:translate-x-0 duration-700 '+(navbarVisible && 'translate-x-60')}
            >

                {children}


                <div id='glBtn' className='hidden absolute left-0 bottom-0 z-50 w-full h-px'>
                    <div className='relative w-full h-px max-w-6xl mx-auto'>
                        <div className='absolute bottom-3 right-3 z-50'>
                            <GoogleButton />
                        </div>
                    </div>
                </div>
            </main>

            {loading &&
                <div className='authLoader'>
                    <SpinnerGap size={20} /> Authenticating...
                </div>
            }

            {signupNotice && !user?.signedIn && <SignupNotice closer={showNotice} />}
        </>
    )
}
 
export default Main
// modules
import Script from 'next/script'
import GlobalContext from './lib/globalContext'

// assets
//import { Open_Sans } from 'next/font/google'
import './assets/css/index.css'
import 'tippy.js/dist/tippy.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// components
import Navbar from '@/components/Navbar'
import Main from '@/components/Main'
import Header from '@/components/Header'
import LandingPage from '@/components/landingPage/LandingPage'

//const openSans = Open_Sans({ subsets: ['latin'] })

export const viewport = {
  themeColor: "none",
  userScalable: 'no'
}

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {

  return (
    <GlobalContext>
      <html lang="en" className=' dark'>
        
        <body className="flex bg-lightBg1 dark:bg-darkBg1 overflow-hiddenk">
          <Navbar />

          <Main>
            <div className='flex flex-col w-full h-full'>
              <Header />

              {children}
            </div>
          </Main>

          <LandingPage />

          <div id='themeSlider' className='fixed w-full h-full top-0 hidden translate-x-full z-40'></div>

          <Script src="https://accounts.google.com/gsi/client" async />
          <Script src='/scripts/setThemeColor.js' />
        </body>
      </html>
    </GlobalContext>
  )
}

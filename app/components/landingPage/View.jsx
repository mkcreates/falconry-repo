"use client"

import changeTheme from "@/lib/changeTheme"
import { useEffect, useState } from "react"
import Slider from "react-slick"
import Image from "next/image"
import { useGlobalContext } from "@/lib/globalContext"
import gsap from "gsap"

// components
import Badge from "../ui/Badge"
import Button from "../ui/Button"
import { ArrowRight, Moon, Sun, TwitterLogo, X } from "@phosphor-icons/react"

// assets
import LogoDark from '@/assets/img/logo_dark.svg'
import LogoLight from '@/assets/img/logo_light.svg'
import falconryFeatures from "@/lib/falconryFeatures"


const LandingPage = ({ showLannding }) => {
    const { setAbout } = useGlobalContext()
    const [themeIcon, setThemeIcon] = useState(null) // state to toggle theme icon

    // slick-react options
    const slider = {
        dots: true,
        infinite: true,
        speed: 800,
        slideToShow: 1,
        slideToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    }

    const features = falconryFeatures.slice(0, 5).concat({
        text: "And More!",
        img: "/img/features/6.png"
    })

    const closeLandingPage = () => {
        // animate component out
        window.landingPageAnim.reverse().timeScale(-1.5)
    }

    useEffect(() => {
        // animate notice in
        window.landingPageAnim = gsap.to("#con3", {translateY: 1, duration: 1, ease: "back.out(1.5)",
            onReverseComplete: () => { // after reverse, close component
                sessionStorage.landing = '1'
                showLannding(false)
                setAbout(false)
            }
        })
    }, [])

    return (
        <>
            <div className='cons bg-lightBg1 dark:bg-darkBg1'></div>

            <div className="cons bg"></div>

            <div id="con3" className="cons overflow-y-auto pb-20 translate-y-full">
                <div className="centercon">

                    <div className="headland">
                        <Image src={LogoDark} alt='Falconry Logo' className='hidden dark:block w-full' />
                        <Image src={LogoLight} alt='Falconry Logo' className='dark:hidden w-full' />

                        <div>
                            <Badge
                                type='badge2'
                                className='th mr-2'
                                onClick={() => changeTheme(setThemeIcon)}
                            >
                                {themeIcon == 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </Badge>

                            <Badge
                                type='badge2'
                                onClick={closeLandingPage}
                                className='bg-transparent'
                            >
                                <X size={20} />
                            </Badge>
                        </div>
                    </div>


                    <div className="falconbio">
                        <p className="text-sm font-bold">Introducing, Falconry!</p>
                        <p className="text-base">
                            A highly performant RSS reader that combines stunning aesthetics with powerful features. Immerse yourself in its beautiful and elegant UI, effortlessly organizing feeds and exploring articles. Add feeds from any RSS link or discover from a curated list, and showcase your interests with a public profile. Falconry ensures a seamless user experience with daily auto-updated articles, making it the ultimate Falcon for your news hunting.
                            <TwitterLogo weight="fill" className="inline ml-2 -mt-1" />
                        </p>

                        <Button type='button2' onClick={closeLandingPage}>
                            Continue <ArrowRight size={20} className="ml-3" />
                        </Button>
                    </div>


                    <div className="slider">
                        <p className="key">Some Key Features</p>
                        <Slider {...slider}>
                            {features.map((feature,i) => (
                                <div key={i} className="imgcon">
                                    <p className="feature">{feature.text}</p>
                                    <div className="imghold">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-full relative" viewBox="0 0 16 9"></svg>
                                        <Image src={feature.img} fill alt='Falconry' quality={95} />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>

                </div>
            </div>

            
        </>
    )
}
 
export default LandingPage
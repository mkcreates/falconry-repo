"use client"

// modules
import feedScroll from '@/lib/feedIsScrolled'
import falconryFeatures from '@/lib/falconryFeatures'

// icons
import { CheckSquare } from "@phosphor-icons/react/dist/ssr"

const SignupLayout = ({ children, mode }) => {
    return (
        <div
            className="grow overflow-y-auto pt-3 pb-6"
            onScroll={(event) => feedScroll(event)}
        >

            <div
                className="signup"
                style={{height: mode === 'signup' ? '34rem' : '33rem'}}
            >

                <div className="description">
                    Falconry: Your sleek RSS reader. Beautiful UI, easy feed organization, and daily updates. Elevate your news experience.
                </div>

                <div className="bottom">
                    <div className="form-con">
                        {children}
                    </div>

                    <div className="features">
                        <h1>Key Features</h1>
                        {falconryFeatures.map((ft, i) => (
                            <p key={i}>
                                <CheckSquare className="mr-2" /> {ft.text}
                            </p>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    )
}
 
export default SignupLayout
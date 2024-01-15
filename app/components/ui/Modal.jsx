// modules
import { useEffect, useRef } from "react"
import gsap from 'gsap'

// components
import { X } from "@phosphor-icons/react"
import Badge from "./Badge"

const Modal = ({children, title, closer, className}) => {
    // element references
    const backdrop = useRef(null)
    const dialog = useRef(null)

    const closeModal = () => {
        // animate modal out
        window.modalAnimate.reverse().timeScale(-2)
    }

    useEffect(() => {
        // animate modal in
        window.modalAnimate = gsap.timeline({ defaults: { ease: "linear", delay: 0, yoyo: true },
            onReverseComplete: () => { // after reverse, close modal
                closer(false)
            }
        })
        .to(backdrop.current, { scale: 25, opacity: 1, duration: 0.4 })
        .to(dialog.current, { opacity: 1, scale: 1, duration: 0.2 }, '-=0.2')
    }, [])

    return ( 
        <div className="modal">
            <div
                onClick={closeModal}
                ref={backdrop}
                className="backdrop"
            ></div>

            <div
                className={"dialog "+className}
                ref={dialog}
            >
                <div className="heading">
                    <span>{title}</span>
                    <Badge onClick={closeModal}>
                        <X size={17} />
                    </Badge>
                </div>

                <div className="body">
                    {children}
                </div>
            </div>
        </div>
    )
}
 
export default Modal
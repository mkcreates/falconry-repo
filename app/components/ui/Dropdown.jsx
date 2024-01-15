"use client"

// modules
import { createContext, useContext, useEffect, useRef } from 'react'
import gsap from 'gsap'

// assets
import "@/assets/css/ui_components/dropdown.module.css"

const DropdownContext = createContext()

const Dropdown = ({children, position, trigger, hideOnClick, className, submit, onClick, height}) => {
    const dropdownRef = useRef(null)

    useEffect(() => {
        // define dropdown trigger from prop: hover | click
        trigger = trigger ?? 'hover' // set trigger event to hover by default
        const eventTrigger = {
            enter: String,
            leave: String
        }

        if (trigger === 'hover') {
            // check if device is a mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

            if (isMobile) { // if true, set event to focus(click) instead
                eventTrigger.enter = 'focus'
                eventTrigger.leave = 'blur'
            } else { // if false, set to mouseenter(hover)
                eventTrigger.enter = 'mouseenter'
                eventTrigger.leave = 'mouseleave'
            }
        }

        if (trigger === 'click') {
            eventTrigger.enter = 'focus'
            eventTrigger.leave = 'mouseleave'
        }

        if (trigger === 'clickStay') {
            eventTrigger.enter = 'focus'
            eventTrigger.leave = 'blur'
        }

        // get dropdown references
        const dropdown = dropdownRef.current
        const dropdownContent = dropdown.querySelector('.content')
        const contentHeight = height ? height : dropdownContent.children[0].offsetHeight // height of dropdown content
        const animationOptions = {
            duration: 0.2,
            ease: "linear"
        }

        // handle dropdown animation
        const animate = (time) => {
            gsap.to(dropdownContent, {
                maxHeight: time === 'enter' ? contentHeight : 0,
                ...animationOptions
            })

            // animate caret icon
            const caretIcon = dropdown.querySelector('.default svg')
            if (caretIcon != null) dropdown.querySelector('.default svg').style.transform = time === 'enter' ? 'rotate(180deg)' : 'rotate(0deg)'
            
            // animation is leaving, blur button to hide dropdown
            if (time === 'leave') dropdown.blur()
        }

        // handle entering
        dropdown.addEventListener(eventTrigger.enter, () => {
            animate('enter')
        })

        // handle leaving
        dropdown.addEventListener(eventTrigger.leave, () => {
            animate('leave')
        })

        // should the dropdown hide when items clicked? get 'hideOnClick' prop
        if ((hideOnClick ?? true) === true) {
            dropdownContent.querySelectorAll('.item').forEach(item => {
                item.addEventListener('click', () => {
                    animate('leave')
                })
            }) 
        }
    })

    return (
        // pass dropdown props to child components
        <DropdownContext.Provider value={{position, submit}}>
            <button
                className={"group dropdown "+(className ?? '')}
                ref={dropdownRef}
                type={submit ? 'submit' : 'button'}
                onClick={onClick}
            >
                {children}
            </button>
        </DropdownContext.Provider>
    )
}

const DropdownContent = ({children, className}) => {
    // get dropdown options from context
    const options = useContext(DropdownContext)

    const dropdownPosition = options.position === 'left' ? 'right-0' : 'left-0'

    return (
        <div
            className={
                dropdownPosition
                +" content "
                +(className ?? '')
            }
        >
            <div className="inner">
                {children}
            </div>
        </div>
    )
}

const DropdownItem = ({children, active, keyValue, value, onClick}) => {
    const isActive = active ? ' active' : ''

    return (
        <div
            className={"item"+isActive}
            key={keyValue}
            value={value}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
 
export { Dropdown, DropdownContent, DropdownItem }
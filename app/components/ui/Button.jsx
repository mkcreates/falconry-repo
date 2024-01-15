"use client"

// modules
import useWave from "use-wave"

const Button = ({children, className, id, type, size, onClick, submit, disabled}) => {
    const buttonType = type ?? 'button1' // button1 | button2 | button3
    const buttonSize = size // small
    const otherClasses = className ?? '' // other custom classes
    const wave = useWave() // init wave on click
    
    return (
        <button
            ref={wave}
            className={buttonType+" "+buttonSize+" "+otherClasses+" button"}
            id={id}
            onClick={onClick}
            type={submit ? 'submit' : 'button'}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
 
export default Button
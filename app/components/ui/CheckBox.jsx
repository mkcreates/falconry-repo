"use client"

// modules
import { useEffect, useState } from "react"

// icons
import { CheckCircle } from "@phosphor-icons/react"

const CheckBox = ({
    className, label, id, onChange, checked
}) => {
    const [isChecked, setCheck] = useState(false)
    const otherClasses = className ?? '' // other custom classes

    useEffect(() => {
        checked ? setCheck(true) : setCheck(false)
    }, [])

    return (
        <div className={"check flex items-center text-black/80 dark:text-white/70 "+otherClasses}>
            <input
                onChange={(e) => { setCheck(!isChecked); onChange(e) }}
                type="checkbox"
                id={id}
                className="hidden"
                checked={checked}
            />
            <label
                className="inline-flex items-center text-sm cursor-pointer"
                htmlFor={id}
            >
                <CheckCircle
                    size={21}
                    weight={isChecked ? 'fill' : 'regular'}
                    className="mr-1 shrink-0"
                />
                <span>{label}</span>
            </label>
        </div>
    )
}
 
export default CheckBox
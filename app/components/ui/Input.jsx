"use client"

import { Eye, EyeSlash } from "@phosphor-icons/react"
import { useState } from "react"

const Input = ({
    className, type, label, defaultValue, placeholder, icon, iconPosition, icon2, noLabel, onChange, required
}) => {
    const otherClasses = className ?? '' // other custom classes
    const [inputType, setType] = useState(type)

    return (
        <div className={"input "+otherClasses}>
            {noLabel ?? <label htmlFor="input">{label}</label>}
            <div className="con">
                {icon2 && icon2}
                {iconPosition === 'left' && icon}
                <div className="input-con">
                    <input
                        type={inputType ?? 'text'}
                        id="input"
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={onChange}
                        required={required}
                    />
                </div>
                {iconPosition === 'right' && icon}

                {type === 'password' && (
                    <span
                        className='ml-2 cursor-pointer'
                        onClick={() => setType(inputType === 'password' ? 'text' : 'password')}
                    >
                        {inputType === 'password' ? <Eye size={20} /> : <EyeSlash size={20} />}
                    </span>
                )}
            </div>
        </div>
    )
}
 
export default Input
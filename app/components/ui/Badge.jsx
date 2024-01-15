"use client"

// modules
import useWave from "use-wave"

// assets
import "@/assets/css/ui_components/badge.module.css"

const Badge = ({children, type, onClick, className}) => {
    const badgeType = type ?? 'badge1' // badge1 | badge2
    const wave = useWave() // init wave on click

    return (
        <div
            className={badgeType+" badge "+className}
            ref={wave}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
 
export default Badge;
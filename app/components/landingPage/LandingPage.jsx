"use client"

import { useEffect, useState } from "react"
import View from "./View"
import { useParams } from "next/navigation"
import { useGlobalContext } from "@/lib/globalContext"

const LandingPage = () => {
    const { about } = useGlobalContext()
    const [landing, showLannding] = useState(false)
    const params = useParams()

    useEffect(() => {
        if (!('landing' in sessionStorage) && !params.post && !params.user) {
            showLannding(true)
        }
    }, [])

    return (
        <>
            {(about || landing) && <View showLannding={showLannding} />}
        </>
    )
}
 
export default LandingPage
import { CircleNotch } from "@phosphor-icons/react/dist/ssr"

const Loading = () => {
    return (
        <div className="flex justify-center text-black/60 dark:text-white/60 pt-7">
            <CircleNotch size={40} className="animate-spin" />
        </div>
    )
}
 
export default Loading
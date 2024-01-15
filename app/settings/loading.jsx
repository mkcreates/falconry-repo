import { CircleNotch } from "@phosphor-icons/react/dist/ssr"

const Loading = () => {
    return (
        <div className="flex items-center justify-between text-black/60 dark:text-white/70">
            <span className="text-sm">Loading...</span>
            <CircleNotch size={21} className="animate-spin" />
        </div>
    )
}
 
export default Loading
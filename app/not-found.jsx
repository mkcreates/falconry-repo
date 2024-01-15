export const dynamic = 'force-dynamic'

const NotFound = () => {
    return (
        <div className="grow w-full overflow-y-auto py-7">
            <div className="w-full max-w-md mx-auto h-full flex items-center px-4 xs:px-6">
                <img src="/img/notFound.svg" className="w-full rounded-2xl shadow-lg grayscale dark:grayscale-0" alt="notFound_Falconry" />
            </div>
        </div>
    )
}
 
export default NotFound
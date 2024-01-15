import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import getCookie from './getCookieClient'

/*  Verify authentication by checking if token cookie is set
    arguments:
        isAuth (true or false): if true, the user must be authenticated/signed in
                                if false, the user must not be authenticated/signed in
        path: the url/page to redirect to
*/

const Authenticated = (isAuth, path) => {
    const router = useRouter()

    useEffect(() => {
        const token = getCookie('F_Token')

        if (isAuth) {
            // if the user must be signed in, and token not set, redirect
            if (token === null) router.push(path)
        }
        else {
            // if the user must not be signed in, and token set, redirect
            if (token !== null) router.push(path)
        }
    }, [])
}

export default Authenticated
// module for setting cookie
const setCookie = (response, name, value, remember = true, httpOnly) => {
    const expiryDate = remember ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
    response.cookies.set(
        name,
        value,
        {
            expires: expiryDate,
            secure: process.env.ENVIRONMENT === 'production',
            httpOnly: httpOnly
        }
    )
}

export default setCookie
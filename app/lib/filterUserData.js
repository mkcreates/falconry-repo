const filterData = (user) => {
    // filter only needed user data
    return {
        username: user.username,
        email: user.email,
        preference: user.preference,
        verified: user.verified,
        dataCollection: user.dataCollection
    }
}

export default filterData
const cheerio = require("cheerio")
import got from 'got'

const getWebsiteInfo = async(url) => {
    try {
        // fetch html content using got and parse the body to cheerio
        const response = await got.get(url)
        const $ = cheerio.load(response.body)

        // get website favicon URL
        const faviconPath = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || $('link[rel="apple-touch-icon"]').attr('href') || $('link[rel="apple-touch-icon-precomposed"]').attr('href') || $('link[rel="mask-icon"]').attr('href') || $('meta[name="msapplication-TileImage"]').attr('content')
        let iconURL = faviconPath.startsWith('/') ? url+faviconPath : faviconPath

        // check if icon is valid
        const iconValid = await got.head(iconURL)

        // if invalid -> returns error, set iconURL to null
        if (iconValid.statusCode >= 400) iconURL = null

        // if content header doesnt indicate an image
        if (!iconValid.headers['content-type'].startsWith('image/')) iconURL = null

        // get website title
        const pageTitle = $('title').text()
        
        return { iconURL, pageTitle }
    } catch (error) {
        return false
    }
}

export default getWebsiteInfo
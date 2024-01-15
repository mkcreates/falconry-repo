import { NextResponse } from "next/server"
import { object, string, required, min, label, url } from 'yup'
import connectDB, { closeDB } from "@/database/db"
import tokenNotVerified from "@/lib/verifyToken"
import getWebsiteInfo from "@/lib/getWebsiteInfo"
import { decrypt } from "@/lib/encrypt"
import { cookies } from 'next/headers'
import Feed from "@/database/models/feedModel"
const rssParser = require('rss-parser')


export async function POST(request) {
    // get request payload
    const { feed, category, isPublic } = await request.json()


    // set validation schema
    const formSchema = object({
        feed: string().label('Feed Link').url('Feed Link must be a valid URL (prefixed with http:// or https://)').required().min(2),
        category: string().label('Category').required()
    })

    await connectDB()

    try {
        await formSchema.validate({feed: feed, category: category}, { abortEarly: false })

        /* verify user token */
        if (tokenNotVerified()) {
            return NextResponse.json({unexpectedError: 'Unauthorized'}, {status: 401})
        }

        // get user ID from session
        const FSession = cookies().get('F_Session').value
        const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

        
        // init some neede variables
        let icon = null
        let title = null

        let parser = new rssParser()
        let fetchFeed

        try {
            fetchFeed = await parser.parseURL(feed)
        } catch (error) {
            return NextResponse.json({unexpectedError: 'Unable to fetch feed. Please check link..'}, {status: 200})
        }

        // check if user already follows feed
        const findFeed = await Feed.findOne({
            user: userId,
            $or: [ {link: fetchFeed.feedUrl}, {link: feed} ]
        })

        if (findFeed) {
            // if feed exist return error
            return NextResponse.json({unexpectedError: 'Feed already exists.'}, {status: 200})
        }


        // get website icon
        const getInfo = await getWebsiteInfo(fetchFeed.link ?? feed)

        if (getInfo.iconURL) {
            icon = getInfo.iconURL
            title = getInfo.pageTitle
        }
        else{
            // if previous fetch couldnt get the site icon, try again with direct feed link
            const getInfoAgain = await getWebsiteInfo(fetchFeed.feedUrl ?? feed)
            icon = getInfoAgain.iconURL
            title = getInfo.pageTitle ?? getInfoAgain.pageTitle
        }

        /* add feed item to db */
        const createFeed = new Feed({
            name: fetchFeed.title ?? title,
            link: fetchFeed.feedUrl ?? feed,
            icon: icon,
            isPublic: isPublic,
            category: category,
            website: fetchFeed.link,
            user: userId,
            lastBuildDate: (fetchFeed.lastBuildDate || fetchFeed.items[0].isoDate) ?? null
        })

        try{
            const savedFeed = await createFeed.save()

            return NextResponse.json({feed: {
                _id: savedFeed._id,
                name: savedFeed.name ?? savedFeed.link,
                link: savedFeed.link,
                icon: savedFeed.icon,
                category: savedFeed.category,
                isPublic: savedFeed.isPublic,
                updatedAt: savedFeed.updatedAt,
            }}, {status: 201}) 
        }
        catch (error) {
            const errorMsg = error.code === 11000 ? 'Feed already exists.' : 'Something went wrong. Try again.'
            return NextResponse.json({unexpectedError: errorMsg}, {status: 200})
        }

    }
    catch (error) {
        let validationErrors = {
            errorCount: 0
        }

        error.inner.forEach((err, index) => {
            validationErrors[err.path] = err.message.charAt(0).toUpperCase() + err.message.slice(1)
            validationErrors.errorCount = index + 1
        })

        return NextResponse.json({error: validationErrors}, {status: 200})
    }

    closeDB()
}
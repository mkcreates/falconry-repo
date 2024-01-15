import { NextResponse } from "next/server"
import { object, string, required, min, max, label } from 'yup'
import { decrypt } from "@/lib/encrypt"
import connectDB, { closeDB } from "@/database/db"
import Category from "@/database/models/categoryModel"
import { cookies } from 'next/headers'
import tokenNotVerified from "@/lib/verifyToken"


export async function GET(request) {
    let userId
    
    if (cookies().has('F_Token')) { // token set, user signed in
        // get user ID from session
        const FSession = cookies().get('F_Session').value
        userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)
    } else {
        // fetch category from predefined user
       userId = process.env.NEXT_PUBLIC_USER
    }

    await connectDB()

    try {
        const fetchCategories = await Category.find({user: userId}).sort({ updatedAt: -1 }).select('_id name updatedAt')

        // if save is success
        return NextResponse.json(fetchCategories, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }

    closeDB()
}


export async function POST(request) {
    // get request payload
    const { category } = await request.json()

    // set validation schema
    const categorySchema = object({
        category: string().label('Category Name').required().min(1).max(25).matches(/^[a-zA-Z0-9 ]+$/, 'Category Name can only contain letters, numbers and spaces.')
    })

    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    try {
        await categorySchema.validate({category: category}, { abortEarly: false })

        const categoryExists = await Category.findOne({user: userId, name: category})
        
        if (categoryExists) {
            // category must not exists
            return NextResponse.json({error: 'Category Name already exists.', category: {_id: categoryExists._id}}, {status: 200})
        }

        const categoryObj = new Category({
            user: userId,
            name: category
        })

        try {
            const savedCat = await categoryObj.save()

            // if save is success
            return NextResponse.json(
                { category:
                    {
                        name: savedCat.name,
                        _id: savedCat._id.toString(),
                        updatedAt: savedCat.updatedAt
                    }
                },
                {status: 201}
            )
        } catch (error) {
            return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
        }  
    }
    catch (error) {
        return NextResponse.json({error: error.inner && error.inner[0].message}, {status: 200})
    }

    closeDB()
}


export async function PATCH(request) {
    // get request payload
    const { category, catId } = await request.json()

    // set validation schema
    const categorySchema = object({
        category: string().label('Category Name').required().min(1).max(25).matches(/^[a-zA-Z0-9 ]+$/, 'Category Name can only contain letters, numbers and spaces.')
    })

    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    try {
        await categorySchema.validate({category: category}, { abortEarly: false })

        const categoryExists = await Category.findOne({user: userId, name: category})

        if (categoryExists) {
            // category must not exists
            return NextResponse.json({error: 'Category Name already exists.'}, {status: 200})
        }

        try {
            const updatedCat = await Category.findOneAndUpdate(
                { user: userId, _id: catId },
                {
                    $set: { name: category },
                    $currentDate: { updatedAt: true }
                },
                { new: true }
            ).select('_id name updatedAt')

            // if update is success
            return NextResponse.json({ category: updatedCat }, {status: 201})
        } catch (error) {
            return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
        }  
    }
    catch (error) {
        return NextResponse.json({error: error.inner && error.inner[0].message}, {status: 200})
    }

    closeDB()
}


export async function DELETE(request) {
    // get request payload
    const { catId } = await request.json()
    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    try {
        const deletedCat = await Category.findByIdAndDelete({ user: userId, _id: catId }).select('_id name updatedAt')

        // if delete is success
        return NextResponse.json(deletedCat, {status: 201})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }

    closeDB()
}
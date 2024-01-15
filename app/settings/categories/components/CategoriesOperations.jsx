"use client"

// modules
import { useGlobalContext } from '@/lib/globalContext'
import { useState } from 'react'

// components
import Badge from "@/components/ui/Badge"
import Input from "@/components/ui/Input"
import EditCategoriesList from "./EditCategoriesList"
import FeedCategorySkeleton from '../../components/FeedCategorySkeleton'

// icons
import { Gear, Plus, SpinnerGap } from "@phosphor-icons/react"

const CategoriesOperations = () => {
    const { user, categories, setCategories } = useGlobalContext()
    const [category, setCategory] = useState('')
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)

    const submitForm = async e => {
        e.preventDefault()
        setLoading(true)

        const req = await fetch('/api/category', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({category: category})
        })

        setLoading(false)

        // clear errors
        setErrors(null)

        const response = await req.json()

        if (response.error) {
            // encountered error
            setErrors(response.error)
        }
        else {
            // clear category input
            e.target.querySelector('input').value = ''

            // update global category list
            setCategories([response.category, ...categories])
        }
    }

    return (
        <>
            {user?.signedIn ?
                <>
                    <div className='heading mb-5'>
                        <Gear size={16} className='mr-2' /> Settings: Categories
                    </div>

                    {errors && (
                        <div className="errorHead w-fit mb-2">{errors}</div>
                    )}

                    <form onSubmit={submitForm}>
                        <Input
                            className='grow mb-5' 
                            label="Category Name"
                            placeholder="e.g Entertainment"
                            icon={
                                <button className="mb-1" disabled={loading ? true : false}>
                                    {loading ?
                                        <SpinnerGap size={18} className="loader animate-spin" />
                                    :
                                        <Badge type='bordered'>
                                            <Plus size={16} />
                                        </Badge>
                                    }
                                </button>
                            }
                            iconPosition='right'
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </form>

                    <EditCategoriesList />
                </>
            :
                <FeedCategorySkeleton />
            }
        </>
    )
}
 
export default CategoriesOperations
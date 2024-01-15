"use client"

// modules
import { useRef, useState } from 'react'
import Tippy from '@tippyjs/react'
import { useGlobalContext } from '@/lib/globalContext'

// components
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Dropdown, DropdownContent, DropdownItem } from '@/components/ui/Dropdown'

// icons
import { SpinnerGap, Trash } from '@phosphor-icons/react'

const EditCategoriesList = () => {
    const { categories, setCategories } = useGlobalContext()
    const [errors, setErrors] = useState(null)
    const [currentError, setCurrentError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [currentSuccess, setCurrentSuccess] = useState(null)
    const [loading, setLoading] = useState(null)
    const listTop = useRef(null)


    const changeCategory = async (name, id) => {
        if (loading) return
        
        setLoading(id)

        const req = await fetch('/api/category', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({category: name, catId: id})
        })

        setLoading(null)

        // clear errors & success
        setErrors(null)
        setSuccess(null)

        const response = await req.json()

        if (response.error) {
            // encountered error
            setErrors(response.error)

            // show error on current item in list
            setCurrentError(id)
        }
        else {
            const newCat = [...categories] // spread global categories
            // get the index of category in focus
            const index = categories.findIndex(cat => cat._id === id)
            // change object value by gotten index
            newCat[index] = response.category

            // resort categories bringing newest first
            const sortedCat = newCat.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
 
            // update global category list
            setCategories(sortedCat)

            setSuccess('Category Updated!')
            setCurrentSuccess(id)
            // scroll page to top to see error
            listTop.current.scrollIntoView()
        }
    }


    const deleteCategory = async (id) => {
        if (loading) return

        setLoading(id)

        const req = await fetch('/api/category', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ catId: id })
        })

        setLoading(null)

        // clear errors & success
        setErrors(null)
        setSuccess(null)

        const response = await req.json()

        if (response.error) {
            // encountered error
            setErrors(response.error)
        }
        else {
            // filter out removed category
            let filteredCat = categories.filter(cat => cat._id !== id)
            setCategories(filteredCat)

            setSuccess('Category Deleted!')
        }
    }

    return (
        <div className='feedlist'>
            <div className='head lighter'>
                Categories {loading && <SpinnerGap size={16} className='animate-spin ml-2 inline' />}
            </div>


            <div className='items-con' ref={listTop}>
                {categories.map((cat, index) => {
                    let catValue = cat.name

                    return (
                        <div className='items' key={index}>
                            <div className='infos'>
                                <div className='inputcon'>
                                    <div
                                        type="text"
                                        className='edit'
                                        contentEditable
                                        onInput={(e) => catValue = e.target.innerText}
                                    >{cat.name}</div>

                                    {currentError === cat._id && (
                                        <div className="err">{errors}</div>
                                    )}
                                    {currentSuccess === cat._id && (
                                        <div className="succ">{success}</div>
                                    )}
                                </div>
                            </div>

                            <div className='actions'>
                                {loading === cat._id && (
                                    <div><SpinnerGap size={20} className="loader animate-spin mr-1 dark:text-white/80" /></div>
                                )}

                                <Button
                                    type='button1'
                                    size='small'
                                    disabled={loading === cat._id}
                                    onClick={()=> changeCategory(catValue, cat._id)}
                                >Save</Button>

                                <Dropdown
                                    position='left'
                                    trigger='clickStay'
                                    hideOnClick
                                >
                                    <Tippy content='Delete'>
                                        <span>
                                            <Badge type='bordered'>
                                                <Trash size={16} />
                                            </Badge>
                                        </span>
                                    </Tippy>

                                    <DropdownContent>
                                        <DropdownItem onClick={()=> deleteCategory(cat._id)}>Yes</DropdownItem>
                                        <DropdownItem>No</DropdownItem>
                                    </DropdownContent>
                                </Dropdown>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
 
export default EditCategoriesList
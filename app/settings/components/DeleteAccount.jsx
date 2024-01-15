"use client"

// modules
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalContext } from '@/lib/globalContext'

// components
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

// icons
import { SpinnerGap, Trash } from '@phosphor-icons/react'

const DeleteAccount = () => {
    const { setUser } = useGlobalContext()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    
    const deleteAccount = async e => {
        setLoading(true)

        const req = await fetch('/api/deleteAccount', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password: password})
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
            // if deleted
            setLoading(true) // show loading before redirect
            setUser({}) // set global user data to empty
            router.push('/') // redirect home
        }
    }

    return (
        <>
            <Button
                onClick={() => setConfirmDelete(true)}
                type='danger'
            >
                <Trash size={15} className='mr-2' /> Delete Account
            </Button>

            {confirmDelete && (
                <Modal
                    title='Confirm Delete'
                    closer={setConfirmDelete}
                >   
                    <form className='px-1'>
                        <div className='text-sm text-black/50 dark:text-white/60 mb-4'>
                            Type in your password to delete your account.
                        </div>

                        {errors && (
                            <div className="errorHead w-fit mb-4">{errors}</div>
                        )}
                        
                        <Input
                            className='mb-4'
                            type='password'
                            noLabel
                            placeholder="******"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type='button2'
                            className='w-full'
                            onClick={deleteAccount}
                            disabled={loading ? true : false}
                        >
                            Delete {loading && <SpinnerGap size={15} className="loader" />}
                        </Button>
                    </form>
                </Modal>
            )}
        </>
    )
}
 
export default DeleteAccount
"use client"

// modules
import { useState } from 'react'
import { useImmer } from 'use-immer'

// components
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

// icons
import { CaretDown, SpinnerGap } from '@phosphor-icons/react'

const ChangePassword = () => {
    const [showForm, toggleForm] = useState(false)
    const [form, setForm] = useImmer({})
    const [errors, setErrors] = useState(null)
    const [unexpected, setUnexpected] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

    const updateForm = (e, input) => {
        setForm(data => {
            data[input] = e.target.value
        })
    }

    const submitForm = async e => {
        e.preventDefault()
        setLoading(true)

        const req = await fetch('/api/changePassword', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })

        setLoading(false)

        // clear errors & success
        setErrors(null)
        setUnexpected(null)
        setSuccess(null)

        const response = await req.json()

        if (response.error) {
            // encountered error
            setErrors(response.error)
        } 
        else if (response.unexpected) {
            // encountered other errors
            setUnexpected(response.unexpected)
        }
        else {
            setSuccess(response.success)
        }
    }

    return (
        <form className='mb-10' onSubmit={submitForm}>
            <div
                onClick={() => toggleForm(!showForm)}
                className='flex items-center text mb-1 font-semibold cursor-pointer'
            >
                Change Password
                <CaretDown size={17} className={'ml-1 '+(showForm ?? 'rotate-180')} />
            </div>

            <div
                className={'max-h-0 duration-500 ease-in overflow-hidden '+(showForm && 'max-h-[630px]')}
            >
                {errors && (
                    <div className="errorHead w-fit mb-1 mt-2">
                        You have <strong>{errors.errorCount}</strong> errors in your form.
                    </div>
                )}
                
                {unexpected && (
                    <div className="errorHead w-fit mb-1 mt-2">{unexpected}</div>
                )}

                <div className='mb-3'>
                    <Input
                        type='password'
                        label="Current Password"
                        onChange={(e) => updateForm(e, 'currentPassword')}
                    />
                    {errors?.currentPassword && <span className="errors">{errors.currentPassword}</span>}
                </div>

                <div className='mb-3'>
                    <Input
                        type='password'
                        label="New Password"
                        onChange={(e) => updateForm(e, 'password')}
                    />
                    {errors?.password && <span className="errors">{errors.password}</span>}
                </div>

                <div className='mb-3'>
                    <Input
                        type='password'
                        label="Confirm Password"
                        onChange={(e) => updateForm(e, 'confirmPassword')}
                    />
                    {errors?.confirmPassword && <span className="errors">{errors.confirmPassword}</span>}
                </div>

                <div className='flex justify-between items-center'>
                    <Button
                        type='button3'
                        className='order-2 sm:order-1'
                        submit
                        disabled={loading ? true : false}
                    >
                        Change
                        {loading && <SpinnerGap size={15} className="loader" />}
                    </Button>

                    {success && (
                        <div className="successHead order-1 sm:order-2 mb-0">{success}</div>
                    )}
                </div>
            </div>
        </form>
    )
}
 
export default ChangePassword
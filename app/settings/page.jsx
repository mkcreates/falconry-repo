"use client"

// modules
import { useGlobalContext } from '@/lib/globalContext'

// components
import ChangePassword from './components/ChangePassword'
import AccountForm from './components/AccountForm'
import DeleteAccount from './components/DeleteAccount'
import SettingsHomeSkeleton from './components/SettingsHomeSkeleton'

const SettingsHome = () => {
    const { user } = useGlobalContext()

    return (
        <>
            {user?.signedIn ?
                <div>
                    <AccountForm />

                    <ChangePassword />

                    <DeleteAccount />
                </div>
            :
                <SettingsHomeSkeleton />
            }
        </>
    )
}
 
export default SettingsHome
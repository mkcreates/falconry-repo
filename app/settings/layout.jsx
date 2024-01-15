// components
import SettingsNav from "./components/SettingsNav"
import SettingsPagesLayout from "./components/SettingsPagesLayout"

// define meta data
export const metadata = {
    title: process.env.APP_NAME + ' : Settings',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
    return (
        <div id='settings'>

            <SettingsNav />

            <SettingsPagesLayout>
                {children}
            </SettingsPagesLayout>

        </div>
    )
}
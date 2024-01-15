// components
import SignupLayout from "@/components/auth/SignupLayout"

// define meta data
export const metadata = {
    title: process.env.APP_NAME + ' : Sign Up'
}


export default function RootLayout({ children }) {
  return (
    <SignupLayout mode='signup'>
        {children}
    </SignupLayout>
  )
}

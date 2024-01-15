// components
import SignupLayout from "@/components/auth/SignupLayout"

// define meta data
export const metadata = {
    title: process.env.APP_NAME + ' : Login',
}

export default function RootLayout({ children }) {
  return (
    <SignupLayout>
        {children}
    </SignupLayout>
  )
}

import Script from "next/script"
import Contents from "./contents"

// define global meta data
export const metadata = {
  title: process.env.APP_NAME + ' - RSS Reader',
  description: 'Falconry: Your sleek RSS reader. Beautiful UI, easy feed organization, and daily updates. Elevate your news experience.',
  language: 'English',
  openGraph: {
    images: '/openGraph.png'
  },
  referrer: 'origin-when-cross-origin'
}

export default function Home() {

  return (
    <>
      <Contents />
      <Script src="https://accounts.google.com/gsi/client" async defer />
    </>
  )
}

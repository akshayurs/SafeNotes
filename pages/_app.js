import '../styles/globals.css'
import Script from 'next/script'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-NNKV85BRMQ"
      ></Script>
      <Script id="analytics">
        {`
            window.dataLayer = window.dataLayer || []; function gtag()
            {dataLayer.push(arguments)}
            gtag('js', new Date()); gtag('config', 'G-NNKV85BRMQ')
            `}
      </Script>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

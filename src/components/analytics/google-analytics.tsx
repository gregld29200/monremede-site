'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const COOKIE_CONSENT_KEY = 'cookie-consent'

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has accepted cookies
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted'
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasConsent(consent)
  }, [])

  // Don't render during SSR, if no measurement ID, or no consent
  if (hasConsent === null || !GA_MEASUREMENT_ID || !hasConsent) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  )
}

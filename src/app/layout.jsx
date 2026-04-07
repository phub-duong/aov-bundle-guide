import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { TocFeedback } from '../components/TocFeedback'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://bundle.aov.ai'),
  title: {
    template: '%s - AOV.ai Bundle Help Center',
    default: 'AOV.ai Bundle Help Center'
  },
  description:
    'Get help with AOV.ai Bundle for Shopify. Browse guides on bundle offers, volume discounts, design customization, analytics, and more.',
  openGraph: {
    title: 'AOV.ai Bundle Help Center',
    description:
      'Get help with AOV.ai Bundle for Shopify. Browse guides on bundle offers, volume discounts, design customization, analytics, and more.',
    url: 'https://bundle.aov.ai',
    siteName: 'AOV.ai Bundle Help Center',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AOV.ai Bundle Help Center'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AOV.ai Bundle Help Center',
    description:
      'Get help with AOV.ai Bundle for Shopify. Browse guides on bundle offers, volume discounts, design customization, analytics, and more.',
    images: ['/images/og-image.jpg']
  }
}

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <span style={{ fontWeight: 700, fontSize: 18 }}>
          AOV.ai Bundle
        </span>
      }
      logoLink="/"
      projectLink="https://apps.shopify.com/aov-bundle-upsell"
      projectIcon={
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      }
    >
      <a
        href="https://bundle.aov.ai"
        target="_blank"
        rel="noopener noreferrer"
        style={{ padding: '0 8px', color: 'currentColor', textDecoration: 'none', fontSize: 14 }}
      >
        Website
      </a>
      <a
        href="mailto:support@aov.ai"
        style={{ padding: '0 8px', color: 'currentColor', textDecoration: 'none', fontSize: 14 }}
      >
        Contact
      </a>
    </Navbar>
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
      </Head>
      <body>
        <Layout
          banner={
            <Banner storageKey="aov-bundle-launch" dismissible>
              <a
                href="/docs/offers/offers-overview"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Explore all bundle offer types — Volume Discount, FBT, Bundle Builder & more →
              </a>
            </Banner>
          }
          navbar={navbar}
          footer={
            <Footer>
              <div style={{ width: '100%' }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.875rem',
                  color: '#5d6167'
                }}>
                  <p style={{ margin: 0 }}>
                    &copy; 2026 AOV.ai Bundle. All rights reserved.
                  </p>
                  <nav style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                  }}>
                    <a href="https://bundle.aov.ai" target="_blank" rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      Website
                    </a>
                    <a href="https://bundle.aov.ai/privacy-policy" target="_blank" rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      Privacy Policy
                    </a>
                    <a href="https://bundle.aov.ai/terms-of-service" target="_blank" rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      Terms of Service
                    </a>
                    <a href="mailto:support@aov.ai"
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      Contact Support
                    </a>
                  </nav>
                </div>
              </div>
            </Footer>
          }
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          editLink={null}
          feedback={{ content: null }}
          toc={{ extraContent: <TocFeedback /> }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

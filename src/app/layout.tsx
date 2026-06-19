import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Karpe Farm Agriculture',
  description: 'Fresh organic produce directly from our farm to your table. 100% natural, sustainable farming practices.',
  keywords: 'farm, organic, vegetables, fruits, agriculture, karpe farm',
  icons: {
    icon: '/images/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body bg-farm-gray-50 min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1a1a1a',
              border: '1px solid #22c55e',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.9rem',
              boxShadow: '0 8px 24px rgba(22,163,74,0.15)',
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        {children}
      </body>
    </html>
  )
}

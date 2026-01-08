import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ProgressProvider } from '@/contexts/ProgressContext'
import OnboardingTour from '@/components/OnboardingTour'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Go Tutorial - TCI',
  description: 'Learn Go with TCI - Interactive 9x9 Go tutorial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <LanguageProvider>
          <ProgressProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pb-24">
                {children}
              </main>
              <Footer />
            </div>
            <OnboardingTour />
          </ProgressProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}






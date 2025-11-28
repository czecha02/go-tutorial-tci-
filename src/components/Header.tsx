'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { getUITranslations } from '@/content/strings'

export default function Header() {
  const { language, setLanguage } = useLanguage()
  const t = getUITranslations(language)
  const pathname = usePathname()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en')
  }

  return (
    <header className="aurora-header">
      <div className="flex items-center space-x-4 w-full relative z-10">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="language-switcher group"
          aria-label="Switch language"
        >
          <span className="language-flag">{language === 'en' ? '🇬🇧' : '🇩🇪'}</span>
          <span className="language-text">{language === 'en' ? 'ENG' : 'DE'}</span>
          <div className="aurora-glow"></div>
        </button>

        <Link href="/" className="text-xl font-bold text-white drop-shadow-lg hover:scale-105 transition-transform">
          {t.goTutorial}
        </Link>
        <nav className="hidden lg:flex flex-col items-center space-y-3 flex-1">
          <div className="text-xs text-white/80 font-semibold tracking-wider uppercase drop-shadow">{t.learningFlow}</div>
          <div className="flex items-center space-x-3 w-full justify-center">
            <Link
              href="/intro"
              className={`aurora-button ${pathname === '/intro' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/intro' ? 'aurora-badge-active' : ''}`}>0</span>
              <span>{t.introduction}</span>
              <div className="aurora-glow"></div>
            </Link>
            <div className="aurora-arrow">→</div>
            <Link
              href="/rules"
              className={`aurora-button ${pathname === '/rules' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/rules' ? 'aurora-badge-active' : ''}`}>1</span>
              <span>{t.placingStonesLiberties}</span>
              <div className="aurora-glow"></div>
            </Link>
            <div className="aurora-arrow">→</div>
            <Link
              href="/capture"
              className={`aurora-button ${pathname === '/capture' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/capture' ? 'aurora-badge-active' : ''}`}>2</span>
              <span>{t.capturing}</span>
              <div className="aurora-glow"></div>
            </Link>
            <div className="aurora-arrow">→</div>
            <Link
              href="/eyes"
              className={`aurora-button ${pathname === '/eyes' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/eyes' ? 'aurora-badge-active' : ''}`}>3</span>
              <span>{t.eyes}</span>
              <div className="aurora-glow"></div>
            </Link>
            <div className="aurora-arrow">→</div>
            <Link
              href="/counting"
              className={`aurora-button ${pathname === '/counting' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/counting' ? 'aurora-badge-active' : ''}`}>4</span>
              <span>{t.counting}</span>
              <div className="aurora-glow"></div>
            </Link>
            <div className="aurora-arrow">→</div>
            <Link
              href="/shapes"
              className={`aurora-button ${pathname === '/shapes' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/shapes' ? 'aurora-badge-active' : ''}`}>5</span>
              <span>{t.shapes}</span>
              <div className="aurora-glow"></div>
            </Link>
            <div className="aurora-arrow">→</div>
            <Link
              href="/atari"
              className={`aurora-button ${pathname === '/atari' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/atari' ? 'aurora-badge-active' : ''}`}>6</span>
              <span>{t.atariGo}</span>
              <div className="aurora-glow"></div>
            </Link>

            <div className="aurora-arrow text-xl mx-1">→</div>

            <Link
              href="/play"
              className={`aurora-button ${pathname === '/play' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/play' ? 'aurora-badge-active' : ''}`}>🤖</span>
              <span>Play BOT</span>
              <div className="aurora-glow"></div>
            </Link>
            <div className="aurora-arrow">→</div>
            <Link
              href="/quiz"
              className={`aurora-button ${pathname === '/quiz' ? 'aurora-button-active' : 'group'}`}
            >
              <span className={`aurora-badge ${pathname === '/quiz' ? 'aurora-badge-active' : ''}`}>★</span>
              <span>{t.quiz}</span>
              <div className="aurora-glow"></div>
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <nav className="lg:hidden flex flex-wrap items-center space-x-2">
          <Link href="/intro" className="aurora-mobile-button">0</Link>
          <Link href="/rules" className="aurora-mobile-button">1</Link>
          <Link href="/capture" className="aurora-mobile-button">2</Link>
          <Link href="/eyes" className="aurora-mobile-button">3</Link>
          <Link href="/counting" className="aurora-mobile-button">4</Link>
          <Link href="/shapes" className="aurora-mobile-button">5</Link>
          <Link href="/atari" className="aurora-mobile-button">6</Link>
          <Link href="/play" className="aurora-mobile-button">🤖</Link>
          <Link href="/quiz" className="aurora-mobile-button">Q</Link>
        </nav>
      </div>
      <div className="flex items-center relative z-10">
        <div className="tci-logo-container">
          <Image
            src="/img/tci-logo.png"
            alt="TCI Logo"
            width={140}
            height={140}
            className="tci-logo"
            priority
          />
        </div>
      </div>
    </header>
  )
}
'use client'

import Link from 'next/link'
import { getLessons, getUITranslations } from '@/content/strings'
import { useLanguage } from '@/contexts/LanguageContext'
import VideoPlayer from '@/components/VideoPlayer'

export default function Home() {
  const { language } = useLanguage()
  const lessons = getLessons(language)
  const t = getUITranslations(language)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Video ganz oben - GRÖßER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-tci-dark mb-4">
          Go Tutorial - Lerne Go in 7 Lektionen
        </h1>
        <VideoPlayer
          videoId="oZTdT8MQexk"
          title="Einführung in Go (5 Minuten)"
          large={true}
        />
        <p className="text-sm text-gray-600 mt-2">
          Schau dir zuerst dieses kurze Video an, um die Grundlagen zu verstehen.
        </p>
      </div>

      {/* Klarer Start-Button */}
      <div className="mb-8 text-center">
        <Link
          href="/intro"
          className="inline-block bg-tci-green text-white text-lg font-bold px-8 py-4 rounded hover:bg-green-600 transition-colors"
        >
          Jetzt starten →
        </Link>
      </div>

      {/* Lektionen - Einfache Liste */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-tci-dark mb-3">
          Lektionen:
        </h2>

        <div className="space-y-2">
          {Object.entries(lessons).map(([key, lesson], index) => (
            <Link
              key={key}
              href={`/${key}`}
              className="block bg-white border border-gray-300 p-4 hover:border-tci-green transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-tci-green text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-tci-dark">
                    {lesson.title}
                  </h3>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Play BOT */}
      <div className="mb-8">
        <Link
          href="/play"
          className="block bg-tci-green text-white p-4 hover:bg-green-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                Gegen Bot spielen
              </h3>
              <p className="text-sm text-green-100">
                Teste dein Wissen in einem echten Spiel
              </p>
            </div>
            <span className="text-xl">→</span>
          </div>
        </Link>
      </div>

    </div>
  )
}

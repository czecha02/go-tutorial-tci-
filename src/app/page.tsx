'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getLessons, getUITranslations } from '@/content/strings'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { language } = useLanguage()
  const lessons = getLessons(language)
  const t = getUITranslations(language)

  return (
    <div className="max-w-8xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="bg-gradient-to-br from-tci-dark to-gray-800 rounded-3xl p-16 shadow-2xl mb-8">
          <div className="flex justify-center mb-8">
            <Image
              src="/img/ChatGPT Image 26. Sept. 2025, 12_53_26.png"
              alt="Go Tutorial Visual"
              width={500}
              height={375}
              className="rounded-2xl shadow-2xl"
            />
          </div>
          <h1 className="text-6xl font-bold text-white mb-6">
            {t.learnGoWith}
          </h1>
          <p className="text-2xl text-gray-200 mb-8 font-light">
            {t.masterTheGame}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-tci-green to-green-400 mx-auto rounded-full mb-8"></div>
          <Link
            href="/intro"
            className="inline-block bg-gradient-to-r from-tci-green to-green-600 text-white text-xl font-bold px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {t.startLearning} →
          </Link>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(lessons).map(([key, lesson], index) => (
            <div key={key} className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-tci-green to-green-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-tci-dark">
                  {lesson.title}
                </h3>
              </div>
              <p className="text-gray-700 text-lg mb-6 font-medium leading-relaxed">{lesson.what}</p>
              <div className="bg-gradient-to-br from-tci-light to-blue-50 p-6 rounded-2xl mb-6 border border-blue-100">
                <p className="text-sm font-bold text-tci-dark mb-2 flex items-center">
                  <span className="w-2 h-2 bg-tci-green rounded-full mr-2"></span>
                  {t.whyThisMatters}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{lesson.why}</p>
              </div>
              <Link
                href={`/${key}`}
                className="inline-block w-full text-center bg-gradient-to-r from-gray-100 to-gray-200 text-tci-dark text-lg font-semibold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {t.learnMore} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="mb-20">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-3xl p-12 shadow-2xl border border-indigo-200">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mr-6">
                <span className="text-4xl">📚</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800">
                {t.learningFlow}
              </h2>
            </div>
            <p className="text-xl text-gray-700 font-medium max-w-3xl mx-auto">
              {t.followLearningPath}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Session 0 - Introduction */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-tci-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">0</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t.session} 0</h3>
                  <p className="text-sm text-gray-600 mb-4">{t.introduction}</p>
                  <Link href="/intro" className="inline-block bg-gradient-to-r from-tci-green to-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Starten
                  </Link>
                </div>
              </div>

              {/* Session 1 - Counting */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t.session} 1</h3>
                  <p className="text-sm text-gray-600 mb-4">{t.counting}</p>
                  <Link href="/counting" className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Lernen
                  </Link>
                </div>
              </div>

              {/* Sessions 2-6 */}
              {[
                { key: 'rules', title: t.placingStonesLiberties, color: 'purple' },
                { key: 'capture', title: t.capturing, color: 'pink' },
                { key: 'eyes', title: t.eyes, color: 'yellow' },
                { key: 'shapes', title: t.shapes, color: 'green' },
                { key: 'atari', title: t.atariGo, color: 'red' }
              ].map((session, index) => (
                <div key={session.key} className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                  <div className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${session.color}-500 to-${session.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-white font-bold">{index + 2}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{t.session} {index + 2}</h3>
                    <p className="text-sm text-gray-600 mb-4">{session.title}</p>
                    <Link href={`/${session.key}`} className={`inline-block bg-gradient-to-r from-${session.color}-500 to-${session.color}-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                      Lernen
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/play"
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-bl-2xl rounded-tr-3xl font-bold">
              AI
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-tci-dark mb-3 group-hover:text-purple-600 transition-colors">
              {language === 'de' ? 'Play BOT' : 'Play BOT'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'de'
                ? 'Spiele ein ganzes Spiel gegen einen anfängerfreundlichen Bot.'
                : 'Play a full game against a beginner-friendly bot.'}
            </p>
            <div className="flex items-center text-purple-600 font-semibold">
              {t.startLearning} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}


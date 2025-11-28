'use client'

import { useState } from 'react'
import Link from 'next/link'
import BoardSvg from '@/components/BoardSvg'
import { useLanguage } from '@/contexts/LanguageContext'
import { getUITranslations } from '@/content/strings'

export default function IntroPage() {
  const { language } = useLanguage()
  const t = getUITranslations(language)
  
  const [stones, setStones] = useState<Array<{ x: number; y: number; color: "B" | "W" }>>([])
  const [currentPlayer, setCurrentPlayer] = useState<"B" | "W">("B")
  const [hover, setHover] = useState<{ x: number; y: number; color: "B" | "W" } | null>(null)

  const handlePlace = (x: number, y: number) => {
    // Check if position is already occupied
    const isOccupied = stones.some(stone => stone.x === x && stone.y === y)
    if (isOccupied) return

    // Add the stone
    const newStone = { x, y, color: currentPlayer }
    setStones([...stones, newStone])
    
    // Switch players
    setCurrentPlayer(currentPlayer === "B" ? "W" : "B")
  }

  const handleMouseMove = (x: number, y: number) => {
    // Check if position is already occupied
    const isOccupied = stones.some(stone => stone.x === x && stone.y === y)
    if (isOccupied) {
      setHover(null)
      return
    }
    
    setHover({ x, y, color: currentPlayer })
  }

  const handleMouseLeave = () => {
    setHover(null)
  }

  const resetBoard = () => {
    setStones([])
    setCurrentPlayer("B")
    setHover(null)
  }

  return (
    <div className="max-w-8xl mx-auto px-6 py-12">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <div className="bg-gradient-to-br from-tci-dark to-gray-800 rounded-3xl p-16 shadow-2xl mb-8">
          <h1 className="text-6xl font-bold text-white mb-6">
            {t.introPageTitle}
          </h1>
          <p className="text-2xl text-gray-200 mb-8 font-light">
            {t.introPageSubtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-tci-green to-green-400 mx-auto rounded-full"></div>
        </div>
        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
          {t.introPageDescription}
        </p>
      </div>

      {/* Main Content - Premium UI Design */}
      <div className="w-full max-w-8xl mx-auto">
        
        {/* Interactive Game Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-2xl border border-gray-200">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-tci-dark mb-6">
                {t.introPageTryIt}
              </h2>
              <div className="inline-flex items-center bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-200">
                <div className="w-4 h-4 bg-black rounded-full mr-3"></div>
                <span className="text-xl text-gray-700 font-semibold">
                  {language === 'en' 
                    ? `Current player: ${currentPlayer === "B" ? "Black" : "White"}`
                    : `Aktueller Spieler: ${currentPlayer === "B" ? "Schwarz" : "Weiß"}`
                  }
                </span>
              </div>
              <button
                onClick={resetBoard}
                className="mt-6 bg-gradient-to-r from-tci-green to-green-600 text-white text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                {t.reset}
              </button>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full aspect-square max-w-2xl">
                <BoardSvg
                  stones={stones}
                  hover={hover}
                  onPlace={handlePlace}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  showCoords={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section with Rules */}
        <div className="mb-20">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Basic Rules - Left Side */}
            <div className="xl:col-span-7">
              <div className="bg-gradient-to-br from-tci-light to-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-tci-green to-green-600 rounded-2xl flex items-center justify-center mr-6">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-3xl font-bold text-tci-dark">
                    {t.introPageHowToPlay}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {t.introPageRules.map((rule, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="w-8 h-8 bg-tci-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 text-lg leading-relaxed font-medium">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Territory & Passing - Right Side */}
            <div className="xl:col-span-5 space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-xl border border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl">⚪</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {t.introPageTerritory}
                  </h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  {t.introPageTerritoryDescription}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 shadow-xl border border-purple-200">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {t.introPagePassing}
                  </h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  {t.introPagePassingDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Concepts Grid */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Komi */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl p-8 shadow-xl border border-yellow-200 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-3xl">🪶</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {t.introPageKomi}
                </h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {t.introPageKomiDescription}
              </p>
            </div>

            {/* Board Sizes */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-3xl">🟫</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {t.introPageBoardSizes}
                </h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {t.introPageBoardSizesDescription}
              </p>
            </div>

            {/* Tip */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-8 shadow-xl border border-pink-200 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {t.introPageTip}
                </h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {t.introPageTipDescription}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Scoring Section */}
      <div className="mb-20">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-3xl p-12 shadow-2xl border border-indigo-200">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mr-6">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-800">
                {t.introPageScoring}
              </h3>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.introPageScoringRules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-indigo-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <span className="text-gray-700 text-lg font-semibold">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What Makes Go Special */}
      <div className="mb-20">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl p-12 shadow-2xl border border-amber-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-3xl flex items-center justify-center mr-6">
                <span className="text-4xl">🌟</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-800">
                {t.introPageWhatMakesSpecial}
              </h3>
            </div>
            <p className="text-gray-700 text-xl leading-relaxed max-w-4xl mx-auto font-medium">
              {t.introPageSpecialDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mb-16">
        <div className="bg-gradient-to-r from-tci-green to-green-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t.introPageStartLearning}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {t.introPageNext}
          </p>
          <Link 
            href="/counting" 
            className="inline-block bg-white text-tci-green text-xl font-bold px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Jetzt starten →
          </Link>
        </div>
      </div>

    </div>
  )
}

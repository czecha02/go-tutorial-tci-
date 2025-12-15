'use client'

import { useState, useEffect } from 'react'
import BoardSvg from '@/components/BoardSvg'
import LessonNavigation from '@/components/LessonNavigation'
import VideoPlayer from '@/components/VideoPlayer'
import { useLanguage } from '@/contexts/LanguageContext'
import { getUITranslations } from '@/content/strings'
import { useProgress } from '@/contexts/ProgressContext'

export default function IntroPage() {
  const { language } = useLanguage()
  const t = getUITranslations(language)
  const { setCurrentLesson } = useProgress()

  const [stones, setStones] = useState<Array<{ x: number; y: number; color: "B" | "W" }>>([])
  const [currentPlayer, setCurrentPlayer] = useState<"B" | "W">("B")
  const [hover, setHover] = useState<{ x: number; y: number; color: "B" | "W" } | null>(null)

  useEffect(() => {
    setCurrentLesson(0)
  }, [setCurrentLesson])

  const handlePlace = (x: number, y: number) => {
    const isOccupied = stones.some(stone => stone.x === x && stone.y === y)
    if (isOccupied) return

    const newStone = { x, y, color: currentPlayer }
    setStones([...stones, newStone])
    setCurrentPlayer(currentPlayer === "B" ? "W" : "B")
  }

  const handleMouseMove = (x: number, y: number) => {
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
    <div className="max-w-4xl mx-auto px-4 py-6">

      <h1 className="text-2xl font-bold text-tci-dark mb-4">
        Lektion 0: Einführung in Go
      </h1>

      {/* Video - GRÖßER */}
      <div className="mb-6">
        <VideoPlayer
          videoId="oZTdT8MQexk"
          title="Was ist Go?"
          large={true}
        />
      </div>

      {/* Interaktives Brett */}
      <div className="mb-6">
        <div className="bg-white border-2 border-gray-300 p-4">
          <h2 className="text-xl font-bold text-tci-dark mb-3">
            Probiere es aus
          </h2>
          <p className="text-gray-600 mb-3">
            Klicke auf das Brett um Steine zu setzen. Schwarz und Weiß wechseln sich ab.
          </p>

          <div className="mb-3">
            <span className="font-semibold">Aktueller Spieler: </span>
            <span className={currentPlayer === "B" ? "font-bold" : ""}>
              {currentPlayer === "B" ? "Schwarz" : "Weiß"}
            </span>
          </div>

          <div className="w-full max-w-md mx-auto mb-3">
            <BoardSvg
              stones={stones}
              hover={hover}
              onPlace={handlePlace}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              showCoords={true}
            />
          </div>

          <button
            onClick={resetBoard}
            className="bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300 transition-colors"
          >
            Brett zurücksetzen
          </button>
        </div>
      </div>

      {/* Regeln */}
      <div className="mb-6">
        <div className="bg-white border-2 border-gray-300 p-4">
          <h2 className="text-xl font-bold text-tci-dark mb-3">
            Die Grundregeln
          </h2>
          <ol className="space-y-2 list-decimal list-inside text-gray-700">
            {t.introPageRules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Ziel des Spiels */}
      <div className="mb-6">
        <div className="bg-white border-2 border-gray-300 p-4">
          <h2 className="text-xl font-bold text-tci-dark mb-3">
            Ziel des Spiels
          </h2>
          <p className="text-gray-700 mb-2">
            <strong>Gebiet kontrollieren:</strong> {t.introPageTerritoryDescription}
          </p>
          <p className="text-gray-700">
            <strong>Passen:</strong> {t.introPagePassingDescription}
          </p>
        </div>
      </div>

      {/* Punktezählung */}
      <div className="mb-20">
        <div className="bg-white border-2 border-gray-300 p-4">
          <h2 className="text-xl font-bold text-tci-dark mb-3">
            Wie wird gezählt?
          </h2>
          <ol className="space-y-2 list-decimal list-inside text-gray-700">
            {t.introPageScoringRules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ol>
        </div>
      </div>

      <LessonNavigation currentLessonId={0} />
    </div>
  )
}

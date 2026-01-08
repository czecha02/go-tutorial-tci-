'use client'

import { useState, useMemo } from 'react'
import BoardSvg from '@/components/BoardSvg'
import { createInitialState, placeStone, toStoneArray, GameState, getGroup, getLiberties } from '@/lib/engine'
import { getLessons, getUITranslations } from '@/content/strings'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRulesLibertyHighlight } from './useRulesLibertyHighlight'
import LessonNavigation from '@/components/LessonNavigation'

export default function RulesPage() {
  // Translation setup
  const { language } = useLanguage()
  const lessons = getLessons(language)
  const t = getUITranslations(language)

  const [state, setState] = useState<GameState>(createInitialState())
  const [hover, setHover] = useState<{ x: number; y: number; color: "B" | "W" } | null>(null)
  const [step, setStep] = useState(0)
  const [moveHistory, setMoveHistory] = useState<Array<{
    moveNumber: number
    position: { x: number; y: number }
    libertyCount: number
    groupSize: number
    groupDescription: string
    liberties: Array<{ x: number; y: number }>
  }>>([])
  const [highlightedLiberties, setHighlightedLiberties] = useState<Array<{ x: number; y: number }>>([])
  const [libertyKey, setLibertyKey] = useState(0) // Force re-render key

  const stones = useMemo(() => toStoneArray(state.board), [state.board])

  // Generate board hash for reactivity
  const boardHash = useMemo(() =>
    JSON.stringify(state.board), [state.board]
  )

  // Liberty highlighting hook (Rules page only)
  const { liberties, isActive, clearLiberties } = useRulesLibertyHighlight({
    board: state.board,
    lastMove: state.lastMove,
    boardHash,
    enabled: true,
    durationMs: 3500
  })

  const handlePlace = (x: number, y: number) => {
    // Force only black pieces for Rules lesson
    const color = "B"
    try {
      const { nextState } = placeStone(state, { x, y }, color)

      // Calculate group information for this move
      const group = getGroup(nextState.board, x, y)
      const groupSize = group.length
      // Calculate liberties for the entire group
      const groupLiberties = getLiberties(nextState.board, x, y)
      const libertyCount = groupLiberties.length

      // Determine group description
      let groupDescription = ""
      if (groupSize === 1) {
        groupDescription = "single stone"
      } else if (groupSize === 2) {
        groupDescription = "group of 2 stones"
      } else if (groupSize === 3) {
        groupDescription = "group of 3 stones"
      } else {
        groupDescription = `group of ${groupSize} stones`
      }

      // Add move to history
      const newMove = {
        moveNumber: step + 1,
        position: { x, y },
        libertyCount,
        groupSize,
        groupDescription,
        liberties: groupLiberties
      }

      setMoveHistory(prev => [...prev, newMove])

      // Highlight the liberties for this move
      setHighlightedLiberties(groupLiberties)
      setLibertyKey(prev => prev + 1) // Force re-render

      // Clear highlights after 4 seconds
      setTimeout(() => {
        setHighlightedLiberties([])
        setLibertyKey(prev => prev + 1) // Force re-render
      }, 4000)

      console.log('Rules Place Stone:', {
        position: { x, y },
        color,
        lastMove: nextState.lastMove,
        boardHash: JSON.stringify(nextState.board),
        groupSize,
        libertyCount,
        groupDescription,
        liberties: groupLiberties,
        highlightedLiberties: groupLiberties
      })

      setState(nextState)
      setStep(step + 1)
      // Liberty highlighting is handled automatically by the hook
    } catch (error) {
      console.error('Rules Place Stone Error:', error)
      // Show error message
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const size = 520
    const padding = 32
    const inner = size - padding * 2
    const cell = inner / 8

    const px = e.clientX - rect.left - padding
    const py = e.clientY - rect.top - padding
    const i = Math.round(px / cell)
    const j = Math.round(py / cell)

    if (i >= 0 && i < 9 && j >= 0 && j < 9) {
      setHover({ x: i, y: j, color: "B" }) // Always show black hover for Rules lesson
    }
  }

  const handleMouseLeave = () => {
    setHover(null)
  }

  const resetLesson = () => {
    setState(createInitialState())
    setStep(0)
    setMoveHistory([]) // Clear move history
    setHighlightedLiberties([]) // Clear highlighted liberties
    clearLiberties() // Clear any active liberty highlighting
  }

  const highlightMoveLiberties = (move: typeof moveHistory[0]) => {
    setHighlightedLiberties(move.liberties)
    setLibertyKey(prev => prev + 1) // Force re-render
    // Clear highlights after 4 seconds
    setTimeout(() => {
      setHighlightedLiberties([])
      setLibertyKey(prev => prev + 1) // Force re-render
    }, 4000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-tci-dark mb-4">
          {lessons.rules.title}
        </h1>
        <div className="tci-progress-track w-full max-w-md mx-auto">
          <div
            className="tci-progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Move Tracking Table - Top Full Width */}
      {moveHistory.length > 0 && (
        <div className="tci-card mb-8">
          <h3 className="text-lg font-semibold text-tci-dark mb-4">
            {t.moveHistory}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-tci-dark">{t.move}</th>
                  <th className="text-left py-3 px-4 font-semibold text-tci-dark">{t.liberties}</th>
                  <th className="text-left py-3 px-4 font-semibold text-tci-dark">{t.groupType}</th>
                  <th className="text-left py-3 px-4 font-semibold text-tci-dark">{t.position}</th>
                  <th className="text-left py-3 px-4 font-semibold text-tci-dark">{t.groupSize}</th>
                  <th className="text-left py-3 px-4 font-semibold text-tci-dark">{t.analysis}</th>
                </tr>
              </thead>
              <tbody>
                {moveHistory.map((move, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => highlightMoveLiberties(move)}
                    title="Click to highlight liberties on board"
                  >
                    <td className="py-3 px-4 font-medium text-tci-dark">
                      {move.moveNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {move.libertyCount} {t.liberties.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {move.groupDescription}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono">
                      {String.fromCharCode(65 + move.position.x)}{9 - move.position.y}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {move.groupSize} {move.groupSize > 1 ? t.stones : t.stone}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {move.groupSize === 1 ? t.isolatedStone :
                        move.groupSize === 2 ? t.connectedPair :
                          move.groupSize === 3 ? t.connectedTrio :
                            t.largeGroup}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-tci-light rounded-lg">
            <p className="text-sm text-tci-dark">
              <strong>{t.analysis}:</strong> {t.analysisText}
            </p>
            {highlightedLiberties.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>{t.libertiesHighlighted}</strong> {t.showingLibertyIntersections.replace('{{count}}', String(highlightedLiberties.length))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-12">
        <div className="flex justify-center">
          <div
            className="inline-block"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <BoardSvg
              key={libertyKey}
              size={580}
              stones={stones}
              lastMove={state.lastMove}
              hover={hover}
              onPlace={handlePlace}
              showCoords
              liberties={highlightedLiberties.length > 0 ? highlightedLiberties : (isActive ? liberties : [])}
              showLiberties={highlightedLiberties.length > 0 || isActive}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="tci-card">
            <h3 className="text-xl font-semibold text-tci-dark mb-4">
              {t.what}
            </h3>
            <p className="text-gray-700 mb-4">
              {t.rulesPageWhat}
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
                <span className="text-sm font-semibold text-red-800">{t.groupLibertyHighlighting}</span>
              </div>
              <p className="text-sm text-red-700">
                {t.groupLibertyDescription}
              </p>
            </div>

            <h3 className="text-xl font-semibold text-tci-dark mb-4">
              {t.whyThisMattersShort}
            </h3>
            <p className="text-gray-700">
              {t.rulesPageWhy}
            </p>
          </div>

          <div className="tci-card">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              {t.tryItYourself}
            </h3>
            <p className="text-gray-700 mb-4">
              {t.rulesPageTry}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> {t.rulesPageNote}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={resetLesson}
                className="tci-button-secondary"
              >
                {t.reset}
              </button>
              <div className="text-sm text-gray-600 flex items-center">
                {t.stepOf.replace('{{current}}', String(step + 1)).replace('{{total}}', '4')}
              </div>
            </div>

            {/* Debug information */}
            {isActive && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-green-800">
                  <strong>{t.groupLibertyActive}</strong> {t.showingLiberties.replace('{{count}}', String(liberties.length))}
                </p>
              </div>
            )}

            {/* Highlighted liberties debug */}
            {highlightedLiberties.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-red-800">
                  <strong>{t.manualLibertyHighlighting}</strong> {t.showingLiberties.replace('{{count}}', String(highlightedLiberties.length))}: {highlightedLiberties.map(l => `${String.fromCharCode(65 + l.x)}${9 - l.y}`).join(', ')}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  BoardSvg should show red circles at these positions. Key: {libertyKey}
                </p>
              </div>
            )}

          </div>


          {step >= 3 && (
            <div className="tci-card bg-tci-light">
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <h3 className="text-lg font-semibold text-tci-dark mb-2">
                  {t.greatJob}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t.rulesPageLearned}
                </p>
                <a href="/capture" className="tci-button-primary">
                  {t.nextCapturing}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <LessonNavigation currentLessonId={1} />
    </div>
  )
}




'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import BoardSvg from '@/components/BoardSvg'
import { useLanguage } from '@/contexts/LanguageContext'
import { getUITranslations } from '@/content/strings'
import { getQuizLessons, QuizLessonLocalized } from '@/content/quiz'
import {
  createInitialState,
  placeStone,
  isLegalMove,
  toStoneArray,
  GameState
} from '@/lib/engine'

import type { QuizMove } from '@/content/quiz'

type HoverStone = { x: number; y: number; color: 'B' | 'W' } | null

type MessageType = 'success' | 'error' | 'info'

type ScenarioStatus = {
  gameState: GameState
  hover: HoverStone
  solved: boolean
  message: { type: MessageType; text: string } | null
  attempts: number
  showHint: boolean
  // For input questions
  blackScoreInput?: string
  whiteScoreInput?: string
  libertyCountInput?: string
  // For advanced counting
  blackPrisonersInput?: string
  whitePrisonersInput?: string
  // For ladder sequences
  ladderMoveIndex?: number
}

type LessonsProgress = ScenarioStatus[][]

const createScenarioState = (scenario: QuizLessonLocalized['scenarios'][number]): ScenarioStatus => {
  const state = createInitialState()
  scenario.boardSetup.forEach(({ x, y, color }) => {
    state.board[y][x] = color
  })
  state.toPlay = scenario.toPlay
  return {
    gameState: state,
    hover: null,
    solved: false,
    message: null,
    attempts: 0,
    showHint: false,
    blackScoreInput: scenario.isInputQuestion && scenario.correctBlackScore !== undefined ? '' : undefined,
    whiteScoreInput: scenario.isInputQuestion && scenario.correctWhiteScore !== undefined ? '' : undefined,
    libertyCountInput: scenario.isInputQuestion && scenario.correctLibertyCount !== undefined ? '' : undefined,
    blackPrisonersInput: scenario.isAdvancedCounting ? '' : undefined,
    whitePrisonersInput: scenario.isAdvancedCounting ? '' : undefined
  }
}

const buildInitialProgress = (lessons: QuizLessonLocalized[]): LessonsProgress =>
  lessons.map((lesson) => lesson.scenarios.map((scenario) => createScenarioState(scenario)))

const isCorrectMove = (moves: QuizMove[], x: number, y: number) =>
  moves.some((move) => move.x === x && move.y === y)

// Find moves that connect to white group
const findConnectingMoves = (gameState: GameState): QuizMove[] => {
  const connectingMoves: QuizMove[] = []
  const boardSize = 9
  
  // Find all white stones
  const whiteStones: Array<{ x: number; y: number }> = []
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (gameState.board[y][x] === 'W') {
        whiteStones.push({ x, y })
      }
    }
  }
  
  // Check all empty intersections adjacent to white stones
  for (const stone of whiteStones) {
    const directions = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }   // right
    ]
    
    for (const dir of directions) {
      const newX = stone.x + dir.x
      const newY = stone.y + dir.y
      
      // Check bounds
      if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
        // Check if empty and legal
        if (gameState.board[newY][newX] === null) {
          if (isLegalMove(gameState, { x: newX, y: newY }, 'W')) {
            // Check if not already in list
            if (!connectingMoves.some(m => m.x === newX && m.y === newY)) {
              connectingMoves.push({ x: newX, y: newY })
            }
          }
        }
      }
    }
  }
  
  return connectingMoves
}

export default function QuizPage() {
  const { language } = useLanguage()
  const t = getUITranslations(language)
  const lessons = useMemo(() => getQuizLessons(language), [language])

  const [progress, setProgress] = useState<LessonsProgress>(() => buildInitialProgress(lessons))

  useEffect(() => {
    setProgress(buildInitialProgress(lessons))
  }, [lessons])

  const totalScenarios = useMemo(
    () => lessons.reduce((sum, lesson) => sum + lesson.scenarios.length, 0),
    [lessons]
  )

  const solvedCount = useMemo(
    () => progress.flat().filter((scenario) => scenario.solved).length,
    [progress]
  )

  const progressPercent = totalScenarios === 0 ? 0 : Math.round((solvedCount / totalScenarios) * 100)

  const updateScenario = (
    lessonIndex: number,
    scenarioIndex: number,
    updater: (state: ScenarioStatus) => ScenarioStatus
  ) => {
    setProgress((prev) =>
      prev.map((lessonStates, lIdx) => {
        if (lIdx !== lessonIndex) return lessonStates
        return lessonStates.map((scenarioState, sIdx) => {
          if (sIdx !== scenarioIndex) return scenarioState
          return updater(scenarioState)
        })
      })
    )
  }

  const handlePlace = (lessonIndex: number, scenarioIndex: number, x: number, y: number) => {
    const scenario = lessons[lessonIndex].scenarios[scenarioIndex]

    updateScenario(lessonIndex, scenarioIndex, (state) => {
      if (state.solved) return state

      if (scenario.correctMoves.length === 0) {
        return {
          ...state,
          attempts: state.attempts + 1,
          hover: null,
          message: { type: 'error', text: t.quizNeedsPass }
        }
      }

      if (!isLegalMove(state.gameState, { x, y }, state.gameState.toPlay)) {
        return {
          ...state,
          attempts: state.attempts + 1,
          hover: null,
          message: { type: 'error', text: t.quizIllegalMove }
        }
      }

      const attempts = state.attempts + 1

      // Handle ladder sequences
      if (scenario.isLadder) {
        // Check if first move is correct (D3 or E3)
        const isFirstMove = (state.ladderMoveIndex ?? 0) === 0
        if (isFirstMove) {
          const firstMoveCorrect = (x === 3 && y === 2) || (x === 4 && y === 2) // D3 or E3
          if (!firstMoveCorrect) {
            return {
              ...state,
              attempts,
              hover: null,
              message: { type: 'error', text: language === 'en' ? 'Play D3 or E3 to start the ladder.' : 'Spiele D3 oder E3, um die Leiter zu starten.' }
            }
          }
        }

        // Execute user move
        const { nextState: afterUserMove } = placeStone(state.gameState, { x, y }, state.gameState.toPlay)
        
        // Calculate bot response: White tries to connect to its group
        let botMove: QuizMove | null = null
        
        if (isFirstMove) {
          // First move: if Black played D3 (x=3, y=2), White plays E3 (x=4, y=2)
          // If Black played E3 (x=4, y=2), White plays D3 (x=3, y=2)
          if (x === 3 && y === 2) {
            botMove = { x: 4, y: 2 } // E3
          } else if (x === 4 && y === 2) {
            botMove = { x: 3, y: 2 } // D3
          }
        } else {
          // For subsequent moves, find moves that connect to white group
          const connectingMoves = findConnectingMoves(afterUserMove)
          
          if (connectingMoves.length > 0) {
            // Prefer moves that extend away from black stones (ladder pattern)
            // Try to find a move that extends in the direction away from the last black move
            const lastBlackMove = { x, y }
            
            // Find moves that are further away from the last black move
            const scoredMoves = connectingMoves.map(move => {
              const distance = Math.abs(move.x - lastBlackMove.x) + Math.abs(move.y - lastBlackMove.y)
              return { move, distance }
            })
            
            // Sort by distance (prefer moves further away)
            scoredMoves.sort((a, b) => b.distance - a.distance)
            
            // Take the first valid move
            botMove = scoredMoves[0]?.move || connectingMoves[0]
          }
        }

        if (!botMove) {
          // If no connecting moves found, check if white group is captured (ladder complete)
          const connectingMovesAfter = findConnectingMoves(afterUserMove)
          if (connectingMovesAfter.length === 0) {
            // White group has no liberties - ladder is complete (captured)
            return {
              ...state,
              gameState: afterUserMove,
              solved: true,
              attempts,
              hover: null,
              message: { type: 'success', text: scenario.explanation }
            }
          }
          // No connecting moves found but group still has liberties - error
          return {
            ...state,
            gameState: afterUserMove,
            attempts,
            hover: null,
            message: { type: 'error', text: language === 'en' ? 'No connecting move found for bot.' : 'Kein verbindender Zug für Bot gefunden.' }
          }
        }

        // Execute bot response after a short delay
        setTimeout(() => {
          updateScenario(lessonIndex, scenarioIndex, (s) => {
            if (!isLegalMove(s.gameState, botMove!, s.gameState.toPlay)) {
              return s
            }
            const { nextState: afterBotMove } = placeStone(s.gameState, botMove!, s.gameState.toPlay)
            const newLadderIndex = (s.ladderMoveIndex ?? 0) + 1
            
            // Check if there are still connecting moves available (ladder continues)
            const nextConnectingMoves = findConnectingMoves(afterBotMove)
            const isComplete = nextConnectingMoves.length === 0 // No more connecting moves = ladder complete
            
            return {
              ...s,
              gameState: afterBotMove,
              ladderMoveIndex: newLadderIndex,
              solved: isComplete,
              message: isComplete 
                ? { type: 'success', text: scenario.explanation }
                : { type: 'info', text: language === 'en' ? 'Bot connected to group. Continue the ladder.' : 'Bot hat sich mit der Gruppe verbunden. Setze die Leiter fort.' }
            }
          })
        }, 500)

        return {
          ...state,
          gameState: afterUserMove,
          ladderMoveIndex: (state.ladderMoveIndex ?? 0) + (isFirstMove ? 0 : 1),
          attempts,
          hover: null,
          message: { type: 'info', text: language === 'en' ? 'Waiting for bot response...' : 'Warte auf Bot-Antwort...' }
        }
      }

      // Normal move handling
      if (!isCorrectMove(scenario.correctMoves, x, y)) {
        return {
          ...state,
          attempts,
          hover: null,
          message: { type: 'error', text: t.quizWrongMove }
        }
      }

      const { nextState } = placeStone(state.gameState, { x, y }, state.gameState.toPlay)

      return {
        ...state,
        gameState: nextState,
        solved: true,
        attempts,
        hover: null,
        message: { type: 'success', text: scenario.explanation }
      }
    })
  }

  const handlePass = (lessonIndex: number, scenarioIndex: number) => {
    const scenario = lessons[lessonIndex].scenarios[scenarioIndex]
    if (scenario.correctMoves.length !== 0) return

    updateScenario(lessonIndex, scenarioIndex, (state) => {
      if (state.solved) return state
      return {
        ...state,
        solved: true,
        attempts: state.attempts + 1,
        hover: null,
        message: { type: 'success', text: scenario.explanation }
      }
    })
  }

  const handleMouseMove = (lessonIndex: number, scenarioIndex: number, x: number, y: number) => {
    updateScenario(lessonIndex, scenarioIndex, (state) => {
      if (state.solved) {
        return { ...state, hover: null }
      }
      return {
        ...state,
        hover: { x, y, color: state.gameState.toPlay }
      }
    })
  }

  const handleMouseLeave = (lessonIndex: number, scenarioIndex: number) => {
    updateScenario(lessonIndex, scenarioIndex, (state) => ({ ...state, hover: null }))
  }

  const resetScenario = (lessonIndex: number, scenarioIndex: number) => {
    const scenario = lessons[lessonIndex].scenarios[scenarioIndex]
    const initial = createScenarioState(scenario)
    updateScenario(lessonIndex, scenarioIndex, () => initial)
  }

  const resetAll = () => {
    setProgress(buildInitialProgress(lessons))
  }

  const toggleHint = (lessonIndex: number, scenarioIndex: number) => {
    updateScenario(lessonIndex, scenarioIndex, (state) => ({
      ...state,
      showHint: !state.showHint
    }))
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <header className="space-y-4 text-center">
        <h1 className="text-5xl font-bold text-tci-dark">{t.quizTitle}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.quizSubtitle}</p>
        <p className="text-base text-gray-500 max-w-2xl mx-auto">{t.quizIntro}</p>
      </header>

      <section className="bg-gradient-to-br from-tci-light to-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
            {t.quizScoreCard}
          </div>
          <div className="text-4xl font-bold text-tci-dark">
            {t.quizSolvedCount.replace('{{solved}}', String(solvedCount)).replace('{{total}}', String(totalScenarios))}
          </div>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tci-green to-green-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <button
          onClick={resetAll}
          className="tci-button-secondary text-lg px-6 py-3"
        >
          {t.quizResetAll}
        </button>
      </section>

      <div className="space-y-16">
        {lessons.map((lesson, lessonIndex) => {
          const lessonProgress = progress[lessonIndex]
          const solvedInLesson = lessonProgress.filter((scenario) => scenario.solved).length
          const lessonTotal = lesson.scenarios.length

          return (
            <section key={lesson.id} className="space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-tci-dark">{lesson.title}</h2>
                  <p className="text-sm text-gray-600">
                    {t.quizSolvedCount
                      .replace('{{solved}}', String(solvedInLesson))
                      .replace('{{total}}', String(lessonTotal))}
                  </p>
                </div>
                <Link href={lesson.lessonPath} className="tci-button-secondary self-start lg:self-center">
                  {t.quizReviewLesson}
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
                {lesson.scenarios.map((scenario, scenarioIndex) => {
                  const state = lessonProgress[scenarioIndex]
                  const stones = toStoneArray(state.gameState.board)
                  const toPlayLabel = state.solved
                    ? t.quizSolved
                    : state.gameState.toPlay === 'B'
                    ? t.quizBlackToPlay
                    : t.quizWhiteToPlay

                  return (
                    <div
                      key={scenario.id}
                      className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 md:p-8 space-y-6 min-w-0"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-semibold text-tci-dark">{scenario.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                              state.solved
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {toPlayLabel}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{scenario.prompt}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => resetScenario(lessonIndex, scenarioIndex)}
                          className="tci-button-secondary"
                        >
                          {t.quizScenarioReset}
                        </button>
                        {scenario.hint && (
                          <button
                            onClick={() => toggleHint(lessonIndex, scenarioIndex)}
                            className="tci-button-secondary"
                          >
                            {t.quizHint}
                          </button>
                        )}
                        {scenario.correctMoves.length === 0 && !scenario.isInputQuestion && !state.solved && (
                          <button
                            onClick={() => handlePass(lessonIndex, scenarioIndex)}
                            className="tci-button-primary"
                          >
                            {t.quizPassButton}
                          </button>
                        )}
                      </div>

                      <div className="flex justify-center overflow-x-auto w-full">
                        <div className="flex-shrink-0">
                          <BoardSvg
                            size={520}
                            stones={stones}
                            lastMove={state.gameState.lastMove}
                            hover={state.hover}
                            onPlace={scenario.isInputQuestion ? undefined : (x, y) => handlePlace(lessonIndex, scenarioIndex, x, y)}
                            onMouseMove={scenario.isInputQuestion ? undefined : (x, y) => handleMouseMove(lessonIndex, scenarioIndex, x, y)}
                            onMouseLeave={scenario.isInputQuestion ? undefined : () => handleMouseLeave(lessonIndex, scenarioIndex)}
                            showCoords
                          />
                        </div>
                      </div>

                      {scenario.isInputQuestion && (
                        <div className="space-y-4">
                          {scenario.correctLibertyCount !== undefined ? (
                            // Liberty count input
                            <>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  {language === 'en' ? 'Number of Liberties' : 'Anzahl der Freiheiten'}
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="4"
                                  value={state.libertyCountInput || ''}
                                  onChange={(e) => {
                                    updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                      ...s,
                                      libertyCountInput: e.target.value,
                                      message: null
                                    }))
                                  }}
                                  disabled={state.solved}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-tci-green"
                                />
                              </div>
                              {!state.solved && (
                                <button
                                  onClick={() => {
                                    const libertyInput = parseInt(state.libertyCountInput || '0', 10)
                                    
                                    if (!state.libertyCountInput) {
                                      updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                        ...s,
                                        message: { type: 'error', text: language === 'en' ? 'Please enter the number of liberties.' : 'Bitte gib die Anzahl der Freiheiten ein.' },
                                        attempts: s.attempts + 1
                                      }))
                                      return
                                    }

                                    const isCorrect = libertyInput === scenario.correctLibertyCount

                                    updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                      ...s,
                                      solved: isCorrect,
                                      attempts: s.attempts + 1,
                                      message: isCorrect
                                        ? { type: 'success', text: scenario.explanation }
                                        : { type: 'error', text: language === 'en' ? 'Incorrect. Try counting again.' : 'Falsch. Versuche erneut zu zählen.' }
                                    }))
                                  }}
                                  className="w-full tci-button-primary text-lg py-3"
                                >
                                  {language === 'en' ? 'Check Answer' : 'Antwort prüfen'}
                                </button>
                              )}
                            </>
                          ) : scenario.isAdvancedCounting ? (
                            // Advanced counting with prisoners and komi
                            <>
                              <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {language === 'en' ? 'Black Territory' : 'Schwarzes Gebiet'}
                                      </label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="81"
                                        value={state.blackScoreInput || ''}
                                        onChange={(e) => {
                                          updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                            ...s,
                                            blackScoreInput: e.target.value,
                                            message: null
                                          }))
                                        }}
                                        disabled={state.solved}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-tci-green"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {language === 'en' ? 'White Territory' : 'Weißes Gebiet'}
                                      </label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="81"
                                        value={state.whiteScoreInput || ''}
                                        onChange={(e) => {
                                          updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                            ...s,
                                            whiteScoreInput: e.target.value,
                                            message: null
                                          }))
                                        }}
                                        disabled={state.solved}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-tci-green"
                                      />
                                    </div>
                                  </div>
                                  {scenario.prisonersGiven ? (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                          {language === 'en' ? 'Black Prisoners (Given)' : 'Schwarze Gefangene (Vorgegeben)'}
                                        </label>
                                        <div className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg bg-gray-100 text-gray-700">
                                          {scenario.correctBlackPrisoners || 0}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                          {language === 'en' ? 'White Prisoners (Given)' : 'Weiße Gefangene (Vorgegeben)'}
                                        </label>
                                        <div className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg bg-gray-100 text-gray-700">
                                          {scenario.correctWhitePrisoners || 0}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                          {language === 'en' ? 'Black Prisoners' : 'Schwarze Gefangene'}
                                        </label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="81"
                                          value={state.blackPrisonersInput || ''}
                                          onChange={(e) => {
                                            updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                              ...s,
                                              blackPrisonersInput: e.target.value,
                                              message: null
                                            }))
                                          }}
                                          disabled={state.solved}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-tci-green"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                          {language === 'en' ? 'White Prisoners' : 'Weiße Gefangene'}
                                        </label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="81"
                                          value={state.whitePrisonersInput || ''}
                                          onChange={(e) => {
                                            updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                              ...s,
                                              whitePrisonersInput: e.target.value,
                                              message: null
                                            }))
                                          }}
                                          disabled={state.solved}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-tci-green"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="lg:w-64 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                                  <div className="text-sm font-semibold text-gray-700">
                                    {language === 'en' ? 'Game Info' : 'Spielinfo'}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <div className="mb-2">
                                      <span className="font-semibold">{language === 'en' ? 'Komi:' : 'Komi:'}</span> {scenario.komi || 5.5}
                                    </div>
                                    {scenario.prisonersGiven && (
                                      <>
                                        <div className="mb-2">
                                          <span className="font-semibold">{language === 'en' ? 'Black Prisoners:' : 'Schwarze Gefangene:'}</span> {scenario.correctBlackPrisoners || 0}
                                        </div>
                                        <div className="mb-2">
                                          <span className="font-semibold">{language === 'en' ? 'White Prisoners:' : 'Weiße Gefangene:'}</span> {scenario.correctWhitePrisoners || 0}
                                        </div>
                                      </>
                                    )}
                                    <div className="text-xs text-gray-500 mt-2">
                                      {language === 'en' 
                                        ? 'Final Score = Territory + Prisoners + Komi (White only)'
                                        : 'Endpunktzahl = Gebiet + Gefangene + Komi (nur Weiß)'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {!state.solved && (
                                <button
                                  onClick={() => {
                                    const blackTerritory = parseInt(state.blackScoreInput || '0', 10)
                                    const whiteTerritory = parseInt(state.whiteScoreInput || '0', 10)
                                    const blackPrisoners = scenario.prisonersGiven 
                                      ? (scenario.correctBlackPrisoners || 0)
                                      : parseInt(state.blackPrisonersInput || '0', 10)
                                    const whitePrisoners = scenario.prisonersGiven
                                      ? (scenario.correctWhitePrisoners || 0)
                                      : parseInt(state.whitePrisonersInput || '0', 10)
                                    
                                    if (!state.blackScoreInput || !state.whiteScoreInput) {
                                      updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                        ...s,
                                        message: { type: 'error', text: language === 'en' ? 'Please enter both territory values.' : 'Bitte gib beide Gebietswerte ein.' },
                                        attempts: s.attempts + 1
                                      }))
                                      return
                                    }

                                    if (!scenario.prisonersGiven && (!state.blackPrisonersInput || !state.whitePrisonersInput)) {
                                      updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                        ...s,
                                        message: { type: 'error', text: language === 'en' ? 'Please enter all values.' : 'Bitte gib alle Werte ein.' },
                                        attempts: s.attempts + 1
                                      }))
                                      return
                                    }

                                    const isCorrect = 
                                      blackTerritory === scenario.correctBlackScore &&
                                      whiteTerritory === scenario.correctWhiteScore &&
                                      blackPrisoners === (scenario.correctBlackPrisoners || 0) &&
                                      whitePrisoners === (scenario.correctWhitePrisoners || 0)

                                    updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                      ...s,
                                      solved: isCorrect,
                                      attempts: s.attempts + 1,
                                      message: isCorrect
                                        ? { type: 'success', text: scenario.explanation }
                                        : { type: 'error', text: language === 'en' ? 'Incorrect. Try counting again.' : 'Falsch. Versuche erneut zu zählen.' }
                                    }))
                                  }}
                                  className="w-full tci-button-primary text-lg py-3"
                                >
                                  {language === 'en' ? 'Check Answer' : 'Antwort prüfen'}
                                </button>
                              )}
                            </>
                          ) : (
                            // Territory count inputs
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {language === 'en' ? 'Black Territory' : 'Schwarzes Gebiet'}
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="81"
                                    value={state.blackScoreInput || ''}
                                    onChange={(e) => {
                                      updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                        ...s,
                                        blackScoreInput: e.target.value,
                                        message: null
                                      }))
                                    }}
                                    disabled={state.solved}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-tci-green"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {language === 'en' ? 'White Territory' : 'Weißes Gebiet'}
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="81"
                                    value={state.whiteScoreInput || ''}
                                    onChange={(e) => {
                                      updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                        ...s,
                                        whiteScoreInput: e.target.value,
                                        message: null
                                      }))
                                    }}
                                    disabled={state.solved}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-tci-green"
                                  />
                                </div>
                              </div>
                              {!state.solved && (
                                <button
                                  onClick={() => {
                                    const blackInput = parseInt(state.blackScoreInput || '0', 10)
                                    const whiteInput = parseInt(state.whiteScoreInput || '0', 10)
                                    
                                    if (!state.blackScoreInput || !state.whiteScoreInput) {
                                      updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                        ...s,
                                        message: { type: 'error', text: language === 'en' ? 'Please enter both scores.' : 'Bitte gib beide Punktzahlen ein.' },
                                        attempts: s.attempts + 1
                                      }))
                                      return
                                    }

                                    const isCorrect = 
                                      blackInput === scenario.correctBlackScore &&
                                      whiteInput === scenario.correctWhiteScore

                                    updateScenario(lessonIndex, scenarioIndex, (s) => ({
                                      ...s,
                                      solved: isCorrect,
                                      attempts: s.attempts + 1,
                                      message: isCorrect
                                        ? { type: 'success', text: scenario.explanation }
                                        : { type: 'error', text: language === 'en' ? 'Incorrect. Try counting again.' : 'Falsch. Versuche erneut zu zählen.' }
                                    }))
                                  }}
                                  className="w-full tci-button-primary text-lg py-3"
                                >
                                  {language === 'en' ? 'Check Answer' : 'Antwort prüfen'}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">
                          {t.quizAttemptsLabel.replace('{{count}}', String(state.attempts))}
                        </div>
                        {state.message && (
                          <div
                            className={`rounded-2xl border px-4 py-3 text-sm ${
                              state.message.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : state.message.type === 'error'
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-blue-50 border-blue-200 text-blue-800'
                            }`}
                          >
                            {state.message.text}
                          </div>
                        )}
                        {scenario.hint && state.showHint && (
                          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                            {scenario.hint}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}


'use client'

import { useState, useMemo } from 'react'
import BoardSvg from '@/components/BoardSvg'
import { createInitialState, placeStone, toStoneArray, GameState } from '@/lib/engine'
import { LESSONS, getUITranslations } from '@/content/strings'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CountingPage() {
  const { language } = useLanguage()
  const t = getUITranslations(language)
  const [state, setState] = useState<GameState>(() => {
    const initialState = createInitialState()
    // Set up the board according to the specified layout (A1-I9 coordinates)
    // Note: BoardSvg uses A=0, I=8 for columns and 9=0, 1=8 for rows

    // Row A (column 0): empty, empty, B, B, W, B, empty, empty, empty
    // A1, A2, A7, A8, A9 are empty
    initialState.board[0][2] = 'B'  // A3 (row 7)
    initialState.board[0][3] = 'B'  // A4 (row 6)
    initialState.board[0][4] = 'W'  // A5 (row 5)
    initialState.board[0][5] = 'B'  // A6 (row 4)

    // Row B (column 1): empty, B, empty, B, W, B, empty, B, empty
    // B1, B3, B7, B9 are empty
    initialState.board[1][1] = 'B'  // B2 (row 7)
    initialState.board[1][3] = 'B'  // B4 (row 6)
    initialState.board[1][4] = 'W'  // B5 (row 5)
    initialState.board[1][5] = 'B'  // B6 (row 4)
    initialState.board[1][7] = 'B'  // B8 (row 2)

    // Row C (column 2): empty, B, empty, B, W, B, empty, empty, empty
    // C1, C3, C7, C8, C9 are empty
    initialState.board[2][1] = 'B'  // C2 (row 7)
    initialState.board[2][3] = 'B'  // C4 (row 6)
    initialState.board[2][4] = 'W'  // C5 (row 5)
    initialState.board[2][5] = 'B'  // C6 (row 4)

    // Row D (column 3): B, B, B, W, W, B, empty, empty, empty
    // D7, D8, D9 are empty
    initialState.board[3][0] = 'B'  // D1 (row 8)
    initialState.board[3][1] = 'B'  // D2 (row 7)
    initialState.board[3][2] = 'B'  // D3 (row 6)
    initialState.board[3][3] = 'W'  // D4 (row 6)
    initialState.board[3][4] = 'W'  // D5 (row 5)
    initialState.board[3][5] = 'B'  // D6 (row 4)

    // Row E (column 4): B, W, W, W, B, B, B, empty, empty
    // E8, E9 are empty
    initialState.board[4][0] = 'B'  // E1 (row 8)
    initialState.board[4][1] = 'W'  // E2 (row 7)
    initialState.board[4][2] = 'W'  // E3 (row 6)
    initialState.board[4][3] = 'W'  // E4 (row 6)
    initialState.board[4][4] = 'B'  // E5 (row 5)
    initialState.board[4][5] = 'B'  // E6 (row 4)
    initialState.board[4][6] = 'B'  // E7 (row 3)

    // Row F (column 5): W, W, W, B, B, W, B, B, B
    initialState.board[5][0] = 'W'  // F1 (row 8)
    initialState.board[5][1] = 'W'  // F2 (row 7)
    initialState.board[5][2] = 'W'  // F3 (row 6)
    initialState.board[5][3] = 'B'  // F4 (row 6)
    initialState.board[5][4] = 'B'  // F5 (row 5)
    initialState.board[5][5] = 'W'  // F6 (row 4)
    initialState.board[5][6] = 'B'  // F7 (row 3)
    initialState.board[5][7] = 'B'  // F8 (row 2)
    initialState.board[5][8] = 'B'  // F9 (row 1)

    // Row G (column 6): W, empty, empty, W, W, W, W, W, B
    // G2, G3 are empty
    initialState.board[6][0] = 'W'  // G1 (row 8)
    initialState.board[6][3] = 'W'  // G4 (row 6)
    initialState.board[6][4] = 'W'  // G5 (row 5)
    initialState.board[6][5] = 'W'  // G6 (row 4)
    initialState.board[6][6] = 'W'  // G7 (row 3)
    initialState.board[6][7] = 'W'  // G8 (row 2)
    initialState.board[6][8] = 'B'  // G9 (row 1)

    // Row H (column 7): W, empty, W, W, empty, W, W, empty, W
    // H2, H5, H8 are empty
    initialState.board[7][0] = 'W'  // H1 (row 8)
    initialState.board[7][2] = 'W'  // H3 (row 6)
    initialState.board[7][3] = 'W'  // H4 (row 6)
    initialState.board[7][5] = 'W'  // H6 (row 4)
    initialState.board[7][6] = 'W'  // H7 (row 3)
    initialState.board[7][8] = 'W'  // H9 (row 1)

    // Row I (column 8): empty, W, empty, empty, empty, empty, empty, empty, empty
    // I1, I3, I4, I5, I6, I7, I8, I9 are empty
    initialState.board[8][1] = 'W'  // I2 (row 7)

    return initialState
  })
  const [hover, setHover] = useState<{ x: number; y: number; color: "B" | "W" } | null>(null)
  const [step, setStep] = useState(0)
  const [showBlackTerritory, setShowBlackTerritory] = useState(false)
  const [showWhiteTerritory, setShowWhiteTerritory] = useState(false)
  const [showCounting, setShowCounting] = useState(false)
  const [blackScore, setBlackScore] = useState(0)
  const [whiteScore, setWhiteScore] = useState(0)
  const [blackTerritoryPoints, setBlackTerritoryPoints] = useState<Array<{ x: number; y: number }>>([])
  const [whiteTerritoryPoints, setWhiteTerritoryPoints] = useState<Array<{ x: number; y: number }>>([])
  const [currentLesson, setCurrentLesson] = useState(1)

  // Lesson 2: Advanced Counting states
  const [deadStones, setDeadStones] = useState<Array<{ x: number; y: number }>>([])
  const [blackCaptures, setBlackCaptures] = useState(0)
  const [whiteCaptures, setWhiteCaptures] = useState(0)
  const [komi, setKomi] = useState(5.5)
  const [showDeadStones, setShowDeadStones] = useState(false)

  const stones = useMemo(() => toStoneArray(state.board), [state.board])

  // Lesson 2: Advanced Counting functions
  const toggleDeadStone = (x: number, y: number) => {
    const stoneExists = state.board[x][y]
    if (!stoneExists) return // Can't mark empty intersections as dead

    const isDead = deadStones.some(stone => stone.x === x && stone.y === y)

    if (isDead) {
      // Remove from dead stones
      setDeadStones(prev => prev.filter(stone => !(stone.x === x && stone.y === y)))
      // Remove from captures
      if (stoneExists === 'B') {
        setWhiteCaptures(prev => Math.max(0, prev - 1))
      } else {
        setBlackCaptures(prev => Math.max(0, prev - 1))
      }
    } else {
      // Add to dead stones
      setDeadStones(prev => [...prev, { x, y }])
      // Add to captures
      if (stoneExists === 'B') {
        setWhiteCaptures(prev => prev + 1)
      } else {
        setBlackCaptures(prev => prev + 1)
      }
    }
  }

  const getFinalScores = () => {
    const blackTerritory = blackTerritoryPoints.filter(coord =>
      state.board[coord.x][coord.y] === null
    ).length
    const whiteTerritory = whiteTerritoryPoints.filter(coord =>
      state.board[coord.x][coord.y] === null
    ).length

    return {
      black: blackTerritory + blackCaptures,
      white: whiteTerritory + whiteCaptures + komi
    }
  };

  const resetAdvancedLesson = () => {
    setDeadStones([])
    setBlackCaptures(0)
    setWhiteCaptures(0)
    setKomi(5.5)
    setShowDeadStones(false)
    setShowBlackTerritory(false)
    setShowWhiteTerritory(false)
    setShowCounting(false)
  };

  const calculateTerritory = () => {
    // Define territory points based on the specification
    // Note: BoardSvg shows Row 1 at top, Row 9 at bottom
    // Array indices: Row 1 = index 8, Row 9 = index 0
    // Column A = index 0, Column I = index 8

    // Black territories (19 points total):
    // A1,B1,G1,H1,I1,A2,C2,G2,I2,A3,C3,G3,H3,I3,G4,H4,I4,H5,I5
    // Mapping: A1=top-left (x:0, y:0), I9=bottom-right (x:8, y:8)
    const blackTerritoryCoords = [
      // Row 1 (y:0): A1, B1, G1, H1, I1
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 },
      // Row 2 (y:1): A2, C2, G2, I2
      { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 6, y: 1 }, { x: 8, y: 1 },
      // Row 3 (y:2): A3, C3, G3, H3, I3
      { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 },
      // Row 4 (y:3): G4, H4, I4
      { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 },
      // Row 5 (y:4): H5, I5
      { x: 7, y: 4 }, { x: 8, y: 4 },
    ]

    // White territories:
    // B7,C7,B8,E8,H8,A9,C9,D9,E9,F9,G9,H9,I9
    const whiteTerritoryCoords = [
      // Row 7 (y:6): B7, C7
      { x: 1, y: 6 }, { x: 2, y: 6 },
      // Row 8 (y:7): B8, E8, H8
      { x: 1, y: 7 }, { x: 4, y: 7 }, { x: 7, y: 7 },
      // Row 9 (y:8): A9, C9, D9, E9, F9, G9, H9, I9
      { x: 0, y: 8 }, { x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 },
    ]

    // Count only empty intersections for scoring, but show ALL territory points for highlighting
    const validBlackTerritory = blackTerritoryCoords.filter(coord =>
      state.board[coord.x][coord.y] === null
    )

    const validWhiteTerritory = whiteTerritoryCoords.filter(coord =>
      state.board[coord.x][coord.y] === null
    )

    // Set scores based on empty intersections only
    setBlackScore(validBlackTerritory.length)
    setWhiteScore(validWhiteTerritory.length)

    // Set ALL territory points for highlighting (including those with stones)
    setBlackTerritoryPoints(blackTerritoryCoords)
    setWhiteTerritoryPoints(whiteTerritoryCoords)
    setShowCounting(true)
  };

  const isSurroundedBy = (x: number, y: number, color: 'B' | 'W') => {
    // Simple check - if all adjacent stones are of the specified color
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    let surrounded = true

    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
        if (state.board[nx][ny] !== color) {
          surrounded = false
          break
        }
      }
    }

    return surrounded
  };

  const resetLesson = () => {
    const initialState = createInitialState()
    // Recreate the board according to the specified layout (A1-I9 coordinates)
    // Note: BoardSvg uses A=0, I=8 for columns and 9=0, 1=8 for rows

    // Row A (column 0): empty, empty, B, B, W, B, empty, empty, empty
    // A1, A2, A7, A8, A9 are empty
    initialState.board[0][2] = 'B'  // A3 (row 7)
    initialState.board[0][3] = 'B'  // A4 (row 6)
    initialState.board[0][4] = 'W'  // A5 (row 5)
    initialState.board[0][5] = 'B'  // A6 (row 4)

    // Row B (column 1): empty, B, empty, B, W, B, empty, B, empty
    // B1, B3, B7, B9 are empty
    initialState.board[1][1] = 'B'  // B2 (row 7)
    initialState.board[1][3] = 'B'  // B4 (row 6)
    initialState.board[1][4] = 'W'  // B5 (row 5)
    initialState.board[1][5] = 'B'  // B6 (row 4)
    initialState.board[1][7] = 'B'  // B8 (row 2)

    // Row C (column 2): empty, B, empty, B, W, B, empty, empty, empty
    // C1, C3, C7, C8, C9 are empty
    initialState.board[2][1] = 'B'  // C2 (row 7)
    initialState.board[2][3] = 'B'  // C4 (row 6)
    initialState.board[2][4] = 'W'  // C5 (row 5)
    initialState.board[2][5] = 'B'  // C6 (row 4)

    // Row D (column 3): B, B, B, W, W, B, empty, empty, empty
    // D7, D8, D9 are empty
    initialState.board[3][0] = 'B'  // D1 (row 8)
    initialState.board[3][1] = 'B'  // D2 (row 7)
    initialState.board[3][2] = 'B'  // D3 (row 6)
    initialState.board[3][3] = 'W'  // D4 (row 6)
    initialState.board[3][4] = 'W'  // D5 (row 5)
    initialState.board[3][5] = 'B'  // D6 (row 4)

    // Row E (column 4): B, W, W, W, B, B, B, empty, empty
    // E8, E9 are empty
    initialState.board[4][0] = 'B'  // E1 (row 8)
    initialState.board[4][1] = 'W'  // E2 (row 7)
    initialState.board[4][2] = 'W'  // E3 (row 6)
    initialState.board[4][3] = 'W'  // E4 (row 6)
    initialState.board[4][4] = 'B'  // E5 (row 5)
    initialState.board[4][5] = 'B'  // E6 (row 4)
    initialState.board[4][6] = 'B'  // E7 (row 3)

    // Row F (column 5): W, W, W, B, B, W, B, B, B
    initialState.board[5][0] = 'W'  // F1 (row 8)
    initialState.board[5][1] = 'W'  // F2 (row 7)
    initialState.board[5][2] = 'W'  // F3 (row 6)
    initialState.board[5][3] = 'B'  // F4 (row 6)
    initialState.board[5][4] = 'B'  // F5 (row 5)
    initialState.board[5][5] = 'W'  // F6 (row 4)
    initialState.board[5][6] = 'B'  // F7 (row 3)
    initialState.board[5][7] = 'B'  // F8 (row 2)
    initialState.board[5][8] = 'B'  // F9 (row 1)

    // Row G (column 6): W, empty, empty, W, W, W, W, W, B
    // G2, G3 are empty
    initialState.board[6][0] = 'W'  // G1 (row 8)
    initialState.board[6][3] = 'W'  // G4 (row 6)
    initialState.board[6][4] = 'W'  // G5 (row 5)
    initialState.board[6][5] = 'W'  // G6 (row 4)
    initialState.board[6][6] = 'W'  // G7 (row 3)
    initialState.board[6][7] = 'W'  // G8 (row 2)
    initialState.board[6][8] = 'B'  // G9 (row 1)

    // Row H (column 7): W, empty, W, W, empty, W, W, empty, W
    // H2, H5, H8 are empty
    initialState.board[7][0] = 'W'  // H1 (row 8)
    initialState.board[7][2] = 'W'  // H3 (row 6)
    initialState.board[7][3] = 'W'  // H4 (row 6)
    initialState.board[7][5] = 'W'  // H6 (row 4)
    initialState.board[7][6] = 'W'  // H7 (row 3)
    initialState.board[7][8] = 'W'  // H9 (row 1)

    // Row I (column 8): empty, W, empty, empty, empty, empty, empty, empty, empty
    // I1, I3, I4, I5, I6, I7, I8, I9 are empty
    initialState.board[8][1] = 'W'  // I2 (row 7)

    setState(initialState)
    setStep(0)
    setShowBlackTerritory(false)
    setShowWhiteTerritory(false)
    setShowCounting(false)
    setBlackScore(0)
    setWhiteScore(0)
    setBlackTerritoryPoints([])
    setWhiteTerritoryPoints([])
  };

  return (
    <div className="max-w-8xl mx-auto px-6 py-12">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <div className="bg-gradient-to-br from-tci-dark to-gray-800 rounded-3xl p-16 shadow-2xl mb-8">
          <h1 className="text-6xl font-bold text-white mb-6">
            {LESSONS.counting.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-tci-green to-green-400 mx-auto rounded-full mb-8"></div>

          {/* Lesson Selector */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setCurrentLesson(1)}
              className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${currentLesson === 1
                ? 'bg-gradient-to-r from-tci-green to-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
                }`}
            >
              Lesson 1: Basic Counting
            </button>
            <button
              onClick={() => setCurrentLesson(2)}
              className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${currentLesson === 2
                ? 'bg-gradient-to-r from-tci-green to-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
                }`}
            >
              Lesson 2: Advanced Counting
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 max-w-md mx-auto">
            <div className="tci-progress-track w-full">
              <div
                className="tci-progress-fill"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {currentLesson === 1 ? (
        // Lesson 1: Basic Counting
        <div className="mb-20">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            {/* Board Section */}
            <div className="xl:col-span-7">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-2xl border border-gray-200">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-tci-dark mb-4">Interactive Game Board</h2>
                  <p className="text-lg text-gray-600">Click the buttons below to explore territory counting</p>
                </div>
                <div className="flex justify-center">
                  <div className="inline-block">
                    <BoardSvg
                      size={580}
                      stones={stones}
                      lastMove={state.lastMove}
                      hover={hover}
                      onPlace={() => { }} // Disabled for finished game
                      showCoords
                      blackTerritory={showBlackTerritory ? blackTerritoryPoints : []}
                      whiteTerritory={showWhiteTerritory ? whiteTerritoryPoints : []}
                      showBlackTerritory={showBlackTerritory}
                      showWhiteTerritory={showWhiteTerritory}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="xl:col-span-5 space-y-8">
              <div className="bg-gradient-to-br from-tci-light to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-tci-green to-green-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold text-tci-dark">What</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{LESSONS.counting.what}</p>

                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-tci-dark">Why this matters</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{LESSONS.counting.why}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-xl border border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Interactive Territory Counting</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  This is a finished game! Use the tools below to learn how to count territory (empty intersections surrounded by your stones) and determine the winner.
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        if (!showBlackTerritory) {
                          const blackTerritoryCoords = [
                            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 },
                            { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 6, y: 1 }, { x: 8, y: 1 },
                            { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 },
                            { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 },
                            { x: 7, y: 4 }, { x: 8, y: 4 },
                          ]
                          setBlackTerritoryPoints(blackTerritoryCoords)
                        }
                        setShowBlackTerritory(!showBlackTerritory)
                      }}
                      className={`px-6 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${showBlackTerritory
                        ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg border border-gray-200'
                        }`}
                    >
                      {showBlackTerritory ? 'Hide Black Territory' : 'Show Black Territory'}
                    </button>
                    <button
                      onClick={() => {
                        if (!showWhiteTerritory) {
                          const whiteTerritoryCoords = [
                            { x: 1, y: 6 }, { x: 2, y: 6 },
                            { x: 1, y: 7 }, { x: 4, y: 7 }, { x: 7, y: 7 },
                            { x: 0, y: 8 }, { x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 },
                          ]
                          setWhiteTerritoryPoints(whiteTerritoryCoords)
                        }
                        setShowWhiteTerritory(!showWhiteTerritory)
                      }}
                      className={`px-6 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${showWhiteTerritory
                        ? 'bg-gradient-to-r from-white to-gray-100 text-black border-2 border-gray-400 shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg border border-gray-200'
                        }`}
                    >
                      {showWhiteTerritory ? 'Hide White Territory' : 'Show White Territory'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setBlackScore(19)
                      setWhiteScore(13)
                      setShowCounting(true)
                    }}
                    className="w-full bg-gradient-to-r from-tci-green to-green-600 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Count Territory & Determine Winner
                  </button>

                  <button
                    onClick={resetLesson}
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-lg font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Reset Game
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Territory Visualization */}
          {(showBlackTerritory || showWhiteTerritory) && (
            <div className="mt-8 tci-card bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Territory Visualization
              </h3>
              <p className="text-blue-700 text-sm">
                {showBlackTerritory && "Black territory (19 points) highlighted with dark gray dots"}
                {showBlackTerritory && showWhiteTerritory && " and "}
                {showWhiteTerritory && "White territory (13 points) highlighted with light gray dots"}
              </p>
            </div>
          )}

          {/* Final Score Display */}
          {showCounting && (
            <div className="mt-8 tci-card bg-tci-light">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="text-lg font-semibold text-tci-dark mb-4">
                  Final Score
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black text-white p-3 rounded">
                    <div className="text-sm">Black Territory</div>
                    <div className="text-2xl font-bold">{blackScore}</div>
                  </div>
                  <div className="bg-white text-black border-2 border-gray-400 p-3 rounded">
                    <div className="text-sm">White Territory</div>
                    <div className="text-2xl font-bold">{whiteScore}</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-tci-dark">
                  {blackScore > whiteScore ? 'Black Wins!' :
                    whiteScore > blackScore ? 'White Wins!' :
                      'Tie Game!'}
                </div>
                <div className="mt-4">
                  <a href="/shapes" className="tci-button-primary">
                    Next: Shape Patterns
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Lesson 2: Advanced Counting
        <div className="space-y-8">
          {/* Lesson Content */}
          <div className="tci-card bg-tci-light">
            <h2 className="text-2xl font-semibold text-tci-dark mb-6">
              Advanced Counting: Dead Stones, Captures & Komi
            </h2>

            <div className="space-y-6">
              {/* Territory Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Territory</h3>
                <p className="text-blue-700 text-sm">
                  Territory is the number of empty intersections completely surrounded by your stones. Each point of territory is worth 1 point.
                </p>
              </div>

              {/* Dead Stones Explanation */}
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h3 className="font-semibold text-red-800 mb-2">Dead Stones</h3>
                <p className="text-red-700 text-sm">
                  Dead stones are stones that cannot avoid capture. During counting, they are removed from the board and added to the opponent&apos;s captured stones.
                </p>
              </div>

              {/* Captures Explanation */}
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-semibold text-green-800 mb-2">Captures</h3>
                <p className="text-green-700 text-sm">
                  Captured stones count as 1 point each and are added to your score at the end.
                </p>
              </div>

              {/* Komi Explanation */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Komi</h3>
                <p className="text-yellow-700 text-sm">
                  Komi is compensation points given to White (usually 6.5 or 7.5 points on 19×19 boards, can be smaller like 5.5 on 9×9) because Black played first. Komi is always added to White&apos;s final score.
                </p>
              </div>

              {/* Scoring Formula */}
              <div className="bg-purple-50 border border-purple-200 rounded p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Scoring Formula</h3>
                <p className="text-purple-700 text-sm">
                  <strong>Final Score = Territory + Captured Stones (+ Komi for White)</strong><br />
                  The player with the higher final score wins.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Board */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-block">
                <BoardSvg
                  size={580}
                  stones={stones}
                  lastMove={state.lastMove}
                  hover={hover}
                  onPlace={() => { }} // Disabled for finished game
                  onStoneClick={toggleDeadStone}
                  showCoords
                  blackTerritory={showBlackTerritory ? blackTerritoryPoints : []}
                  whiteTerritory={showWhiteTerritory ? whiteTerritoryPoints : []}
                  showBlackTerritory={showBlackTerritory}
                  showWhiteTerritory={showWhiteTerritory}
                  deadStones={deadStones}
                  showDeadStones={showDeadStones}
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Interactive Controls */}
              <div className="tci-card bg-tci-light">
                <h3 className="text-lg font-semibold text-tci-dark mb-4">
                  Interactive Controls
                </h3>

                <div className="space-y-4">
                  {/* Territory Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (!showBlackTerritory) {
                          const blackTerritoryCoords = [
                            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 },
                            { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 6, y: 1 }, { x: 8, y: 1 },
                            { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 },
                            { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 },
                            { x: 7, y: 4 }, { x: 8, y: 4 },
                          ]
                          setBlackTerritoryPoints(blackTerritoryCoords)
                        }
                        setShowBlackTerritory(!showBlackTerritory)
                      }}
                      className={`px-4 py-2 rounded ${showBlackTerritory
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {showBlackTerritory ? 'Hide Black Territory' : 'Show Black Territory'}
                    </button>
                    <button
                      onClick={() => {
                        if (!showWhiteTerritory) {
                          const whiteTerritoryCoords = [
                            { x: 1, y: 6 }, { x: 2, y: 6 },
                            { x: 1, y: 7 }, { x: 4, y: 7 }, { x: 7, y: 7 },
                            { x: 0, y: 8 }, { x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 },
                          ]
                          setWhiteTerritoryPoints(whiteTerritoryCoords)
                        }
                        setShowWhiteTerritory(!showWhiteTerritory)
                      }}
                      className={`px-4 py-2 rounded ${showWhiteTerritory
                        ? 'bg-white text-black border-2 border-gray-400'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {showWhiteTerritory ? 'Hide White Territory' : 'Show White Territory'}
                    </button>
                  </div>

                  {/* Dead Stones Toggle */}
                  <button
                    onClick={() => setShowDeadStones(!showDeadStones)}
                    className={`w-full px-4 py-2 rounded ${showDeadStones
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {showDeadStones ? 'Hide Dead Stone Marking' : 'Toggle Dead Stone Marking'}
                  </button>

                  {/* Komi Selector */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Komi:</label>
                    <select
                      value={komi}
                      onChange={(e) => setKomi(parseFloat(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={0.5}>0.5</option>
                      <option value={5.5}>5.5</option>
                      <option value={6.5}>6.5</option>
                      <option value={7.5}>7.5</option>
                    </select>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetAdvancedLesson}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Reset Advanced Lesson
                  </button>
                </div>
              </div>

              {/* Live Score Display */}
              <div className="tci-card bg-tci-light">
                <h3 className="text-lg font-semibold text-tci-dark mb-4">
                  Live Score Calculation
                </h3>

                {(() => {
                  const scores = getFinalScores()
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black text-white p-4 rounded">
                          <div className="text-sm">Black</div>
                          <div className="text-2xl font-bold">{scores.black}</div>
                          <div className="text-xs mt-2 space-y-1">
                            <div>Territory: {blackTerritoryPoints.filter(coord => state.board[coord.x][coord.y] === null).length}</div>
                            <div className="border-t border-gray-700 pt-1">
                              <div>{t.capturedStonesBlack}</div>
                              <div className="text-green-400 font-bold">+{blackCaptures} {t.plusPoints}</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white text-black border-2 border-gray-400 p-4 rounded">
                          <div className="text-sm">White</div>
                          <div className="text-2xl font-bold">{scores.white}</div>
                          <div className="text-xs mt-2 space-y-1">
                            <div>Territory: {whiteTerritoryPoints.filter(coord => state.board[coord.x][coord.y] === null).length}</div>
                            <div className="border-t border-gray-300 pt-1">
                              <div>{t.capturedStonesWhite}</div>
                              <div className="text-green-600 font-bold">+{whiteCaptures} {t.plusPoints}</div>
                            </div>
                            <div className="border-t border-gray-300 pt-1">
                              <div>Komi: {komi}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-semibold text-tci-dark">
                          {scores.black > scores.white ? 'Black Wins!' :
                            scores.white > scores.black ? 'White Wins!' :
                              'Tie Game!'}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Instructions */}
              <div className="tci-card bg-blue-50 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Instructions
                </h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Click &quot;Show Territory&quot; to highlight territory points</li>
                  <li>• Toggle &quot;Dead Stone Marking&quot; then click stones to mark them as dead</li>
                  <li>• Adjust komi using the dropdown</li>
                  <li>• Watch the live score update automatically</li>
                  <li>• Dead stones fade out and count as captures for the opponent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




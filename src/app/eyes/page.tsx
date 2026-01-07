'use client'

import { useState, useMemo } from 'react'
import BoardSvg from '@/components/BoardSvg'
import { createInitialState, placeStone, toStoneArray, GameState } from '@/lib/engine'
import { LESSONS } from '@/content/strings'
import LessonNavigation from '@/components/LessonNavigation'

const setupLessonBoard = (lesson: number) => {
  const initialState = createInitialState()

  if (lesson === 1) {
    // Lesson 1: Self-capture illegal - surrounded black group
    initialState.board[3][3] = 'B'
    initialState.board[3][4] = 'B'
    initialState.board[3][5] = 'B'
    initialState.board[4][3] = 'B'
    initialState.board[4][5] = 'B'
    initialState.board[5][3] = 'B'
    initialState.board[5][4] = 'B'
    initialState.board[5][5] = 'B'
    // Surround with white stones
    initialState.board[2][3] = 'W'
    initialState.board[2][4] = 'W'
    initialState.board[2][5] = 'W'
    initialState.board[3][2] = 'W'
    initialState.board[4][2] = 'W'
    initialState.board[5][2] = 'W'
    initialState.board[6][3] = 'W'
    initialState.board[6][4] = 'W'
    initialState.board[6][5] = 'W'
    initialState.board[3][6] = 'W'
    initialState.board[4][6] = 'W'
    initialState.board[5][6] = 'W'
  } else if (lesson === 2) {
    // Lesson 2: Capture with self-capture - white group in center, black group surrounding
    initialState.board[3][3] = 'W'
    initialState.board[3][4] = 'W'
    initialState.board[3][5] = 'W'
    initialState.board[4][3] = 'W'
    initialState.board[4][5] = 'W'
    initialState.board[5][3] = 'W'
    initialState.board[5][4] = 'W'
    initialState.board[5][5] = 'W'
    // Add black stones that will be captured when white self-captures
    initialState.board[2][3] = 'B'
    initialState.board[2][4] = 'B'
    initialState.board[2][5] = 'B'
    initialState.board[3][2] = 'B'
    initialState.board[4][2] = 'B'
    initialState.board[5][2] = 'B'
    initialState.board[6][3] = 'B'
    initialState.board[6][4] = 'B'
    initialState.board[6][5] = 'B'
    initialState.board[3][6] = 'B'
    initialState.board[4][6] = 'B'
    initialState.board[5][6] = 'B'
    // Add one more layer of black stones to make them capturable
    initialState.board[1][3] = 'B'
    initialState.board[1][4] = 'B'
    initialState.board[1][5] = 'B'
    initialState.board[3][1] = 'B'
    initialState.board[4][1] = 'B'
    initialState.board[5][1] = 'B'
    initialState.board[7][3] = 'B'
    initialState.board[7][4] = 'B'
    initialState.board[7][5] = 'B'
    initialState.board[3][7] = 'B'
    initialState.board[4][7] = 'B'
    initialState.board[5][7] = 'B'
  } else if (lesson === 3) {
    // Lesson 3: Two eyes - 13-stone white group with 2 eyes, surrounded by black stones
    // Pattern: 3-2-3-2-3 stones with 2 eyes
    // Row 1: 3 stones
    initialState.board[2][2] = 'W'
    initialState.board[2][3] = 'W'
    initialState.board[2][4] = 'W'
    // Row 2: 2 stones
    initialState.board[3][2] = 'W'
    initialState.board[3][4] = 'W'
    // Row 3: 3 stones
    initialState.board[4][2] = 'W'
    initialState.board[4][3] = 'W'
    initialState.board[4][4] = 'W'
    // Row 4: 2 stones
    initialState.board[5][2] = 'W'
    initialState.board[5][4] = 'W'
    // Row 5: 3 stones
    initialState.board[6][2] = 'W'
    initialState.board[6][3] = 'W'
    initialState.board[6][4] = 'W'

    // Surround with black stones to show it cannot be killed
    // Top and bottom
    initialState.board[1][1] = 'B'
    initialState.board[1][2] = 'B'
    initialState.board[1][3] = 'B'
    initialState.board[1][4] = 'B'
    initialState.board[1][5] = 'B'
    initialState.board[7][1] = 'B'
    initialState.board[7][2] = 'B'
    initialState.board[7][3] = 'B'
    initialState.board[7][4] = 'B'
    initialState.board[7][5] = 'B'
    // Left and right
    initialState.board[2][1] = 'B'
    initialState.board[3][1] = 'B'
    initialState.board[4][1] = 'B'
    initialState.board[5][1] = 'B'
    initialState.board[6][1] = 'B'
    initialState.board[2][5] = 'B'
    initialState.board[3][5] = 'B'
    initialState.board[4][5] = 'B'
    initialState.board[5][5] = 'B'
    initialState.board[6][5] = 'B'
    // Additional surrounding stones
    initialState.board[0][2] = 'B'
    initialState.board[0][3] = 'B'
    initialState.board[0][4] = 'B'
    initialState.board[8][2] = 'B'
    initialState.board[8][3] = 'B'
    initialState.board[8][4] = 'B'
    initialState.board[2][0] = 'B'
    initialState.board[3][0] = 'B'
    initialState.board[4][0] = 'B'
    initialState.board[5][0] = 'B'
    initialState.board[6][0] = 'B'
    initialState.board[2][6] = 'B'
    initialState.board[3][6] = 'B'
    initialState.board[4][6] = 'B'
    initialState.board[5][6] = 'B'
    initialState.board[6][6] = 'B'
  }

  return initialState
}

export default function EyesPage() {
  const [state, setState] = useState<GameState>(() => {
    // Set up initial board based on current lesson
    return setupLessonBoard(1)
  })
  const [hover, setHover] = useState<{ x: number; y: number; color: "B" | "W" } | null>(null)
  const [step, setStep] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(1) // 1: Self-capture, 2: Capture with self-capture, 3: Two eyes
  const [lessonStep, setLessonStep] = useState(0)

  const stones = useMemo(() => toStoneArray(state.board), [state.board])

  const handlePlace = (x: number, y: number) => {
    // Force only black pieces for all lessons
    const color = "B"
    try {
      const { nextState, captured } = placeStone(state, { x, y }, color)
      setState(nextState)
      setStep(step + 1)

      // Check for lesson-specific scenarios
      if (currentLesson === 1) {
        // Lesson 1: Self-capture should be illegal
        // If we are here, the move was legal (didn't throw), so it wasn't self-capture
      } else if (currentLesson === 2) {
        // Lesson 2: Self-capture becomes legal when capturing enemy
        if (captured.length > 0) {
          setLessonStep(1) // Show self-capture is now legal
        }
      } else if (currentLesson === 3) {
        // Lesson 3: Check if we created two eyes
        const blackStones = nextState.board.flat().filter(cell => cell === 'B').length
        if (blackStones >= 10) { // Approximate check for two eyes
          setLessonStep(1) // Show two eyes created
        }
      }
    } catch (error) {
      // Show error message for illegal moves
      if (currentLesson === 1) {
        setLessonStep(1) // Show why the move was illegal
      }
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
      // Always show black pieces for all lessons
      setHover({ x: i, y: j, color: "B" })
    }
  }

  const handleMouseLeave = () => {
    setHover(null)
  }

  const resetLesson = () => {
    const newState = setupLessonBoard(currentLesson)
    setState(newState)
    setStep(0)
    setLessonStep(0)
  }

  const switchLesson = (lesson: number) => {
    setCurrentLesson(lesson)
    setLessonStep(0)
    setStep(0)
    const newState = setupLessonBoard(lesson)
    setState(newState)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-tci-dark mb-4">
          {LESSONS.eyes.title}
        </h1>
        <div className="tci-progress-track w-full max-w-md mx-auto">
          <div
            className="tci-progress-fill"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex justify-center lg:justify-start">
          <div
            className="inline-block"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <BoardSvg
              size={580}
              stones={stones}
              lastMove={state.lastMove}
              hover={hover}
              onPlace={handlePlace}
              showCoords
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Lesson Selection */}
          <div className="tci-card">
            <h3 className="text-xl font-semibold text-tci-dark mb-4">
              Eyes & Life Interactive Lessons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => switchLesson(1)}
                className={`px-4 py-3 rounded-lg text-center ${currentLesson === 1
                  ? 'bg-tci-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <div className="font-semibold">Lesson 1</div>
                <div className="text-sm">Self-Capture</div>
              </button>
              <button
                onClick={() => switchLesson(2)}
                className={`px-4 py-3 rounded-lg text-center ${currentLesson === 2
                  ? 'bg-tci-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <div className="font-semibold">Lesson 2</div>
                <div className="text-sm">Capture with Self-Capture</div>
              </button>
              <button
                onClick={() => switchLesson(3)}
                className={`px-4 py-3 rounded-lg text-center ${currentLesson === 3
                  ? 'bg-tci-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <div className="font-semibold">Lesson 3</div>
                <div className="text-sm">Two Eyes</div>
              </button>
            </div>
          </div>

          {/* Current Lesson Content */}
          {currentLesson === 1 && (
            <div className="tci-card">
              <h3 className="text-lg font-semibold text-tci-dark mb-4">
                Lesson 1: Self-Capture is Illegal
              </h3>
              <p className="text-gray-700 mb-4">
                The black group is surrounded by white stones. Try to place a black stone inside the black group.
                This would capture your own stones, which is illegal in Go.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Rule:</strong> You cannot capture your own stones. This prevents suicide moves.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={resetLesson}
                  className="tci-button-secondary"
                >
                  Reset
                </button>
                <div className="text-sm text-gray-600 flex items-center">
                  Try placing inside the surrounded black group
                </div>
              </div>
            </div>
          )}

          {currentLesson === 2 && (
            <div className="tci-card">
              <h3 className="text-lg font-semibold text-tci-dark mb-4">
                Lesson 2: Capture with Self-Capture (Exception)
              </h3>
              <p className="text-gray-700 mb-4">
                Now try to place a black stone inside the white group. This will capture both your own stones
                AND the surrounding white stones, making self-capture legal!
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  <strong>Exception:</strong> Self-capture becomes legal when you also capture enemy stones in the same move.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={resetLesson}
                  className="tci-button-secondary"
                >
                  Reset
                </button>
                <div className="text-sm text-gray-600 flex items-center">
                  Try placing inside the white group to capture both
                </div>
              </div>
            </div>
          )}

          {currentLesson === 3 && (
            <div className="tci-card">
              <h3 className="text-lg font-semibold text-tci-dark mb-4">
                Lesson 3: Two Eyes for Life
              </h3>
              <p className="text-gray-700 mb-4">
                The white group has two eyes and is completely surrounded by black stones.
                Try to capture the white group - you&apos;ll find it&apos;s impossible! Two eyes make a group uncapturable.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Life Rule:</strong> Groups with two eyes cannot be captured and are considered alive.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={resetLesson}
                  className="tci-button-secondary"
                >
                  Reset
                </button>
                <div className="text-sm text-gray-600 flex items-center">
                  Try to capture the white group - it&apos;s impossible!
                </div>
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {lessonStep === 1 && currentLesson === 1 && (
            <div className="tci-card bg-red-50 border border-red-200">
              <div className="text-center">
                <div className="text-2xl mb-2">❌</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Self-Capture is Illegal!
                </h3>
                <p className="text-red-700">
                  You cannot capture your own stones. This move is not allowed in Go.
                </p>
              </div>
            </div>
          )}

          {lessonStep === 1 && currentLesson === 2 && (
            <div className="tci-card bg-green-50 border border-green-200">
              <div className="text-center">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Self-Capture Exception Works!
                </h3>
                <p className="text-green-700">
                  Because you also captured enemy stones, self-capture becomes legal.
                  You captured both your own stones and the surrounding white stones.
                </p>
              </div>
            </div>
          )}

          {lessonStep === 1 && currentLesson === 3 && (
            <div className="tci-card bg-blue-50 border border-blue-200">
              <div className="text-center">
                <div className="text-2xl mb-2">👁️</div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Two Eyes Make Life!
                </h3>
                <p className="text-blue-700">
                  The white group has two eyes and cannot be captured, even when completely surrounded!
                  This demonstrates the power of two eyes in Go.
                </p>
              </div>
            </div>
          )}

          {/* Completion */}
          {lessonStep === 1 && (
            <div className="tci-card bg-tci-light">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="text-lg font-semibold text-tci-dark mb-2">
                  Lesson {currentLesson} Mastered!
                </h3>
                <p className="text-gray-700 mb-4">
                  {currentLesson === 1 && "You've learned that self-capture is illegal in Go."}
                  {currentLesson === 2 && "You've learned the exception: self-capture becomes legal when also capturing enemies."}
                  {currentLesson === 3 && "You've learned that two eyes make a group alive and uncapturable."}
                </p>
                {currentLesson < 3 ? (
                  <button
                    onClick={() => switchLesson(currentLesson + 1)}
                    className="tci-button-primary"
                  >
                    Next Lesson
                  </button>
                ) : (
                  <a href="/counting" className="tci-button-primary">
                    Next: Counting Territory
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <LessonNavigation currentLessonId={3} />
    </div>
  )
}




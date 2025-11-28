'use client'

import { useState, useMemo } from 'react'
import BoardSvg from '@/components/BoardSvg'
import { createInitialState, placeStone, toStoneArray, GameState } from '@/lib/engine'
import { LESSONS } from '@/content/strings'

export default function KoPage() {
  const [state, setState] = useState<GameState>(() => {
    const initialState = createInitialState()
    // Set up a ko situation
    initialState.board[3][3] = 'B'
    initialState.board[3][4] = 'W'
    initialState.board[4][3] = 'W'
    initialState.board[4][4] = 'B'
    initialState.board[3][5] = 'B'
    initialState.board[4][5] = 'W'
    return initialState
  })
  const [hover, setHover] = useState<{x: number; y: number; color: "B"|"W"}|null>(null)
  const [step, setStep] = useState(0)

  const stones = useMemo(() => toStoneArray(state.board), [state.board])

  const handlePlace = (x: number, y: number) => {
    const color = state.toPlay
    try {
      const { nextState } = placeStone(state, { x, y }, color)
      setState(nextState)
      setStep(step + 1)
    } catch (error) {
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
      setHover({ x: i, y: j, color: state.toPlay })
    }
  }

  const handleMouseLeave = () => {
    setHover(null)
  }

  const resetLesson = () => {
    const initialState = createInitialState()
    initialState.board[3][3] = 'B'
    initialState.board[3][4] = 'W'
    initialState.board[4][3] = 'W'
    initialState.board[4][4] = 'B'
    initialState.board[3][5] = 'B'
    initialState.board[4][5] = 'W'
    setState(initialState)
    setStep(0)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-tci-dark mb-4">
          {LESSONS.ko.title}
        </h1>
        <div className="tci-progress-track w-full max-w-md mx-auto">
          <div 
            className="tci-progress-fill" 
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div 
            className="inline-block"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <BoardSvg
              stones={stones}
              lastMove={state.lastMove}
              hover={hover}
              onPlace={handlePlace}
              showCoords
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="tci-card">
            <h3 className="text-xl font-semibold text-tci-dark mb-4">
              What
            </h3>
            <p className="text-gray-700 mb-4">{LESSONS.ko.what}</p>
            
            <h3 className="text-xl font-semibold text-tci-dark mb-4">
              Why this matters
            </h3>
            <p className="text-gray-700">{LESSONS.ko.why}</p>
          </div>

          <div className="tci-card">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              Try the ko fight
            </h3>
            <p className="text-gray-700 mb-4">
              This position shows a ko situation. Try to capture and recapture to see the ko rule in action.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={resetLesson}
                className="tci-button-secondary"
              >
                Reset
              </button>
              <div className="text-sm text-gray-600 flex items-center">
                Step {step + 1} of 3
              </div>
            </div>
          </div>

          {step >= 2 && (
            <div className="tci-card bg-tci-light">
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <h3 className="text-lg font-semibold text-tci-dark mb-2">
                  Ko understood!
                </h3>
                <p className="text-gray-700 mb-4">
                  You've learned about the ko rule and how to handle ko fights.
                </p>
                <a href="/eyes" className="tci-button-primary">
                  Next: Eyes & Life
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}














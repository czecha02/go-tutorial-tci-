'use client'

import { useState, useMemo } from 'react'
import BoardSvg from '@/components/BoardSvg'
import { createInitialState, placeStone, isLegalMove, toStoneArray, explainMove, GameState } from '@/lib/engine'

export default function PracticePage() {
  const [state, setState] = useState<GameState>(createInitialState())
  const [hover, setHover] = useState<{x: number; y: number; color: "B"|"W"}|null>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintText, setHintText] = useState('')

  const stones = useMemo(() => toStoneArray(state.board), [state.board])

  const handlePlace = (x: number, y: number) => {
    const color = state.toPlay
    if (!isLegalMove(state, { x, y }, color)) {
      setHintText('Illegal move! Try a different position.')
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2000)
      return
    }

    try {
      const { nextState, captured } = placeStone(state, { x, y }, color)
      setState(nextState)
      setHintText('')
      setShowHint(false)
    } catch (error) {
      setHintText('Illegal move! Try a different position.')
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2000)
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

  const getHint = () => {
    // Simple AI: look for good moves
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (isLegalMove(state, { x, y }, state.toPlay)) {
          return explainMove(state, { x, y }, state.toPlay)
        }
      }
    }
    return "No legal moves available"
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-tci-dark mb-4">
          Practice Game
        </h1>
        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600">Captured</div>
            <div className="text-lg font-semibold">Black: {state.captured.B}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">To Play</div>
            <div className={`text-lg font-semibold ${state.toPlay === 'B' ? 'text-black' : 'text-gray-600'}`}>
              {state.toPlay === 'B' ? 'Black' : 'White'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Captured</div>
            <div className="text-lg font-semibold">White: {state.captured.W}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
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

        <div className="lg:w-80">
          <div className="tci-card">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              Game Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Player</div>
                <div className={`font-semibold ${state.toPlay === 'B' ? 'text-black' : 'text-gray-600'}`}>
                  {state.toPlay === 'B' ? 'Black' : 'White'} to play
                </div>
              </div>
              
              {state.lastMove && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Last Move</div>
                  <div className="font-semibold">
                    {String.fromCharCode(65 + state.lastMove.x)}{9 - state.lastMove.y}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const hint = getHint()
                  setHintText(hint)
                  setShowHint(true)
                  setTimeout(() => setShowHint(false), 3000)
                }}
                className="tci-button-secondary w-full"
              >
                Get Hint
              </button>

              <button
                onClick={() => setState(createInitialState())}
                className="tci-button-primary w-full"
              >
                New Game
              </button>
            </div>
          </div>

          {showHint && (
            <div className="mt-4 p-4 bg-tci-light rounded-lg">
              <div className="text-sm font-medium text-tci-dark mb-1">Hint:</div>
              <div className="text-sm text-gray-700">{hintText}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




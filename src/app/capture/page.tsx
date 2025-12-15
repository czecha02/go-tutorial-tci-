'use client'

import { useState, useMemo } from 'react'
import BoardSvg from '@/components/BoardSvg'
import { createInitialState, placeStone, toStoneArray, GameState } from '@/lib/engine'
import { LESSONS } from '@/content/strings'

export default function CapturePage() {
  const [state, setState] = useState<GameState>(() => {
    const initialState = createInitialState()
    // Pre-place white stones in vulnerable positions for capture practice
    // Group 1: Single stone (1 liberty) - Top left
    initialState.board[1][1] = 'W'

    // Group 2: Two connected stones (2 liberties) - Top right
    initialState.board[7][1] = 'W'
    initialState.board[7][2] = 'W'

    // Group 3: Three connected stones (3 liberties) - Bottom left
    initialState.board[1][7] = 'W'
    initialState.board[2][7] = 'W'
    initialState.board[1][8] = 'W'

    // Group 4: L-shaped group (4 liberties) - Bottom right
    // 3 stones in a line + 1 at top left
    initialState.board[6][6] = 'W'  // Top left of L
    initialState.board[7][6] = 'W'  // Middle of line
    initialState.board[8][6] = 'W'  // End of line
    initialState.board[6][7] = 'W'  // Bottom of L

    // Group 5: Larger group (5 liberties) - Center
    initialState.board[4][4] = 'W'
    initialState.board[4][5] = 'W'
    initialState.board[5][4] = 'W'
    initialState.board[5][5] = 'W'

    return initialState
  })
  const [hover, setHover] = useState<{ x: number; y: number; color: "B" | "W" } | null>(null)
  const [step, setStep] = useState(0)
  const [currentTask, setCurrentTask] = useState(1)
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())

  const stones = useMemo(() => toStoneArray(state.board), [state.board])

  // Define the specific groups that need to be captured for each task
  const getTaskGroups = (task: number) => {
    switch (task) {
      case 1: return [{ x: 1, y: 1 }] // Single stone at B2
      case 2: return [{ x: 7, y: 1 }, { x: 7, y: 2 }] // Two stones at H2-H3
      case 3: return [{ x: 1, y: 7 }, { x: 2, y: 7 }, { x: 1, y: 8 }] // Three stones at B8-C8-B9
      case 4: return [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 6, y: 7 }] // L-shaped group
      case 5: return [{ x: 4, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 5 }] // Larger group
      default: return []
    }
  }

  const handlePlace = (x: number, y: number) => {
    // Force only black pieces for capture lesson
    const color = "B"
    try {
      const { nextState, captured } = placeStone(state, { x, y }, color)
      setState(nextState)
      if (captured.length > 0) {
        setStep(step + 1)

        // Check which tasks are now completed based on captured stones
        const newCompletedTasks = new Set(completedTasks)

        // Check each task to see if its target group is completely captured
        for (let taskNum = 1; taskNum <= 5; taskNum++) {
          if (!newCompletedTasks.has(taskNum)) {
            const taskGroup = getTaskGroups(taskNum)
            const isGroupCaptured = taskGroup.every(stone =>
              nextState.board[stone.x][stone.y] === null
            )

            if (isGroupCaptured) {
              newCompletedTasks.add(taskNum)
            }
          }
        }

        setCompletedTasks(newCompletedTasks)

        // Update current task to the next uncompleted task
        for (let taskNum = 1; taskNum <= 5; taskNum++) {
          if (!newCompletedTasks.has(taskNum)) {
            setCurrentTask(taskNum)
            break
          }
        }
      }
    } catch (error) {
      console.error('Capture Place Stone Error:', error)
    }
  }

  const getTaskTarget = (task: number) => {
    switch (task) {
      case 1: return 1  // Capture single stone
      case 2: return 2  // Capture two stones
      case 3: return 3  // Capture three stones
      case 4: return 3  // Capture L-shaped group
      case 5: return 4  // Capture larger group
      default: return 1
    }
  }

  const getTaskDescription = (task: number) => {
    switch (task) {
      case 1: return "Task 1: Capture the single white stone at B2"
      case 2: return "Task 2: Capture the two connected white stones at H2-H3"
      case 3: return "Task 3: Capture the three connected white stones at B8-C8-B9"
      case 4: return "Task 4: Capture the L-shaped group at G7-H7-I7-G8"
      case 5: return "Task 5: Capture the larger group at E5-F5-E6-F6"
      default: return "All tasks completed!"
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
      // Always show black pieces for capture lesson
      setHover({ x: i, y: j, color: "B" })
    }
  }

  const handleMouseLeave = () => {
    setHover(null)
  }

  const resetLesson = () => {
    const initialState = createInitialState()
    // Recreate the prepared groups with better spacing
    initialState.board[1][1] = 'W'  // Group 1: Single stone - Top left
    initialState.board[7][1] = 'W'  // Group 2: Two stones - Top right
    initialState.board[7][2] = 'W'
    initialState.board[1][7] = 'W'  // Group 3: Three stones - Bottom left
    initialState.board[2][7] = 'W'
    initialState.board[1][8] = 'W'
    initialState.board[6][6] = 'W'  // Group 4: L-shaped - Bottom right
    initialState.board[7][6] = 'W'
    initialState.board[8][6] = 'W'
    initialState.board[6][7] = 'W'
    initialState.board[4][4] = 'W'  // Group 5: Larger group - Center
    initialState.board[4][5] = 'W'
    initialState.board[5][4] = 'W'
    initialState.board[5][5] = 'W'
    setState(initialState)
    setStep(0)
    setCurrentTask(1)
    setCompletedTasks(new Set())
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-tci-dark mb-4">
          {LESSONS.capture.title}
        </h1>
        <div className="tci-progress-track w-full max-w-md mx-auto">
          <div
            className="tci-progress-fill"
            style={{ width: `${completedTasks.size / 5 * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Task {currentTask} of 5 - {completedTasks.size} completed
        </div>
      </div>

      {/* Current Task - Top Priority */}
      <div className="tci-card mb-8">
        <h3 className="text-xl font-semibold text-tci-dark mb-4">
          {getTaskDescription(currentTask)}
        </h3>
        <p className="text-gray-700 mb-4">
          {currentTask <= 5 ?
            `Place black stones to capture the white group. Each group has different liberty patterns - use what you learned about liberties to find the right moves!` :
            "Congratulations! You've completed all capture tasks."
          }
        </p>
        <div className="flex space-x-4">
          <button
            onClick={resetLesson}
            className="tci-button-secondary"
          >
            Reset
          </button>
          <div className="text-sm text-gray-600 flex items-center">
            Captures: {state.captured.B}
          </div>
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
          <div className="tci-card">
            <h3 className="text-xl font-semibold text-tci-dark mb-4">
              What
            </h3>
            <p className="text-gray-700 mb-4">{LESSONS.capture.what}</p>

            <h3 className="text-xl font-semibold text-tci-dark mb-4">
              Why this matters
            </h3>
            <p className="text-gray-700">{LESSONS.capture.why}</p>
          </div>

          {/* Task completion feedback */}
          {completedTasks.size >= 5 && (
            <div className="tci-card bg-tci-light">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="text-lg font-semibold text-tci-dark mb-2">
                  Excellent!
                </h3>
                <p className="text-gray-700 mb-4">
                  You&apos;ve mastered the art of capture! You can now:
                  <br />• Identify vulnerable groups
                  <br />• Count liberties accurately
                  <br />• Execute capture sequences
                </p>
                <a href="/eyes" className="tci-button-primary">
                  Next: Eyes & Life
                </a>
              </div>
            </div>
          )}

          {/* Task progress */}
          <div className="tci-card">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              Capture Tasks
            </h3>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((taskNum) => {
                const isCompleted = completedTasks.has(taskNum)
                const isCurrent = currentTask === taskNum && !isCompleted

                return (
                  <div
                    key={taskNum}
                    className={`flex items-center p-2 rounded ${isCompleted ? 'bg-green-100 text-green-800' :
                        isCurrent ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                      }`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {isCompleted ? '✓' : taskNum}
                    </div>
                    <div>
                      <div className="font-medium">
                        {taskNum === 1 && "Single stone capture"}
                        {taskNum === 2 && "Two-stone group capture"}
                        {taskNum === 3 && "Three-stone group capture"}
                        {taskNum === 4 && "L-shaped group capture"}
                        {taskNum === 5 && "Large group capture"}
                      </div>
                      <div className="text-xs">
                        {taskNum === 1 && "1 liberty to remove"}
                        {taskNum === 2 && "2 liberties to remove"}
                        {taskNum === 3 && "3 liberties to remove"}
                        {taskNum === 4 && "4 liberties to remove"}
                        {taskNum === 5 && "4 liberties to remove"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




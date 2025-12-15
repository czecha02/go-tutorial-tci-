'use client'

import { useState } from 'react'
import BoardSvg from '@/components/BoardSvg'
import { SHAPE_LESSONS } from '@/content/strings'
import { LESSONS } from '@/content/strings'

export default function ShapesPage() {
  const [currentShape, setCurrentShape] = useState<keyof typeof SHAPE_LESSONS>('bambooJoint')
  const [completedShapes, setCompletedShapes] = useState<Set<string>>(new Set())

  const shapeExamples = {
    bambooJoint: [
      // Bamboo Joint: 2 stones, 2 spaces, 2 stones
      // D4, D5 (first pair)
      { x: 3, y: 3, color: 'B' as const },
      { x: 3, y: 4, color: 'B' as const },
      // F4, F5 (second pair, 2 spaces away)
      { x: 5, y: 3, color: 'B' as const },
      { x: 5, y: 4, color: 'B' as const },
    ],
    tigersMouth: [
      // Tiger's Mouth: E4, D5, E6
      { x: 4, y: 3, color: 'B' as const }, // E4
      { x: 3, y: 4, color: 'B' as const }, // D5
      { x: 4, y: 5, color: 'B' as const }, // E6
    ],
    keima: [
      // Keima (Knight's Move): D4, E6
      { x: 3, y: 3, color: 'B' as const }, // D4
      { x: 4, y: 5, color: 'B' as const }, // E6
    ],
    emptyTriangle: [
      // Empty Triangle (Bad): D4, E4, D5
      { x: 3, y: 3, color: 'B' as const }, // D4
      { x: 4, y: 3, color: 'B' as const }, // E4
      { x: 3, y: 4, color: 'B' as const }, // D5
    ],
    overconcentrated: [
      // Overconcentrated (Bad): All stones on third line
      { x: 1, y: 2, color: 'B' as const }, // B3
      { x: 2, y: 2, color: 'B' as const }, // C3
      { x: 3, y: 2, color: 'B' as const }, // D3
      { x: 4, y: 2, color: 'B' as const }, // E3
      { x: 5, y: 2, color: 'B' as const }, // F3
    ],
    singleJump: [
      // Single Jump (Good): E4, E6
      { x: 4, y: 3, color: 'B' as const }, // E4
      { x: 4, y: 5, color: 'B' as const }, // E6
    ],
    ponuki: [
      // Ponuki (Good): E4, F5, E6, D5 - after capturing a stone
      { x: 4, y: 3, color: 'B' as const }, // E4
      { x: 5, y: 4, color: 'B' as const }, // F5
      { x: 4, y: 5, color: 'B' as const }, // E6
      { x: 3, y: 4, color: 'B' as const }, // D5
    ],
    goodCombi: [
      // Good Combination: D4, E6, F4
      { x: 3, y: 3, color: 'B' as const }, // D4
      { x: 4, y: 5, color: 'B' as const }, // E6
      { x: 5, y: 3, color: 'B' as const }, // F4
    ],
    overconcentratedBulk: [
      // Overconcentrated Bulk (Bad): Too many stones clustered
      { x: 3, y: 3, color: 'B' as const }, // D4
      { x: 4, y: 3, color: 'B' as const }, // E4
      { x: 5, y: 3, color: 'B' as const }, // F4
      { x: 3, y: 4, color: 'B' as const }, // D5
      { x: 4, y: 4, color: 'B' as const }, // E5
      { x: 5, y: 4, color: 'B' as const }, // F5
      { x: 4, y: 5, color: 'B' as const }, // E6
    ]
  }

  const handleShapeComplete = (shape: string) => {
    setCompletedShapes(prev => new Set([...prev, shape]))
  }

  const isGoodShape = (shape: string) => {
    return ['bambooJoint', 'tigersMouth', 'keima', 'singleJump', 'ponuki', 'goodCombi'].includes(shape)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-tci-dark mb-4">
          {LESSONS.shapes.title}
        </h1>
        <div className="tci-progress-track w-full max-w-md mx-auto">
          <div
            className="tci-progress-fill"
            style={{ width: `${(completedShapes.size / 10) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex justify-center lg:justify-start">
          <div className="inline-block">
            <BoardSvg
              size={580}
              stones={shapeExamples[currentShape]}
              showCoords
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="tci-card">
            <h3 className="text-xl font-semibold text-tci-dark mb-4">
              {SHAPE_LESSONS[currentShape].title}
            </h3>
            <p className="text-gray-700 mb-4">{SHAPE_LESSONS[currentShape].description}</p>

            <div className="bg-tci-light p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-tci-dark mb-2">Why this matters:</h4>
              <p className="text-gray-700">{SHAPE_LESSONS[currentShape].why}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Example:</h4>
              <p className="text-blue-700">{SHAPE_LESSONS[currentShape].example}</p>
            </div>
          </div>

          <div className="tci-card">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              Shape Gallery
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(SHAPE_LESSONS).map(([key, lesson]) => (
                <button
                  key={key}
                  onClick={() => setCurrentShape(key as keyof typeof SHAPE_LESSONS)}
                  className={`p-3 rounded-lg text-left transition-colors ${currentShape === key
                      ? 'bg-tci-green text-white'
                      : isGoodShape(key)
                        ? 'bg-green-50 text-green-800 hover:bg-green-100'
                        : 'bg-red-50 text-red-800 hover:bg-red-100'
                    }`}
                >
                  <div className="font-semibold text-sm">{lesson.title}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {isGoodShape(key) ? 'Good Shape' : 'Bad Shape'}
                  </div>
                  {completedShapes.has(key) && (
                    <div className="text-xs mt-1">✓ Completed</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="tci-card">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              Interactive Tasks
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleShapeComplete(currentShape)}
                className="tci-button-primary w-full"
              >
                Mark as Understood
              </button>
              <div className="text-sm text-gray-600">
                Completed: {completedShapes.size} of 10 shapes
              </div>
            </div>
          </div>

          {completedShapes.size >= 10 && (
            <div className="tci-card bg-tci-light">
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="text-lg font-semibold text-tci-dark mb-2">
                  Shape Master!
                </h3>
                <p className="text-gray-700 mb-4">
                  You&apos;ve learned the fundamentals of good and bad shape in Go.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




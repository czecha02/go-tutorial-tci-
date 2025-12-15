import { useState, useEffect, useCallback } from 'react'
import { getGroup, getLiberties, Color } from '@/lib/engine'

type LibertyPoint = { x: number; y: number }
type Board = (Color | null)[][]
type Move = { x: number; y: number }

// Helper function to calculate liberties for an entire group
function getGroupLiberties(board: Board, groupPoints: LibertyPoint[]): LibertyPoint[] {
  const allLiberties = new Set<string>()

  for (const point of groupPoints) {
    const pointLiberties = getLiberties(board, point.x, point.y)
    for (const liberty of pointLiberties) {
      allLiberties.add(`${liberty.x},${liberty.y}`)
    }
  }

  return Array.from(allLiberties).map(key => {
    const [x, y] = key.split(',').map(Number)
    return { x, y }
  })
}

export function useRulesLibertyHighlight(args: {
  board: Board
  lastMove?: Move
  boardHash: string
  enabled?: boolean
  durationMs?: number
}) {
  const {
    board,
    lastMove,
    boardHash,
    enabled = true,
    durationMs = 3500
  } = args

  const [liberties, setLiberties] = useState<LibertyPoint[]>([])
  const [isActive, setIsActive] = useState(false)

  const clearLiberties = useCallback(() => {
    setLiberties([])
    setIsActive(false)
  }, [])

  useEffect(() => {
    if (!enabled || !lastMove) {
      clearLiberties()
      return
    }

    // Small delay to ensure board state is fully updated
    const timeoutId = setTimeout(() => {
      // First, get the entire connected group
      const group = getGroup(board, lastMove.x, lastMove.y)

      // Then calculate liberties for the entire group
      const groupLiberties = getGroupLiberties(board, group)

      console.log('Rules Liberty Highlight:', {
        lastMove,
        groupSize: group.length,
        groupStones: group,
        libertiesCount: groupLiberties.length,
        liberties: groupLiberties,
        boardState: board.map(row => row.map(cell => cell || '.'))
      })

      setLiberties(groupLiberties)
      setIsActive(true)

      // Auto-clear after duration
      const clearTimeout = setTimeout(() => {
        clearLiberties()
      }, durationMs)

      return clearTimeout
    }, 50) // Small delay to ensure state is updated

    return () => {
      clearTimeout(timeoutId)
    }
  }, [board, boardHash, lastMove, enabled, durationMs, clearLiberties])

  return {
    liberties,
    isActive,
    clearLiberties
  }
}

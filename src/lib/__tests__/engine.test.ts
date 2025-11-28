import { describe, it, expect } from 'vitest'
import { createInitialState, placeStone, isLegalMove, getLiberties, getGroup } from '../engine'

describe('Go Engine', () => {
  it('should create initial state correctly', () => {
    const state = createInitialState()
    expect(state.toPlay).toBe('B')
    expect(state.captured.B).toBe(0)
    expect(state.captured.W).toBe(0)
    expect(state.board.every(row => row.every(cell => cell === null))).toBe(true)
  })

  it('should place stones correctly', () => {
    const state = createInitialState()
    const { nextState } = placeStone(state, { x: 4, y: 4 }, 'B')
    expect(nextState.board[4][4]).toBe('B')
    expect(nextState.toPlay).toBe('W')
  })

  it('should detect illegal moves', () => {
    const state = createInitialState()
    placeStone(state, { x: 4, y: 4 }, 'B')
    const newState = placeStone(state, { x: 4, y: 4 }, 'W').nextState
    expect(isLegalMove(newState, { x: 4, y: 4 }, 'B')).toBe(false)
  })

  it('should calculate liberties correctly', () => {
    const state = createInitialState()
    state.board[4][4] = 'B'
    const liberties = getLiberties(state.board, 4, 4)
    expect(liberties).toHaveLength(4)
  })

  it('should find groups correctly', () => {
    const state = createInitialState()
    state.board[4][4] = 'B'
    state.board[4][5] = 'B'
    const group = getGroup(state.board, 4, 4)
    expect(group).toHaveLength(2)
  })
})














import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/react'
import RulesPage from '../page'
import { createInitialState } from '@/lib/engine'

// Mock the hook
vi.mock('../useRulesLibertyHighlight', () => ({
  useRulesLibertyHighlight: vi.fn(() => ({
    liberties: [],
    isActive: false,
    clearLiberties: vi.fn()
  }))
}))

describe('Rules Page Liberty Highlighting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render without liberty highlighting initially', () => {
    const { container } = render(<RulesPage />)
    const libertyCircles = container.querySelectorAll('circle[fill="#ff6b6b"]')
    expect(libertyCircles.length).toBe(0)
  })

  it('should handle stone placement without errors', async () => {
    const { container } = render(<RulesPage />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    
    // Simulate clicking on the board (center intersection)
    fireEvent.click(svg!, { clientX: 300, clientY: 300 })
    
    // Should not throw errors
    expect(svg).toBeInTheDocument()
  })

  it('should show educational content about liberties', () => {
    const { getByText } = render(<RulesPage />)
    
    expect(getByText('Stones go on the intersections. A group is a set of connected stones of one color. The empty points directly up, down, left, and right are the group\'s liberties.')).toBeInTheDocument()
    expect(getByText('Groups share liberties. If all liberties of a group are filled by the opponent, the whole group is captured. Seeing the liberties immediately after each move helps you judge safety and danger.')).toBeInTheDocument()
  })

  it('should show liberty highlighting explanation', () => {
    const { getByText } = render(<RulesPage />)
    
    expect(getByText('Liberty Highlighting')).toBeInTheDocument()
    expect(getByText('Liberties of the last placed group are highlighted for 3.5s. Watch how the pattern changes when stones connect!')).toBeInTheDocument()
  })

  it('should have reset functionality', () => {
    const { getByText } = render(<RulesPage />)
    const resetButton = getByText('Reset')
    expect(resetButton).toBeInTheDocument()
    
    fireEvent.click(resetButton)
    // Should not throw errors
    expect(resetButton).toBeInTheDocument()
  })
})











import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BoardSvg from '../BoardSvg'

describe('BoardSvg', () => {
  it('should render with no stones', () => {
    const { container } = render(
      <BoardSvg stones={[]} showCoords={true} />
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should render stones correctly', () => {
    const stones = [
      { x: 4, y: 4, color: 'B' as const },
      { x: 5, y: 5, color: 'W' as const }
    ]
    const { container } = render(
      <BoardSvg stones={stones} showCoords={true} />
    )
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThan(0)
  })

  it('should show coordinate labels', () => {
    const { container } = render(
      <BoardSvg stones={[]} showCoords={true} />
    )
    const texts = container.querySelectorAll('text')
    expect(texts.length).toBeGreaterThan(0)
  })

  it('should handle hover state', () => {
    const { container } = render(
      <BoardSvg 
        stones={[]} 
        hover={{ x: 4, y: 4, color: 'B' }}
        showCoords={true} 
      />
    )
    const hoverCircle = container.querySelector('circle[opacity="0.35"]')
    expect(hoverCircle).toBeInTheDocument()
  })

  it('should show group liberty highlighting when enabled', () => {
    const liberties = [
      { x: 3, y: 4 },
      { x: 5, y: 4 },
      { x: 4, y: 3 },
      { x: 4, y: 5 }
    ]
    const { container } = render(
      <BoardSvg 
        stones={[]} 
        liberties={liberties}
        showLiberties={true}
        showCoords={true} 
      />
    )
    const libertyCircles = container.querySelectorAll('circle[fill="#ff6b6b"]')
    expect(libertyCircles.length).toBe(4)
    
    // Check that each liberty circle has the correct animation
    libertyCircles.forEach(circle => {
      const animate = circle.querySelector('animate')
      expect(animate).toBeInTheDocument()
      expect(animate?.getAttribute('dur')).toBe('3500ms')
    })
  })

  it('should not show liberty highlighting when disabled', () => {
    const liberties = [
      { x: 3, y: 4 },
      { x: 5, y: 4 }
    ]
    const { container } = render(
      <BoardSvg 
        stones={[]} 
        liberties={liberties}
        showLiberties={false}
        showCoords={true} 
      />
    )
    const libertyCircles = container.querySelectorAll('circle[fill="#ff6b6b"]')
    expect(libertyCircles.length).toBe(0)
  })
})




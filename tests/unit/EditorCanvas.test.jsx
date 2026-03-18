import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock react-konva since jsdom doesn't have a real canvas context
vi.mock('react-konva', () => {
  const React = require('react')
  return {
    Stage: ({ children, onMouseDown, onMouseMove, onMouseUp, ...props }) =>
      React.createElement('div', { 'data-testid': 'konva-stage', ...props }, children),
    Layer: ({ children }) => React.createElement('div', { 'data-testid': 'konva-layer' }, children),
    Image: (props) => React.createElement('div', { 'data-testid': 'konva-image' }),
    Circle: ({ x, y, radius, ...props }) =>
      React.createElement('div', {
        'data-testid': 'konva-circle',
        'data-x': x, 'data-y': y, 'data-radius': radius,
      }),
    Rect: ({ x, y, width, height, ...props }) =>
      React.createElement('div', {
        'data-testid': 'konva-rect',
        'data-x': x, 'data-y': y, 'data-width': width, 'data-height': height,
      }),
    Text: ({ text, ...props }) =>
      React.createElement('div', { 'data-testid': 'konva-text' }, text),
  }
})

vi.mock('use-image', () => ({
  default: () => [{}], // return a fake loaded image
}))

import { render, screen } from '@testing-library/react'
import EditorCanvas from '../../src/components/canvas/EditorCanvas'

describe('EditorCanvas', () => {
  const defaultProps = {
    hotspots: [],
    shapeMode: 'rectangle',
    currentPage: 1,
    onHotspotCreated: vi.fn(),
    onSelect: vi.fn(),
    onMove: vi.fn(),
  }

  it('renders the Konva stage', () => {
    render(<EditorCanvas {...defaultProps} />)
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument()
  })

  it('renders the image layer', () => {
    render(<EditorCanvas {...defaultProps} />)
    expect(screen.getByTestId('konva-image')).toBeInTheDocument()
  })

  it('renders no hotspot shapes when hotspots array is empty', () => {
    render(<EditorCanvas {...defaultProps} />)
    expect(screen.queryByTestId('konva-circle')).not.toBeInTheDocument()
    expect(screen.queryByTestId('konva-rect')).not.toBeInTheDocument()
  })

  it('renders circle hotspots for the current page', () => {
    const hotspots = [
      { id: 'h1', word: 'cat', coordinates: { x: 100, y: 100, radius: 30 }, shape_type: 'circle', page: 1 },
    ]
    render(<EditorCanvas {...defaultProps} hotspots={hotspots} />)
    expect(screen.getByTestId('konva-circle')).toBeInTheDocument()
  })

  it('renders rectangle hotspots for the current page', () => {
    const hotspots = [
      { id: 'h1', word: 'dog', coordinates: { x: 50, y: 50, width: 80, height: 60 }, shape_type: 'rectangle', page: 1 },
    ]
    render(<EditorCanvas {...defaultProps} hotspots={hotspots} />)
    expect(screen.getByTestId('konva-rect')).toBeInTheDocument()
  })

  it('does not render hotspots from other pages', () => {
    const hotspots = [
      { id: 'h1', word: 'cat', coordinates: { x: 100, y: 100, radius: 30 }, shape_type: 'circle', page: 2 },
    ]
    render(<EditorCanvas {...defaultProps} hotspots={hotspots} currentPage={1} />)
    expect(screen.queryByTestId('konva-circle')).not.toBeInTheDocument()
  })

  it('renders multiple hotspots on the same page', () => {
    const hotspots = [
      { id: 'h1', word: 'cat', coordinates: { x: 100, y: 100, radius: 30 }, shape_type: 'circle', page: 1 },
      { id: 'h2', word: 'dog', coordinates: { x: 200, y: 200, width: 80, height: 60 }, shape_type: 'rectangle', page: 1 },
    ]
    render(<EditorCanvas {...defaultProps} hotspots={hotspots} />)
    expect(screen.getByTestId('konva-circle')).toBeInTheDocument()
    expect(screen.getByTestId('konva-rect')).toBeInTheDocument()
  })

  it('only renders hotspots matching currentPage', () => {
    const hotspots = [
      { id: 'h1', word: 'cat', coordinates: { x: 100, y: 100, radius: 30 }, shape_type: 'circle', page: 1 },
      { id: 'h2', word: 'dog', coordinates: { x: 200, y: 200, width: 80, height: 60 }, shape_type: 'rectangle', page: 2 },
    ]
    render(<EditorCanvas {...defaultProps} hotspots={hotspots} currentPage={2} />)
    expect(screen.queryByTestId('konva-circle')).not.toBeInTheDocument()
    expect(screen.getByTestId('konva-rect')).toBeInTheDocument()
  })
})

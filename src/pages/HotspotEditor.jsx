import { useState } from 'react'
import { Stage, Layer, Image, Circle, Rect, Text } from 'react-konva'
import useImage from 'use-image'
import { Link } from 'react-router-dom'

// Hardcoded sample image (using a public image URL for demo)
const IMAGE_URL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffiverr-res.cloudinary.com%2Fimages%2Ft_main1%2Cq_auto%2Cf_auto%2Cq_auto%2Cf_auto%2Fgigs%2F282913233%2Foriginal%2F96e184b30c806db46eb3d39b102e48fcab53b33e%2Fdesign-children-story-and-children-book-illustration-and-cover.png&f=1&nofb=1&ipt=0f8705e024d4ea16bdc671b977b518b864fc21b50bb9153c23faec5358ce3123'

function Hotspot({ hotspot, onHotspotClick, onDelete, onMove }) {
  const [isHovering, setIsHovering] = useState(false)
  const { id, word, coordinates, shape_type } = hotspot

  const handleDragEnd = (e) => {
    const newX = e.target.x()
    const newY = e.target.y()

    // Update coordinates based on shape type
    let newCoordinates
    if (shape_type === 'circle') {
      newCoordinates = { x: newX, y: newY, radius: coordinates.radius }
    } else if (shape_type === 'rectangle') {
      newCoordinates = { x: newX, y: newY, width: coordinates.width, height: coordinates.height }
    }

    onMove(id, newCoordinates)
  }

  const renderShape = () => {
    if (shape_type === 'circle') {
      const displayRadius = isHovering ? coordinates.radius + 3 : coordinates.radius
      return (
        <Circle
          x={coordinates.x}
          y={coordinates.y}
          radius={displayRadius}
          fill={isHovering ? '#ff6b6b' : '#4ecdc4'}
          opacity={0.7}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => onHotspotClick(id, word)}
          onDragEnd={handleDragEnd}
          draggable
          style={{ cursor: 'pointer' }}
        />
      )
    } else if (shape_type === 'rectangle') {
      const offset = isHovering ? 3 : 0
      return (
        <Rect
          x={coordinates.x - offset}
          y={coordinates.y - offset}
          width={coordinates.width + offset * 2}
          height={coordinates.height + offset * 2}
          fill={isHovering ? '#ff6b6b' : '#4ecdc4'}
          opacity={0.7}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => onHotspotClick(id, word)}
          onDragEnd={handleDragEnd}
          draggable
          style={{ cursor: 'pointer' }}
        />
      )
    }
  }

  const getLabelPosition = () => {
    if (shape_type === 'circle') {
      return { x: coordinates.x + 20, y: coordinates.y - 10 }
    } else if (shape_type === 'rectangle') {
      return { x: coordinates.x + coordinates.width + 5, y: coordinates.y - 10 }
    }
    return { x: 0, y: 0 }
  }

  const labelPos = getLabelPosition()

  return (
    <>
      {renderShape()}
      {isHovering && (
        <Text
          x={labelPos.x}
          y={labelPos.y}
          text={word}
          fontSize={12}
          fill="black"
          backgroundColor="white"
          padding={5}
        />
      )}
    </>
  )
}

export default function HotspotEditor() {
  const [image] = useImage(IMAGE_URL)
  const [hotspots, setHotspots] = useState([])
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [shapeMode, setShapeMode] = useState('rectangle') // 'rectangle' or 'circle'
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [dragCurrent, setDragCurrent] = useState(null)

  const handleMouseDown = (e) => {
    // Only start drag on the image, not on hotspots
    if (e.target.className !== 'Circle') {
      const pos = e.target.getStage().getPointerPosition()
      setIsDragging(true)
      setDragStart(pos)
      setDragCurrent(pos)
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && dragStart) {
      const pos = e.target.getStage().getPointerPosition()
      setDragCurrent(pos)
    }
  }

  const handleMouseUp = (e) => {
    if (isDragging && dragStart && dragCurrent) {
      let coordinates

      if (shapeMode === 'circle') {
        const distance = Math.sqrt(
          Math.pow(dragCurrent.x - dragStart.x, 2) + Math.pow(dragCurrent.y - dragStart.y, 2)
        )
        const radius = Math.max(10, distance) // Minimum radius of 10
        coordinates = { x: dragStart.x, y: dragStart.y, radius }
      } else {
        // rectangle
        const width = Math.max(20, Math.abs(dragCurrent.x - dragStart.x))
        const height = Math.max(20, Math.abs(dragCurrent.y - dragStart.y))
        const x = Math.min(dragStart.x, dragCurrent.x)
        const y = Math.min(dragStart.y, dragCurrent.y)
        coordinates = { x, y, width, height }
      }

      const newHotspot = {
        id: `hotspot_${Date.now()}`, // Use string ID for compatibility
        word: `word${hotspots.length + 1}`,
        coordinates,
        shape_type: shapeMode,
      }
      setHotspots([...hotspots, newHotspot])
      setSelectedHotspot(newHotspot)
    }
    setIsDragging(false)
    setDragStart(null)
    setDragCurrent(null)
  }

  const handleHotspotClick = (id, word) => {
    const hotspot = hotspots.find(h => h.id === id)
    setSelectedHotspot(hotspot)
  }

  const handleDeleteHotspot = (id) => {
    setHotspots(hotspots.filter(h => h.id !== id))
    if (selectedHotspot?.id === id) {
      setSelectedHotspot(null)
    }
  }

  const handleUpdateWord = (newWord) => {
    if (selectedHotspot) {
      setHotspots(hotspots.map(h =>
        h.id === selectedHotspot.id ? { ...h, word: newWord } : h
      ))
      setSelectedHotspot({ ...selectedHotspot, word: newWord })
    }
  }

  const handleUpdateSize = (newSize) => {
    if (selectedHotspot) {
      const size = Math.max(10, Math.min(200, newSize))
      let newCoordinates

      if (selectedHotspot.shape_type === 'circle') {
        newCoordinates = { ...selectedHotspot.coordinates, radius: size }
      } else if (selectedHotspot.shape_type === 'rectangle') {
        // For rectangles, adjust both width and height proportionally
        const ratio = selectedHotspot.coordinates.width / selectedHotspot.coordinates.height
        newCoordinates = {
          ...selectedHotspot.coordinates,
          width: size,
          height: size / ratio
        }
      }

      setHotspots(hotspots.map(h =>
        h.id === selectedHotspot.id ? { ...h, coordinates: newCoordinates } : h
      ))
      setSelectedHotspot({ ...selectedHotspot, coordinates: newCoordinates })
    }
  }

  const handleMoveHotspot = (id, newCoordinates) => {
    setHotspots(hotspots.map(h =>
      h.id === id ? { ...h, coordinates: newCoordinates } : h
    ))
    if (selectedHotspot?.id === id) {
      setSelectedHotspot({ ...selectedHotspot, coordinates: newCoordinates })
    }
  }

  const getPreviewShape = () => {
    if (!dragStart || !dragCurrent) return null

    if (shapeMode === 'circle') {
      return {
        type: 'circle',
        radius: Math.sqrt(Math.pow(dragCurrent.x - dragStart.x, 2) + Math.pow(dragCurrent.y - dragStart.y, 2))
      }
    } else {
      const width = Math.abs(dragCurrent.x - dragStart.x)
      const height = Math.abs(dragCurrent.y - dragStart.y)
      const x = Math.min(dragStart.x, dragCurrent.x)
      const y = Math.min(dragStart.y, dragCurrent.y)
      return { type: 'rectangle', x, y, width, height }
    }
  }

  const preview = getPreviewShape()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#fff', margin: '0 0 10px 0' }}>VSD Hotspot Editor</h1>
          <p style={{ color: '#aaa', margin: '0' }}>Click and drag on the image to create hotspots</p>
        </div>
        <Link to="/" style={{ padding: '10px 15px', backgroundColor: '#4ecdc4', color: '#000', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Back to Home
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ color: '#fff' }}>Shape Mode:</label>
        <button
          onClick={() => setShapeMode('rectangle')}
          style={{
            padding: '8px 16px',
            backgroundColor: shapeMode === 'rectangle' ? '#4ecdc4' : '#3a3a3a',
            color: shapeMode === 'rectangle' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Rectangle
        </button>
        <button
          onClick={() => setShapeMode('circle')}
          style={{
            padding: '8px 16px',
            backgroundColor: shapeMode === 'circle' ? '#4ecdc4' : '#3a3a3a',
            color: shapeMode === 'circle' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Circle
        </button>
      </div>
      
      <Stage 
        width={800} 
        height={600} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '3px solid #4ecdc4', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
      >
        <Layer>
          {image && (
            <Image
              image={image}
              width={800}
              height={600}
              listening={false}
            />
          )}
          
          {hotspots.map((hotspot) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              onHotspotClick={handleHotspotClick}
              onDelete={handleDeleteHotspot}
              onMove={handleMoveHotspot}
            />
          ))}

          {isDragging && preview && preview.type === 'circle' && (
            <Circle
              x={dragStart.x}
              y={dragStart.y}
              radius={preview.radius}
              fill="#4ecdc4"
              opacity={0.3}
              stroke="#4ecdc4"
              strokeWidth={2}
            />
          )}

          {isDragging && preview && preview.type === 'rectangle' && (
            <Rect
              x={preview.x}
              y={preview.y}
              width={preview.width}
              height={preview.height}
              fill="#4ecdc4"
              opacity={0.3}
              stroke="#4ecdc4"
              strokeWidth={2}
            />
          )}
        </Layer>
      </Stage>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>Hotspots ({hotspots.length})</h3>
          <ul style={{ border: '2px solid #4ecdc4', padding: '10px', borderRadius: '6px', maxHeight: '150px', overflowY: 'auto', backgroundColor: '#2a2a2a', listStyle: 'none', margin: 0 }}>
            {hotspots.map((h) => {
              const pos = h.shape_type === 'circle'
                ? `(${Math.round(h.coordinates.x)}, ${Math.round(h.coordinates.y)})`
                : `(${Math.round(h.coordinates.x)}, ${Math.round(h.coordinates.y)})`
              return (
                <li
                  key={h.id}
                  onClick={() => handleHotspotClick(h.id, h.word)}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedHotspot?.id === h.id ? '#4ecdc4' : '#3a3a3a',
                    color: selectedHotspot?.id === h.id ? '#000' : '#fff',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    border: selectedHotspot?.id === h.id ? '2px solid #45b7b0' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {h.word} {pos} [{h.shape_type}]
                </li>
              )
            })}
          </ul>
        </div>

        {selectedHotspot && (
          <div style={{ flex: 1, padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '6px', border: '2px solid #4ecdc4' }}>
            <h3 style={{ color: '#fff', margin: '0 0 15px 0' }}>Edit Hotspot</h3>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#fff' }}>
              Vocabulary Word:
              <input
                type="text"
                value={selectedHotspot.word}
                onChange={(e) => handleUpdateWord(e.target.value)}
                style={{ padding: '10px', fontSize: '14px', backgroundColor: '#3a3a3a', color: '#fff', border: '1px solid #4ecdc4', borderRadius: '4px' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#fff', marginTop: '12px' }}>
              Size:
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={
                    selectedHotspot.shape_type === 'circle'
                      ? selectedHotspot.coordinates.radius
                      : selectedHotspot.coordinates.width
                  }
                  onChange={(e) => handleUpdateSize(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '40px', textAlign: 'right' }}>
                  {Math.round(
                    selectedHotspot.shape_type === 'circle'
                      ? selectedHotspot.coordinates.radius
                      : selectedHotspot.coordinates.width
                  )}
                </span>
              </div>
            </label>
            <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#aaa' }}>
              Shape: {selectedHotspot.shape_type}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#aaa' }}>
              Position: ({Math.round(selectedHotspot.coordinates.x)}, {Math.round(selectedHotspot.coordinates.y)})
            </p>
            <button
              onClick={() => handleDeleteHotspot(selectedHotspot.id)}
              style={{
                marginTop: '10px',
                padding: '10px 15px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
            >
              Delete Hotspot
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

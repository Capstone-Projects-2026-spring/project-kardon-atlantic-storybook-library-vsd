import { useState } from 'react'
import { Stage, Layer, Image, Circle, Text } from 'react-konva'
import useImage from 'use-image'
import { Link } from 'react-router-dom'

// Hardcoded sample image (using a public image URL for demo)
const IMAGE_URL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffiverr-res.cloudinary.com%2Fimages%2Ft_main1%2Cq_auto%2Cf_auto%2Cq_auto%2Cf_auto%2Fgigs%2F282913233%2Foriginal%2F96e184b30c806db46eb3d39b102e48fcab53b33e%2Fdesign-children-story-and-children-book-illustration-and-cover.png&f=1&nofb=1&ipt=0f8705e024d4ea16bdc671b977b518b864fc21b50bb9153c23faec5358ce3123'

function Hotspot({ x, y, label, id, radius, onHotspotClick, onDelete, onMove }) {
  const [isHovering, setIsHovering] = useState(false)
  const displayRadius = isHovering ? radius + 3 : radius

  const handleDragEnd = (e) => {
    onMove(id, e.target.x(), e.target.y())
  }

  return (
    <>
      <Circle
        x={x}
        y={y}
        radius={displayRadius}
        fill={isHovering ? '#ff6b6b' : '#4ecdc4'}
        opacity={0.7}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => onHotspotClick(id, label)}
        onDragEnd={handleDragEnd}
        draggable
        style={{ cursor: 'pointer' }}
      />
      {isHovering && (
        <Text
          x={x + 20}
          y={y - 10}
          text={label}
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
      const distance = Math.sqrt(
        Math.pow(dragCurrent.x - dragStart.x, 2) + Math.pow(dragCurrent.y - dragStart.y, 2)
      )
      const radius = Math.max(10, distance) // Minimum radius of 10

      const newHotspot = {
        id: Date.now(),
        x: dragStart.x,
        y: dragStart.y,
        radius: radius,
        label: `Hotspot ${hotspots.length + 1}`,
      }
      setHotspots([...hotspots, newHotspot])
      setSelectedHotspot(newHotspot)
    }
    setIsDragging(false)
    setDragStart(null)
    setDragCurrent(null)
  }

  const handleHotspotClick = (id, label) => {
    const hotspot = hotspots.find(h => h.id === id)
    setSelectedHotspot(hotspot)
  }

  const handleDeleteHotspot = (id) => {
    setHotspots(hotspots.filter(h => h.id !== id))
    if (selectedHotspot?.id === id) {
      setSelectedHotspot(null)
    }
  }

  const handleUpdateLabel = (newLabel) => {
    if (selectedHotspot) {
      setHotspots(hotspots.map(h => 
        h.id === selectedHotspot.id ? { ...h, label: newLabel } : h
      ))
      setSelectedHotspot({ ...selectedHotspot, label: newLabel })
    }
  }

  const handleUpdateRadius = (newRadius) => {
    if (selectedHotspot) {
      const radius = Math.max(10, Math.min(200, newRadius)) // Min 10, Max 200
      setHotspots(hotspots.map(h => 
        h.id === selectedHotspot.id ? { ...h, radius } : h
      ))
      setSelectedHotspot({ ...selectedHotspot, radius })
    }
  }

  const handleMoveHotspot = (id, newX, newY) => {
    setHotspots(hotspots.map(h => 
      h.id === id ? { ...h, x: newX, y: newY } : h
    ))
    if (selectedHotspot?.id === id) {
      setSelectedHotspot({ ...selectedHotspot, x: newX, y: newY })
    }
  }

  const previewRadius = dragStart && dragCurrent 
    ? Math.sqrt(Math.pow(dragCurrent.x - dragStart.x, 2) + Math.pow(dragCurrent.y - dragStart.y, 2))
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#fff', margin: '0 0 10px 0' }}>Image with Konva Hotspots</h1>
          <p style={{ color: '#aaa', margin: '0' }}>Click and drag on the image to create hotspots (larger drag = larger hotspot)</p>
        </div>
        <Link to="/" style={{ padding: '10px 15px', backgroundColor: '#4ecdc4', color: '#000', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Back to Home
        </Link>
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
              x={hotspot.x}
              y={hotspot.y}
              label={hotspot.label}
              id={hotspot.id}
              radius={hotspot.radius || 12}
              onHotspotClick={handleHotspotClick}
              onDelete={handleDeleteHotspot}
              onMove={handleMoveHotspot}
            />
          ))}

          {isDragging && dragStart && dragCurrent && (
            <Circle
              x={dragStart.x}
              y={dragStart.y}
              radius={previewRadius}
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
            {hotspots.map((h) => (
              <li
                key={h.id}
                onClick={() => handleHotspotClick(h.id, h.label)}
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
                {h.label} ({Math.round(h.x)}, {Math.round(h.y)})
              </li>
            ))}
          </ul>
        </div>

        {selectedHotspot && (
          <div style={{ flex: 1, padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '6px', border: '2px solid #4ecdc4' }}>
            <h3 style={{ color: '#fff', margin: '0 0 15px 0' }}>Edit Hotspot</h3>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#fff' }}>
              Label:
              <input
                type="text"
                value={selectedHotspot.label}
                onChange={(e) => handleUpdateLabel(e.target.value)}
                style={{ padding: '10px', fontSize: '14px', backgroundColor: '#3a3a3a', color: '#fff', border: '1px solid #4ecdc4', borderRadius: '4px' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#fff', marginTop: '12px' }}>
              Size (Radius):
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={selectedHotspot.radius || 12}
                  onChange={(e) => handleUpdateRadius(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '40px', textAlign: 'right' }}>{Math.round(selectedHotspot.radius || 12)}</span>
              </div>
            </label>
            <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#aaa' }}>
              Position: ({Math.round(selectedHotspot.x)}, {Math.round(selectedHotspot.y)})
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

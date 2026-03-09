import { useState } from "react";
import { Stage, Layer, Image as KonvaImage, Circle, Rect, Text } from "react-konva";
import useImage from "use-image";

// Hardcoded sample image for MVP demo
const SAMPLE_IMAGE_URL =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffiverr-res.cloudinary.com%2Fimages%2Ft_main1%2Cq_auto%2Cf_auto%2Cq_auto%2Cf_auto%2Fgigs%2F282913233%2Foriginal%2F96e184b30c806db46eb3d39b102e48fcab53b33e%2Fdesign-children-story-and-children-book-illustration-and-cover.png&f=1&nofb=1&ipt=0f8705e024d4ea16bdc671b977b518b864fc21b50bb9153c23faec5358ce3123";

const CANVAS_W = 560;
const CANVAS_H = 400;

/* ---- individual hotspot rendered on the Konva canvas ---- */

function CanvasHotspot({ hotspot, onSelect, onMove }) {
  const [isHovering, setIsHovering] = useState(false);
  const { id, word, coordinates, shape_type } = hotspot;

  const handleDragEnd = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();
    let newCoordinates;
    if (shape_type === "circle") {
      newCoordinates = { x: newX, y: newY, radius: coordinates.radius };
    } else {
      newCoordinates = { x: newX, y: newY, width: coordinates.width, height: coordinates.height };
    }
    onMove(id, newCoordinates);
  };

  const sharedProps = {
    draggable: true,
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
    onClick: () => onSelect(id),
    onDragEnd: handleDragEnd,
    fill: isHovering ? "#ff6b6b" : "#6d6af0",
    opacity: 0.6,
    stroke: "#fff",
    strokeWidth: isHovering ? 2 : 1,
  };

  if (shape_type === "circle") {
    const r = isHovering ? coordinates.radius + 3 : coordinates.radius;
    return (
      <>
        <Circle x={coordinates.x} y={coordinates.y} radius={r} {...sharedProps} />
        {isHovering && (
          <Text x={coordinates.x + 20} y={coordinates.y - 10} text={word} fontSize={12} fill="#fff" />
        )}
      </>
    );
  }

  const off = isHovering ? 3 : 0;
  return (
    <>
      <Rect
        x={coordinates.x - off} y={coordinates.y - off}
        width={coordinates.width + off * 2} height={coordinates.height + off * 2}
        {...sharedProps}
      />
      {isHovering && (
        <Text x={coordinates.x + coordinates.width + 5} y={coordinates.y - 10} text={word} fontSize={12} fill="#fff" />
      )}
    </>
  );
}

/* ---- main canvas component ---- */

export default function EditorCanvas({ hotspots, shapeMode, currentPage, onHotspotCreated, onSelect, onMove }) {
  const [image] = useImage(SAMPLE_IMAGE_URL);

  // drag-to-draw state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);

  const pageHotspots = hotspots.filter((h) => h.page === currentPage);

  const handleMouseDown = (e) => {
    if (e.target !== e.target.getStage() && e.target.className !== "Image") return;
    const pos = e.target.getStage().getPointerPosition();
    setIsDragging(true);
    setDragStart(pos);
    setDragCurrent(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;
    setDragCurrent(e.target.getStage().getPointerPosition());
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragCurrent) {
      let coordinates;
      if (shapeMode === "circle") {
        const radius = Math.max(10,
          Math.sqrt((dragCurrent.x - dragStart.x) ** 2 + (dragCurrent.y - dragStart.y) ** 2));
        coordinates = { x: dragStart.x, y: dragStart.y, radius };
      } else {
        coordinates = {
          x: Math.min(dragStart.x, dragCurrent.x),
          y: Math.min(dragStart.y, dragCurrent.y),
          width: Math.max(20, Math.abs(dragCurrent.x - dragStart.x)),
          height: Math.max(20, Math.abs(dragCurrent.y - dragStart.y)),
        };
      }
      onHotspotCreated({ coordinates, shape_type: shapeMode, page: currentPage });
    }
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  // drag preview shape
  const preview = isDragging && dragStart && dragCurrent
    ? shapeMode === "circle"
      ? { type: "circle", x: dragStart.x, y: dragStart.y,
          radius: Math.sqrt((dragCurrent.x - dragStart.x) ** 2 + (dragCurrent.y - dragStart.y) ** 2) }
      : { type: "rect",
          x: Math.min(dragStart.x, dragCurrent.x), y: Math.min(dragStart.y, dragCurrent.y),
          width: Math.abs(dragCurrent.x - dragStart.x), height: Math.abs(dragCurrent.y - dragStart.y) }
    : null;

  return (
    <Stage
      width={CANVAS_W} height={CANVAS_H}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging ? "crosshair" : "default" }}
    >
      <Layer>
        {image && <KonvaImage image={image} width={CANVAS_W} height={CANVAS_H} listening={false} />}

        {pageHotspots.map((h) => (
          <CanvasHotspot key={h.id} hotspot={h} onSelect={onSelect} onMove={onMove} />
        ))}

        {preview && preview.type === "circle" && (
          <Circle x={preview.x} y={preview.y} radius={preview.radius}
            fill="#6d6af0" opacity={0.3} stroke="#6d6af0" strokeWidth={2} />
        )}
        {preview && preview.type === "rect" && (
          <Rect x={preview.x} y={preview.y} width={preview.width} height={preview.height}
            fill="#6d6af0" opacity={0.3} stroke="#6d6af0" strokeWidth={2} />
        )}
      </Layer>
    </Stage>
  );
}

import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Circle, Rect, Text } from "react-konva";
import useImage from "use-image";

const DEFAULT_CANVAS_SIZE = { w: 560, h: 400 };

function getCanvasMetrics(containerSize, image) {
  let canvasW = Math.max(1, Math.round(containerSize.w || DEFAULT_CANVAS_SIZE.w));
  let canvasH = Math.max(1, Math.round(containerSize.h || DEFAULT_CANVAS_SIZE.h));
  let scale = 1;

  const imgW = Number(image?.naturalWidth || image?.width || 0);
  const imgH = Number(image?.naturalHeight || image?.height || 0);

  if (imgW > 0 && imgH > 0) {
    const fitScale = Math.min(canvasW / imgW, canvasH / imgH);
    if (Number.isFinite(fitScale) && fitScale > 0) {
      canvasW = Math.max(1, Math.round(imgW * fitScale));
      canvasH = Math.max(1, Math.round(imgH * fitScale));
      scale = fitScale;
    }
  }

  return { canvasW, canvasH, scale };
}

function clampPoint(point, width, height) {
  return {
    x: Math.max(0, Math.min(point.x, width)),
    y: Math.max(0, Math.min(point.y, height)),
  };
}

/* ---- individual hotspot rendered on the Konva canvas ---- */

function CanvasHotspot({ hotspot, onSelect, onMove, scale, canvasW, canvasH }) {
  const [isHovering, setIsHovering] = useState(false);
  const { id, word, coordinates, shape_type } = hotspot;

  const sx = scale;
  const sy = scale;

  const handleDragEnd = (e) => {
    // Convert display coords back to image coords
    const newX = e.target.x() / sx;
    const newY = e.target.y() / sy;
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
    fill: "#6d6af0",
    opacity: isHovering ? 0.75 : 0.55,
    stroke: "#4a47c0",
    strokeWidth: isHovering ? 3 : 2,
  };

  // figure out where to stick the label so it stays on screen
  const labelW = word.length * 8 + 12;
  const labelH = 20;
  const MARGIN = 4;

  // edges of the shape in display coords
  const rightEdge = shape_type === "circle"
    ? (coordinates.x + coordinates.radius) * sx
    : (coordinates.x + coordinates.width) * sx;
  const leftEdge = shape_type === "circle"
    ? (coordinates.x - coordinates.radius) * sx
    : coordinates.x * sx;
  const topEdge = shape_type === "circle"
    ? (coordinates.y - coordinates.radius) * sy
    : coordinates.y * sy;
  const bottomEdge = shape_type === "circle"
    ? (coordinates.y + coordinates.radius) * sy
    : (coordinates.y + coordinates.height) * sy;

  // default spot: right side of shape, a bit above the top
  let labelX = rightEdge + 3;
  let labelY = topEdge - labelH + 4;

  // if it goes off the right, swing over to the left
  if (labelX + labelW > canvasW - MARGIN) labelX = leftEdge - labelW - 3;
  // still out of bounds? just clamp it in
  if (labelX < MARGIN) labelX = MARGIN;
  if (labelX + labelW > canvasW - MARGIN) labelX = canvasW - labelW - MARGIN;

  // if its off the top, put it below the shape instead
  if (labelY < MARGIN) labelY = bottomEdge + MARGIN;
  if (labelY + labelH > canvasH - MARGIN) labelY = canvasH - labelH - MARGIN;

  if (shape_type === "circle") {
    const r = (isHovering ? coordinates.radius + 3 : coordinates.radius) * sx;
    return (
      <>
        <Circle x={coordinates.x * sx} y={coordinates.y * sy} radius={r} {...sharedProps} />
        {isHovering && (
          <>
            <Rect
              x={labelX} y={labelY}
              width={labelW} height={labelH}
              fill="#222" cornerRadius={4} opacity={0.85}
            />
            <Text x={labelX + 6} y={labelY + 4} text={word} fontSize={12} fill="#fff"
              fontStyle="bold" />
          </>
        )}
      </>
    );
  }

  const off = isHovering ? 3 : 0;
  return (
    <>
      <Rect
        x={coordinates.x * sx - off} y={coordinates.y * sy - off}
        width={coordinates.width * sx + off * 2} height={coordinates.height * sy + off * 2}
        {...sharedProps}
      />
      {isHovering && (
        <>
          <Rect
            x={labelX} y={labelY}
            width={labelW} height={labelH}
            fill="#222" cornerRadius={4} opacity={0.85}
          />
          <Text x={labelX + 6} y={labelY + 4} text={word} fontSize={12} fill="#fff"
            fontStyle="bold" />
        </>
      )}
    </>
  );
}

/* ---- main canvas component ---- */

export default function EditorCanvas({ hotspots, shapeMode, currentPage, onHotspotCreated, onSelect, onMove, imageUrl }) {
  const [image, imageStatus] = useImage(imageUrl, "anonymous");
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState(DEFAULT_CANVAS_SIZE);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = (width, height) => {
      setContainerSize({
        w: Math.max(1, Math.round(width || DEFAULT_CANVAS_SIZE.w)),
        h: Math.max(1, Math.round(height || DEFAULT_CANVAS_SIZE.h)),
      });
    };

    const readSize = () => {
      const rect = el.getBoundingClientRect?.();
      updateSize(rect?.width || el.clientWidth, rect?.height || el.clientHeight);
    };

    readSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", readSize);
      return () => window.removeEventListener("resize", readSize);
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      updateSize(width, height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { canvasW, canvasH, scale } = getCanvasMetrics(containerSize, image);

  // drag-to-draw state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);

  const pageHotspots = hotspots.filter((h) => h.page === currentPage);

  const handleMouseDown = (e) => {
    if (!image) return;
    if (e.target !== e.target.getStage() && e.target.className !== "Image") return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    const clamped = clampPoint(pos, canvasW, canvasH);
    setIsDragging(true);
    setDragStart(clamped);
    setDragCurrent(clamped);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    setDragCurrent(clampPoint(pos, canvasW, canvasH));
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragCurrent) {
      // Convert display coords to image coords for storage
      let coordinates;
      if (shapeMode === "circle") {
        const radius = Math.max(10,
          Math.sqrt((dragCurrent.x - dragStart.x) ** 2 + (dragCurrent.y - dragStart.y) ** 2)) / scale;
        coordinates = { x: dragStart.x / scale, y: dragStart.y / scale, radius };
      } else {
        coordinates = {
          x: Math.min(dragStart.x, dragCurrent.x) / scale,
          y: Math.min(dragStart.y, dragCurrent.y) / scale,
          width: Math.max(20, Math.abs(dragCurrent.x - dragStart.x)) / scale,
          height: Math.max(20, Math.abs(dragCurrent.y - dragStart.y)) / scale,
        };
      }
      onHotspotCreated({ coordinates, shape_type: shapeMode, page: currentPage });
    }
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  // drag preview shape (in display coords)
  const preview = isDragging && dragStart && dragCurrent
    ? shapeMode === "circle"
      ? { type: "circle", x: dragStart.x, y: dragStart.y,
          radius: Math.sqrt((dragCurrent.x - dragStart.x) ** 2 + (dragCurrent.y - dragStart.y) ** 2) }
      : { type: "rect",
          x: Math.min(dragStart.x, dragCurrent.x), y: Math.min(dragStart.y, dragCurrent.y),
          width: Math.abs(dragCurrent.x - dragStart.x), height: Math.abs(dragCurrent.y - dragStart.y) }
    : null;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stage
        width={canvasW} height={canvasH}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isDragging ? "crosshair" : "default" }}
      >
        <Layer>
          {image && <KonvaImage image={image} width={canvasW} height={canvasH} listening={false} />}
          {image && <Rect x={0} y={0} width={canvasW} height={canvasH} fill="#000" opacity={0.18} listening={false} />}
          {!image && (
            <Text
              x={canvasW / 2 - 80} y={canvasH / 2 - 10}
              text={imageStatus === "loading" ? "Loading image..." : imageUrl ? "Image failed to load" : "No image selected"}
              fontSize={14} fill="#aaa"
            />
          )}

          {pageHotspots.map((h) => (
            <CanvasHotspot key={h.id} hotspot={h} onSelect={onSelect} onMove={onMove} scale={scale}
              canvasW={canvasW} canvasH={canvasH} />
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
    </div>
  );
}

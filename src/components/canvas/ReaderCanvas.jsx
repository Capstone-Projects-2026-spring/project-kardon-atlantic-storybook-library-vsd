import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Circle, Rect, Text } from "react-konva";
import useImage from "use-image";
import { speakWord } from "../../services/hotspots";

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

/* ---- read-only hotspot rendered on the Konva canvas ---- */

function ReadOnlyHotspot({ hotspot, scale, canvasW, canvasH }) {
  const [isHovering, setIsHovering] = useState(false);
  const { word, coordinates, shape_type } = hotspot;

  // Scale coordinates to match displayed image size
  const sx = scale;
  const sy = scale;

  // keep the label on screen no matter where the hotspot is
  const labelW = word.length * 9 + 12;
  const labelH = 22;
  const MARGIN = 4;

  const rightEdge = shape_type === "circle"
    ? coordinates.x * sx + coordinates.radius * sx
    : (coordinates.x + coordinates.width) * sx;
  const leftEdge = shape_type === "circle"
    ? coordinates.x * sx - coordinates.radius * sx
    : coordinates.x * sx;
  const topEdge = shape_type === "circle"
    ? coordinates.y * sy - coordinates.radius * sy
    : coordinates.y * sy;
  const bottomEdge = shape_type === "circle"
    ? coordinates.y * sy + coordinates.radius * sy
    : (coordinates.y + coordinates.height) * sy;

  let labelX = rightEdge + 3;
  let labelY = topEdge - labelH + 4;

  if (labelX + labelW > canvasW - MARGIN) labelX = leftEdge - labelW - 3;
  if (labelX < MARGIN) labelX = MARGIN;
  if (labelX + labelW > canvasW - MARGIN) labelX = canvasW - labelW - MARGIN;

  if (labelY < MARGIN) labelY = bottomEdge + MARGIN;
  if (labelY + labelH > canvasH - MARGIN) labelY = canvasH - labelH - MARGIN;

  const sharedProps = {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
    onClick: () => speakWord(word), //TTS
    fill: isHovering ? "#ff69b4" : "#ff69b4",
    opacity: isHovering ? 0.7 : 0.4,
    stroke: "#ff1493",
    strokeWidth: isHovering ? 5 : 3,
  };

  // figure out where to stick the label so it doesnt fall off the canvas
  const labelW = word.length * 9 + 12;
  const labelH = 22;
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

  // start at the right side, slightly above the top
  let labelX = rightEdge + 3;
  let labelY = topEdge - labelH + 4;

  // if its gonna spill off the right, flip it to the left
  if (labelX + labelW > canvasW - MARGIN) labelX = leftEdge - labelW - 3;
  // if its still off screen somehow, just clamp it
  if (labelX < MARGIN) labelX = MARGIN;
  if (labelX + labelW > canvasW - MARGIN) labelX = canvasW - labelW - MARGIN;

  // if the label is off the top, drop it below the shape
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
            <Text x={labelX + 6} y={labelY + 4} text={word} fontSize={14} fill="#fff"
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
          <Text x={labelX + 6} y={labelY + 4} text={word} fontSize={14} fill="#fff"
            fontStyle="bold" />
        </>
      )}
    </>
  );
}

/* ---- main read-only canvas ---- */

export default function ReaderCanvas({ hotspots, imageUrl }) {
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

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stage width={canvasW} height={canvasH} style={{ cursor: "default" }}>
        <Layer>
          {image && <KonvaImage image={image} width={canvasW} height={canvasH} listening={false} />}
          {!image && (
            <Text
              x={canvasW / 2 - 80} y={canvasH / 2 - 10}
              text={imageStatus === "loading" ? "Loading image..." : imageUrl ? "Image failed to load" : "No image selected"}
              fontSize={14} fill="#aaa"
            />
          )}

          {hotspots.map((h) => (
            <ReadOnlyHotspot key={h.id} hotspot={h} scale={scale} canvasW={canvasW} canvasH={canvasH} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

import { useState } from "react";
import { Stage, Layer, Image as KonvaImage, Circle, Rect, Text } from "react-konva";
import useImage from "use-image";

const CANVAS_W = 560;
const CANVAS_H = 400;

/* ---- read-only hotspot rendered on the Konva canvas ---- */

function ReadOnlyHotspot({ hotspot }) {
  const [isHovering, setIsHovering] = useState(false);
  const { word, coordinates, shape_type } = hotspot;

  const sharedProps = {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
    fill: isHovering ? "#ff69b4" : "#ff69b4",
    opacity: isHovering ? 0.7 : 0.4,
    stroke: "#ff1493",
    strokeWidth: isHovering ? 5 : 3,
  };

  if (shape_type === "circle") {
    const r = isHovering ? coordinates.radius + 3 : coordinates.radius;
    return (
      <>
        <Circle x={coordinates.x} y={coordinates.y} radius={r} {...sharedProps} />
        {isHovering && (
          <>
            <Rect
              x={coordinates.x + 18} y={coordinates.y - 16}
              width={word.length * 9 + 12} height={22}
              fill="#222" cornerRadius={4} opacity={0.85}
            />
            <Text x={coordinates.x + 24} y={coordinates.y - 12} text={word} fontSize={14} fill="#fff"
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
        x={coordinates.x - off} y={coordinates.y - off}
        width={coordinates.width + off * 2} height={coordinates.height + off * 2}
        {...sharedProps}
      />
      {isHovering && (
        <>
          <Rect
            x={coordinates.x + coordinates.width + 3} y={coordinates.y - 16}
            width={word.length * 9 + 12} height={22}
            fill="#222" cornerRadius={4} opacity={0.85}
          />
          <Text x={coordinates.x + coordinates.width + 9} y={coordinates.y - 12} text={word} fontSize={14} fill="#fff"
            fontStyle="bold" />
        </>
      )}
    </>
  );
}

/* ---- main read-only canvas ---- */

export default function ReaderCanvas({ hotspots, imageUrl }) {
  const [image, imageStatus] = useImage(imageUrl, "anonymous");

  return (
    <Stage width={CANVAS_W} height={CANVAS_H} style={{ cursor: "default" }}>
      <Layer>
        {image && <KonvaImage image={image} width={CANVAS_W} height={CANVAS_H} listening={false} />}
        {!image && (
          <Text
            x={CANVAS_W / 2 - 80} y={CANVAS_H / 2 - 10}
            text={imageStatus === "loading" ? "Loading image..." : imageUrl ? "Image failed to load" : "No image selected"}
            fontSize={14} fill="#aaa"
          />
        )}

        {hotspots.map((h) => (
          <ReadOnlyHotspot key={h.id} hotspot={h} />
        ))}
      </Layer>
    </Stage>
  );
}

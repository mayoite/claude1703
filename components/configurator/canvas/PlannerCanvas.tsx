"use client";

import { Layer, Line, Rect, Stage, Text } from "react-konva";
import { CATEGORY_META } from "@/lib/planner/catalog";
import type {
  Opening,
  PlannerItem,
  PlannerProduct,
  RoomState,
  VariantDefinition,
} from "@/lib/planner/types";
import { clamp } from "@/lib/planner/utils";

type CanvasMetrics = {
  width: number;
  height: number;
  scale: number;
  roomX: number;
  roomY: number;
  roomPxWidth: number;
  roomPxDepth: number;
};

type EnrichedPlannerItem = PlannerItem & {
  product: PlannerProduct;
  variant: VariantDefinition;
  dimensions: {
    widthMm: number;
    depthMm: number;
    heightMm: number;
    seatCount: number;
    unitCount: number;
  };
};

type PlannerCanvasProps = {
  canvasMetrics: CanvasMetrics;
  room: RoomState;
  openings: Opening[];
  placedItems: EnrichedPlannerItem[];
  collisions: Set<string>;
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
  onMoveItem: (itemId: string, xMm: number, yMm: number) => void;
};

export function PlannerCanvas({
  canvasMetrics,
  room,
  openings,
  placedItems,
  collisions,
  selectedItemId,
  onSelectItem,
  onMoveItem,
}: PlannerCanvasProps) {
  return (
    <Stage width={canvasMetrics.width} height={canvasMetrics.height}>
      <Layer>
        {Array.from({ length: Math.floor(room.widthMm / 600) + 1 }).map((_, index) => (
          <Line
            key={`grid-x-${index}`}
            points={[
              canvasMetrics.roomX + index * 600 * canvasMetrics.scale,
              canvasMetrics.roomY,
              canvasMetrics.roomX + index * 600 * canvasMetrics.scale,
              canvasMetrics.roomY + canvasMetrics.roomPxDepth,
            ]}
            stroke="rgba(20, 50, 90, 0.08)"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: Math.floor(room.depthMm / 600) + 1 }).map((_, index) => (
          <Line
            key={`grid-y-${index}`}
            points={[
              canvasMetrics.roomX,
              canvasMetrics.roomY + index * 600 * canvasMetrics.scale,
              canvasMetrics.roomX + canvasMetrics.roomPxWidth,
              canvasMetrics.roomY + index * 600 * canvasMetrics.scale,
            ]}
            stroke="rgba(20, 50, 90, 0.08)"
            strokeWidth={1}
          />
        ))}

        <Rect
          x={canvasMetrics.roomX}
          y={canvasMetrics.roomY}
          width={canvasMetrics.roomPxWidth}
          height={canvasMetrics.roomPxDepth}
          fill="rgba(255,255,255,0.9)"
          stroke="rgba(17, 24, 39, 0.18)"
          strokeWidth={2}
          cornerRadius={18}
        />
        <Rect
          x={canvasMetrics.roomX + room.clearanceMm * canvasMetrics.scale}
          y={canvasMetrics.roomY + room.clearanceMm * canvasMetrics.scale}
          width={canvasMetrics.roomPxWidth - room.clearanceMm * 2 * canvasMetrics.scale}
          height={canvasMetrics.roomPxDepth - room.clearanceMm * 2 * canvasMetrics.scale}
          stroke="rgba(59, 130, 246, 0.5)"
          dash={[10, 8]}
          strokeWidth={2}
          cornerRadius={14}
        />
        <Text
          x={canvasMetrics.roomX + 18}
          y={canvasMetrics.roomY + 18}
          text={`${room.name} · planning boundary`}
          fontSize={14}
          fill="#334155"
        />

        {openings.map((opening) => {
          const stroke = opening.type === "door" ? "#0f766e" : "#2563eb";
          const openingX =
            opening.edge === "top" || opening.edge === "bottom"
              ? canvasMetrics.roomX + opening.offsetMm * canvasMetrics.scale
              : opening.edge === "left"
                ? canvasMetrics.roomX
                : canvasMetrics.roomX + canvasMetrics.roomPxWidth;
          const openingY =
            opening.edge === "left" || opening.edge === "right"
              ? canvasMetrics.roomY + opening.offsetMm * canvasMetrics.scale
              : opening.edge === "top"
                ? canvasMetrics.roomY
                : canvasMetrics.roomY + canvasMetrics.roomPxDepth;
          const points =
            opening.edge === "top" || opening.edge === "bottom"
              ? [openingX, openingY, openingX + opening.widthMm * canvasMetrics.scale, openingY]
              : [openingX, openingY, openingX, openingY + opening.widthMm * canvasMetrics.scale];
          return (
            <Line key={opening.id} points={points} stroke={stroke} strokeWidth={8} lineCap="round" />
          );
        })}

        {placedItems.map((item) => {
          const width = item.dimensions.widthMm * canvasMetrics.scale;
          const depth = item.dimensions.depthMm * canvasMetrics.scale;
          const x = canvasMetrics.roomX + item.xMm * canvasMetrics.scale;
          const y = canvasMetrics.roomY + item.yMm * canvasMetrics.scale;
          const meta = CATEGORY_META[item.product.category];

          return (
            <Rect
              key={item.id}
              x={x}
              y={y}
              width={width}
              height={depth}
              fill={meta.fill}
              stroke={collisions.has(item.id) ? "#ef4444" : meta.stroke}
              strokeWidth={item.id === selectedItemId ? 3 : 2}
              cornerRadius={12}
              opacity={item.id === selectedItemId ? 0.96 : 0.88}
              shadowBlur={item.id === selectedItemId ? 18 : 0}
              shadowColor="rgba(15,23,42,0.18)"
              draggable
              dragBoundFunc={(position) => ({
                x: clamp(
                  position.x,
                  canvasMetrics.roomX + room.clearanceMm * canvasMetrics.scale,
                  canvasMetrics.roomX +
                    canvasMetrics.roomPxWidth -
                    width -
                    room.clearanceMm * canvasMetrics.scale,
                ),
                y: clamp(
                  position.y,
                  canvasMetrics.roomY + room.clearanceMm * canvasMetrics.scale,
                  canvasMetrics.roomY +
                    canvasMetrics.roomPxDepth -
                    depth -
                    room.clearanceMm * canvasMetrics.scale,
                ),
              })}
              onClick={() => onSelectItem(item.id)}
              onTap={() => onSelectItem(item.id)}
              onDragStart={() => onSelectItem(item.id)}
              onDragEnd={(event) => {
                const xMm = Math.round((event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale);
                const yMm = Math.round((event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale);
                onMoveItem(item.id, xMm, yMm);
              }}
            />
          );
        })}

        {placedItems.map((item) => {
          if (item.product.category !== "workstations") return null;

          const width = item.dimensions.widthMm * canvasMetrics.scale;
          const depth = item.dimensions.depthMm * canvasMetrics.scale;
          const x = canvasMetrics.roomX + item.xMm * canvasMetrics.scale;
          const y = canvasMetrics.roomY + item.yMm * canvasMetrics.scale;
          const pedestalWidth = Math.max(14, Math.min(28, width * 0.12));
          const pedestalHeight = Math.max(12, Math.min(22, depth * 0.18));
          const pedestalCount = (item.variant.seatCount ?? 0) >= 4 ? 2 : 1;

          return Array.from({ length: pedestalCount }).map((_, index) => {
            const progress = pedestalCount === 1 ? 0.5 : index / (pedestalCount - 1);
            const pedestalX = x + 18 + progress * Math.max(0, width - pedestalWidth - 36);

            return (
              <Rect
                key={`${item.id}-pedestal-${index}`}
                x={pedestalX}
                y={y + depth - pedestalHeight - 12}
                width={pedestalWidth}
                height={pedestalHeight}
                fill="rgba(15,23,42,0.55)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
                cornerRadius={4}
              />
            );
          });
        })}

        {placedItems.map((item) => (
          <Text
            key={`${item.id}-label`}
            x={canvasMetrics.roomX + item.xMm * canvasMetrics.scale + 10}
            y={canvasMetrics.roomY + item.yMm * canvasMetrics.scale + 10}
            width={Math.max(80, item.dimensions.widthMm * canvasMetrics.scale - 20)}
            text={
              item.variant.seatCount
                ? `${item.product.family} · ${item.variant.seatCount} seats`
                : `${item.product.family} · ${item.variant.unitCount ?? 1} units`
            }
            fontSize={12}
            fill="#f8fafc"
          />
        ))}
      </Layer>
    </Stage>
  );
}

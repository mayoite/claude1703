export type InteriorWall = {
  id: string;
  x1Mm: number;
  y1Mm: number;
  x2Mm: number;
  y2Mm: number;
};

export type PlannerColumn = {
  id: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  depthMm: number;
};

export type PlannerNote = {
  id: string;
  xMm: number;
  yMm: number;
  text: string;
};

export type CanvasContextMenu = {
  x: number;
  y: number;
  visible: boolean;
};


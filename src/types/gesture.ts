export type SwipeDirection = "LEFT" | "RIGHT" | "UP" | "DOWN";

export type GestureName = SwipeDirection | "TAP/DRAG" | "CANCEL" | null;

export interface GestureDebugState {
  dx: number;
  dy: number;
  v: number;
  dt: number;
}

export interface Point2D {
  x: number;
  y: number;
}

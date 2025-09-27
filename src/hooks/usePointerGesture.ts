import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GestureDebugState, GestureName, Point2D, SwipeDirection } from "@/types/gesture";

export interface PointerGestureOptions {
  distanceThreshold: number;
  velocityThreshold: number;
  snapBackOnRelease: boolean;
  step?: number;
}

const INITIAL_DEBUG_STATE: GestureDebugState = { dx: 0, dy: 0, v: 0, dt: 0 };
const INITIAL_STATUS = "等待觸控中…";
const DEFAULT_STEP = 120;

export function usePointerGesture({
  distanceThreshold,
  velocityThreshold,
  snapBackOnRelease,
  step = DEFAULT_STEP
}: PointerGestureOptions) {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef({ x: 0, y: 0, t: 0 });
  const lastRef = useRef({ x: 0, y: 0, t: 0 });
  const activeRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const [status, setStatus] = useState(INITIAL_STATUS);
  const [debug, setDebug] = useState<GestureDebugState>(INITIAL_DEBUG_STATE);
  const [lastGesture, setLastGesture] = useState<GestureName>(null);
  const [basePos, setBasePos] = useState<Point2D>({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState<Point2D>({ x: 0, y: 0 });

  useEffect(() => {
    const area = areaRef.current;
    if (!area) {
      return undefined;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (activeRef.current || !event.isPrimary) {
        return;
      }

      activeRef.current = true;
      pointerIdRef.current = event.pointerId;
      if (event.target instanceof Element) {
        event.target.setPointerCapture?.(event.pointerId);
      }

      const timestamp = performance.now();
      startRef.current = { x: event.clientX, y: event.clientY, t: timestamp };
      lastRef.current = { x: event.clientX, y: event.clientY, t: timestamp };

      setStatus("拖曳 / 準備滑動中…");
      setLastGesture(null);
      setDragPos({ x: 0, y: 0 });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!activeRef.current || event.pointerId !== pointerIdRef.current) {
        return;
      }

      const now = performance.now();
      const { x: startX, y: startY } = startRef.current;
      const { x: lastX, y: lastY, t: lastTime } = lastRef.current;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      const dt = Math.max(1, now - lastTime);
      const velocity = Math.hypot(deltaX, deltaY) / dt;

      lastRef.current = { x: event.clientX, y: event.clientY, t: now };
      setDebug({ dx: Math.round(dx), dy: Math.round(dy), v: Number(velocity.toFixed(3)), dt: Math.round(dt) });
      setDragPos({ x: dx, y: dy });
    };

    const finishInteraction = (event: PointerEvent | null, canceled = false) => {
      if (!activeRef.current) {
        return;
      }
      activeRef.current = false;

      const endTime = performance.now();
      const { x: startX, y: startY, t: startTime } = startRef.current;
      const { x: lastX, y: lastY, t: lastTime } = lastRef.current;

      const totalDx = (event?.clientX ?? lastX) - startX;
      const totalDy = (event?.clientY ?? lastY) - startY;
      const totalDt = Math.max(1, (event ? endTime : lastTime) - startTime);
      const speed = Math.hypot(totalDx, totalDy) / totalDt;

      setDragPos({ x: 0, y: 0 });

      if (canceled) {
        setStatus("已取消（pointercancel）");
        setLastGesture("CANCEL");
        return;
      }

      const isSwipe =
        Math.abs(totalDx) >= distanceThreshold ||
        Math.abs(totalDy) >= distanceThreshold ||
        speed >= velocityThreshold;

      if (!isSwipe) {
        setStatus("未達滑動門檻，視為 TAP/DRAG 結束");
        if (!snapBackOnRelease) {
          setBasePos((position: Point2D) => ({ x: position.x + totalDx, y: position.y + totalDy }));
        }
        setLastGesture("TAP/DRAG");
        return;
      }

      const direction: SwipeDirection =
        Math.abs(totalDx) >= Math.abs(totalDy)
          ? totalDx < 0
            ? "LEFT"
            : "RIGHT"
          : totalDy < 0
            ? "UP"
            : "DOWN";

      setStatus(
        `偵測到滑動：${direction}（距離 ${Math.round(totalDx)}, ${Math.round(totalDy)}；速度 ${speed.toFixed(
          3
        )} px/ms）`
      );
      setLastGesture(direction);

      if (!snapBackOnRelease) {
        setBasePos((position: Point2D) => ({ x: position.x + totalDx, y: position.y + totalDy }));
      } else {
        setBasePos({ x: 0, y: 0 });
      }
    };

    const onPointerUp = (event: PointerEvent) => finishInteraction(event, false);
    const onPointerCancel = (event: PointerEvent) => finishInteraction(event, true);

    area.addEventListener("pointerdown", onPointerDown);
    area.addEventListener("pointermove", onPointerMove);
    area.addEventListener("pointerup", onPointerUp);
    area.addEventListener("pointercancel", onPointerCancel);

    return () => {
      area.removeEventListener("pointerdown", onPointerDown);
      area.removeEventListener("pointermove", onPointerMove);
      area.removeEventListener("pointerup", onPointerUp);
      area.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [distanceThreshold, velocityThreshold, snapBackOnRelease]);

  const nudge = useCallback(
    (direction: SwipeDirection) => {
      setLastGesture(direction);
      setStatus(`按下方向鍵：${direction}`);
      setBasePos((position: Point2D) => {
        switch (direction) {
          case "LEFT":
            return { x: position.x - step, y: position.y };
          case "RIGHT":
            return { x: position.x + step, y: position.y };
          case "UP":
            return { x: position.x, y: position.y - step };
          case "DOWN":
          default:
            return { x: position.x, y: position.y + step };
        }
      });
    },
    [step]
  );

  const renderPosition = useMemo<Point2D>(() => ({ x: basePos.x + dragPos.x, y: basePos.y + dragPos.y }), [basePos, dragPos]);

  const reset = useCallback(() => {
    setStatus(INITIAL_STATUS);
    setDebug(INITIAL_DEBUG_STATE);
    setLastGesture(null);
    setBasePos({ x: 0, y: 0 });
    setDragPos({ x: 0, y: 0 });
  }, []);

  return {
    areaRef,
    status,
    debug,
    lastGesture,
    renderPosition,
    nudge,
    reset
  } as const;
}

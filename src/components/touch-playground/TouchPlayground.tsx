import { useMemo, useState } from "react";
import { ControlPanel } from "./ControlPanel";
import { DirectionPad } from "./DirectionPad";
import { GestureDebugPanel } from "./GestureDebugPanel";
import { InfoSection } from "./InfoSection";
import { usePointerGesture } from "@/hooks/usePointerGesture";

const DEFAULT_DISTANCE_THRESHOLD = 48;
const DEFAULT_VELOCITY_THRESHOLD = 0.6;
const DEFAULT_SNAP_BACK = true;

export function TouchPlayground() {
  const [distanceThreshold, setDistanceThreshold] = useState(DEFAULT_DISTANCE_THRESHOLD);
  const [velocityThreshold, setVelocityThreshold] = useState(DEFAULT_VELOCITY_THRESHOLD);
  const [snapBackOnRelease, setSnapBackOnRelease] = useState(DEFAULT_SNAP_BACK);

  const { areaRef, status, debug, lastGesture, renderPosition, nudge, reset } = usePointerGesture({
    distanceThreshold,
    velocityThreshold,
    snapBackOnRelease
  });

  const interactionAreaStyle = useMemo(
    () => ({
      touchAction: "none" as const,
      WebkitUserSelect: "none" as const,
      userSelect: "none" as const
    }),
    []
  );

  const { x: renderX, y: renderY } = renderPosition;

  const cardTransform = useMemo(
    () => ({ transform: `translate(calc(-50% + ${renderX}px), calc(-50% + ${renderY}px))` }),
    [renderX, renderY]
  );

  const handleReset = () => {
    reset();
    setDistanceThreshold(DEFAULT_DISTANCE_THRESHOLD);
    setVelocityThreshold(DEFAULT_VELOCITY_THRESHOLD);
    setSnapBackOnRelease(DEFAULT_SNAP_BACK);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col">
      <ControlPanel
        distanceThreshold={distanceThreshold}
        velocityThreshold={velocityThreshold}
        snapBackOnRelease={snapBackOnRelease}
        onDistanceChange={setDistanceThreshold}
        onVelocityChange={setVelocityThreshold}
        onSnapBackToggle={setSnapBackOnRelease}
        onReset={handleReset}
      />

      <main className="flex-1">
        <div
          ref={areaRef}
          className="relative mx-auto max-w-screen-sm h-[70vh] mt-4 rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden"
          style={interactionAreaStyle}
        >
          <GestureDebugPanel status={status} debug={debug} />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={cardTransform}>
            <div className="w-40 h-24 rounded-2xl border border-neutral-700 bg-neutral-800 shadow-lg flex items-center justify-center transition-transform duration-200" style={{ willChange: "transform" }}>
              <span className="text-sm text-neutral-300">拖曳我</span>
            </div>
          </div>

          <DirectionPad lastGesture={lastGesture} onNudge={nudge} />
        </div>

        <InfoSection />
      </main>

      <footer className="max-w-screen-sm mx-auto p-4 text-xs text-neutral-500">© Demo — 可直接複製本專案作為起始模板。</footer>
    </div>
  );
}

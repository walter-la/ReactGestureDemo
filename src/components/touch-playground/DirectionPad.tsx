import type { GestureName, SwipeDirection } from "@/types/gesture";

const DIRECTIONS: SwipeDirection[] = ["LEFT", "RIGHT", "UP", "DOWN"];

interface DirectionPadProps {
  lastGesture: GestureName;
  onNudge: (direction: SwipeDirection) => void;
}

export function DirectionPad({ lastGesture, onNudge }: DirectionPadProps) {
  return (
    <div className="absolute bottom-3 inset-x-3">
      <div className="grid grid-cols-4 gap-2">
        {DIRECTIONS.map((direction) => (
          <button
            key={direction}
            type="button"
            onClick={() => onNudge(direction)}
            className={`text-center text-xs py-2 rounded-xl border w-full active:scale-95 transition ${
              lastGesture === direction
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-200"
                : "bg-neutral-800/60 border-neutral-700 text-neutral-300"
            }`}
          >
            {direction}
          </button>
        ))}
      </div>
    </div>
  );
}

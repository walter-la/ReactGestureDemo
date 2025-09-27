import type { GestureDebugState } from "@/types/gesture";

interface GestureDebugPanelProps {
  status: string;
  debug: GestureDebugState;
}

export function GestureDebugPanel({ status, debug }: GestureDebugPanelProps) {
  return (
    <div className="absolute inset-0 grid place-items-center pointer-events-none">
      <div className="text-center px-6">
        <div className="text-xs uppercase tracking-widest text-neutral-400 mb-2">狀態</div>
        <div className="text-lg font-medium mb-4">{status}</div>
        <div className="inline-flex items-center gap-3 text-xs text-neutral-300 bg-neutral-800/60 rounded-xl px-3 py-2">
          <span>
            dx: <b className="tabular-nums">{debug.dx}</b>
          </span>
          <span>
            dy: <b className="tabular-nums">{debug.dy}</b>
          </span>
          <span>
            v: <b className="tabular-nums">{debug.v}</b>
          </span>
          <span>
            dt: <b className="tabular-nums">{debug.dt}</b> ms
          </span>
        </div>
      </div>
    </div>
  );
}

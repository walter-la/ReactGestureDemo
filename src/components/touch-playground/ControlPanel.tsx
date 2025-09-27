import type { ChangeEvent } from "react";

interface ControlPanelProps {
  distanceThreshold: number;
  velocityThreshold: number;
  snapBackOnRelease: boolean;
  onDistanceChange: (value: number) => void;
  onVelocityChange: (value: number) => void;
  onSnapBackToggle: (value: boolean) => void;
  onReset: () => void;
}

export function ControlPanel({
  distanceThreshold,
  velocityThreshold,
  snapBackOnRelease,
  onDistanceChange,
  onVelocityChange,
  onSnapBackToggle,
  onReset
}: ControlPanelProps) {
  const handleDistanceChange = (event: ChangeEvent<HTMLInputElement>) => {
    onDistanceChange(Number(event.target.value));
  };

  const handleVelocityChange = (event: ChangeEvent<HTMLInputElement>) => {
    onVelocityChange(Number(event.target.value));
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
      <div className="max-w-screen-sm mx-auto p-4 space-y-3">
        <div>
          <h1 className="text-xl font-semibold">觸控與滑動 Playground（React / Pointer Events）</h1>
          <p className="text-sm text-neutral-400 mt-1">
            在下方黑色區塊內用手指拖曳或快速滑動（上下左右），或點擊下方方向鍵。可調門檻 &amp; 是否放開後彈回。
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center gap-3">
            <span className="w-36 text-sm text-neutral-300">距離門檻（px）</span>
            <input
              type="range"
              min={8}
              max={160}
              value={distanceThreshold}
              onChange={handleDistanceChange}
              className="w-full"
            />
            <span className="tabular-nums w-12 text-right text-neutral-300">{distanceThreshold}</span>
          </label>
          <label className="flex items-center gap-3">
            <span className="w-36 text-sm text-neutral-300">速度門檻（px/ms）</span>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={velocityThreshold}
              onChange={handleVelocityChange}
              className="w-full"
            />
            <span className="tabular-nums w-12 text-right text-neutral-300">{velocityThreshold.toFixed(2)}</span>
          </label>
          <label className="flex items-center gap-3">
            <span className="w-36 text-sm text-neutral-300">放開後彈回中心</span>
            <input
              type="checkbox"
              checked={snapBackOnRelease}
              onChange={(event) => onSnapBackToggle(event.target.checked)}
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-xs text-neutral-300 hover:bg-neutral-800 transition"
            >
              重設參數與位置
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

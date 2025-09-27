export function InfoSection() {
  return (
    <section className="max-w-screen-sm mx-auto p-4 text-sm leading-6 text-neutral-300 space-y-3">
      <h2 className="text-neutral-200 font-semibold">實作重點（最佳實踐）</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <b>Pointer Events</b> 一次支援觸控/滑鼠/手寫筆；避免同時監聽 touch/mouse 的重複邏輯。
        </li>
        <li>
          在互動區塊設定 <code>touch-action: none</code>，阻止預設捲動/滑回上一頁手勢干擾（需要再自行處理滾動手勢時再開）。
        </li>
        <li>
          僅處理 <code>e.isPrimary</code> 與單一 <code>pointerId</code>，降低多指影響；必要時可擴充 pinch/rotate。
        </li>
        <li>
          以 <b>距離或速度門檻</b> 判斷滑動：避免使用時間過長但位移小的假陽性，或是短距離但高速的快速滑動。
        </li>
        <li>
          用 <b>原生 addEventListener</b> 綁定事件，避開 React 合成事件對 passive/capture 的限制。
        </li>
        <li>
          透過 <code>setPointerCapture</code> 確保快速移動時仍能收到 move/up 事件。
        </li>
        <li>UI 層盡量 <b>低耦合</b>：偵測器只輸出方向/距離/速度，行為（例如翻頁）由外層決定。</li>
      </ul>
    </section>
  );
}

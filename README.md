# React Gesture Playground

示範如何在手機（或支援觸控的裝置）上實作：

- 觸控拖曳（Drag）
- 滑動手勢偵測（Swipe，上下左右）
- 速度與距離門檻判斷
- UI 實際回饋與可互動控制

此專案使用 **Vite + React + TypeScript + Tailwind CSS** 建立，並將原本的單一檔案範例重構為具備模組化架構、易於維護與擴充的結構。

## 📁 專案結構

```
src/
├─ components/
│  └─ touch-playground/
│     ├─ ControlPanel.tsx        # 門檻與設定調整 UI
│     ├─ DirectionPad.tsx        # 上下左右按鈕
│     ├─ GestureDebugPanel.tsx   # 即時除錯資訊
│     ├─ InfoSection.tsx         # 實作說明
│     └─ TouchPlayground.tsx     # 組合整體體驗的主要元件
├─ hooks/
│  └─ usePointerGesture.ts       # 封裝 Pointer Events 手勢邏輯
├─ styles/
├─ types/
│  └─ gesture.ts                 # 共享型別定義
├─ App.tsx                       # 載入 Playground
└─ main.tsx                      # React 進入點
```

核心邏輯被包裝在 `usePointerGesture` hook 中，並以多個 UI 元件拆分畫面，讓手勢偵測與畫面呈現保持低耦合。

## 🚀 開發與執行

```bash
# 安裝依賴
npm install

# 本地開發伺服器（http://localhost:5173）
npm run dev

# 程式碼靜態檢查
npm run lint

# 建構靜態檔案
npm run build
```

## 🧠 功能亮點

- **Pointer Events API**：一次支援觸控、滑鼠與手寫筆，避免重複邏輯。
- **距離/速度雙門檻**：同時參考位移與速度，降低誤判率。
- **setPointerCapture**：確保快速滑動仍能接收到 `pointermove`/`pointerup`。
- **touch-action: none**：阻止預設捲動或系統返回手勢干擾。
- **彈性參數調整**：可調整距離、速度門檻與是否放開後彈回。
- **方向按鈕**：模擬手勢輸入，方便測試與 Demo。

## 📚 延伸應用

- 手勢翻頁、滑動式導覽、卡片拖曳等互動介面。
- 了解如何將 Pointer Events 與 React Hooks 結合，打造可重用邏輯。
- 透過 Tailwind CSS 快速調整外觀，維持語意化的 UI 元件拆分。

歡迎 Fork/Clone 後自行擴充更多手勢，例如雙指縮放（pinch）或旋轉（rotate）。

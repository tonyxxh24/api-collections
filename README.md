# api-collections

Collect free/paid and useful api related to my interests through a modern UI.
以 monorepo 方式管理前後端的 API 收藏與測試平台。

## 專案結構（目前有兩條流程）

```txt
.
├─ apps/
│  ├─ web/                      # Next.js 前端（新流程）
│  └─ api/                      # Node/Express API proxy（新流程）
├─ src/
│  ├─ server.js                 # legacy API server（讀 data/apis/seed.json）
│  └─ apis.js
├─ data/apis/
│  ├─ schema.json
│  └─ seed.json
├─ frontend/                    # 靜態 visualization 元件 demo
└─ dashboard/                   # 靜態 dashboard demo
```

## 先說結論：現在怎麼跑？

### A) 不安裝 npm 套件也可跑（legacy 路線）

```bash
npm run start:legacy
```

啟動後可用：

- `GET http://localhost:3000/apis`
- 支援 query：`country` / `pricing` / `category` / `q`

這條路線最穩，適合先確認 seed 資料與篩選 API 邏輯。

### B) 完整 Web App 路線（apps/web + apps/api）

先安裝依賴：

```bash
npm install
```

再開兩個 terminal：

```bash
npm run dev:api
npm run dev:web
```

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

> 若你在 codex sandbox 內遇到外網限制，`npm install` 可能因 registry 403 失敗，這不是程式碼錯誤，而是環境網路策略限制。

## 品質門檻（Minimum Quality Checks）

### 全專案檢查

```bash
npm run check
```

依序包含：

- `npm run lint`
- `npm run typecheck`
- `npm run test`

### API-only（在受限環境建議先跑）

```bash
npm run check:api
```

依序包含：

- API workspace lint
- 結構型別檢查（seed 與 metadata）
- API proxy 測試

## 測試指令

```bash
# root legacy /apis tests
npm run test:root

# apps/api tests
npm run test:api

# type checks
npm run typecheck:root
```

## Provider 擴充流程

新增 provider 時，請於 `apps/api/src/providers/{name}.js` 實作固定介面：

- `metadata()`：回傳 API 基本資訊（id、name、description、docsUrl）。
- `buildRequest(input)`：將測試 payload 轉換成實際 HTTP 請求（url、method、headers、body）。
- `normalizeResponse(response, data)`：標準化外部 API 回應格式，供前端一致顯示。

## Data

- API schema: `data/apis/schema.json`
- Seed data: `data/apis/seed.json`

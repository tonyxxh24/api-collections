# api-collections

Collect free/paid and useful api related to my interests through a modern UI.
以 monorepo 方式管理前後端的 API 收藏與測試平台。

## 專案結構

```txt
.
├─ apps/
│  ├─ web/                      # Next.js 前端
│  │  ├─ app/
│  │  │  ├─ page.js             # / API 列表
│  │  │  ├─ api/[id]/page.js    # /api/[id] API 詳細 + 測試面板
│  │  │  └─ dashboard/page.js   # /dashboard 視覺化看板
│  │  └─ components/
│  └─ api/                      # Express 後端
│     └─ src/
│        ├─ index.js            # REST API 入口
│        └─ providers/          # Provider 介面與實作
├─ package.json                 # npm workspaces 設定
└─ README.md
```

## 啟動方式

### 1) 安裝依賴

```bash
npm install
```

### 2) 啟動後端

```bash
npm run dev:api
```

預設於 `http://localhost:4000`。

### 3) 啟動前端

```bash
npm run dev:web
```

預設於 `http://localhost:3000`，前端會呼叫 `NEXT_PUBLIC_API_BASE_URL`（預設 `http://localhost:4000`）。

## 後端 REST 端點

- `GET /apis`：列出所有 provider metadata。
- `GET /apis/:id`：取得單一 provider metadata。
- `POST /apis/:id/test`：依 provider 規則組裝請求並代理呼叫目標 API。

## Provider 擴充流程

新增 provider 時，請於 `apps/api/src/providers/{name}.js` 實作固定介面：

- `metadata()`：回傳 API 基本資訊（id、name、description、docsUrl）。
- `buildRequest(input)`：將測試 payload 轉換成實際 HTTP 請求（url、method、headers、body）。
- `normalizeResponse(response, data)`：標準化外部 API 回應格式，供前端一致顯示。

### 新增一個 provider 的步驟

1. 建立 `apps/api/src/providers/my-provider.js`，實作 `ApiProvider`。
2. 在 `apps/api/src/providers/index.js` 匯入並註冊到 `providers` map。
3. 重啟後端後，`GET /apis` 即可看到新 provider；前端列表也會同步顯示。

## Dashboard demo

A lightweight front-end dashboard is available at `/dashboard` with reusable visualization components:

- `DataTable`
- `StatCard`
- `LineChart`
- `BarChart`

Collect free/paid and useful APIs related to public data.

## Data

- API schema: `data/apis/schema.json`
- Seed data: `data/apis/seed.json`

## Backend

Run server:

```bash
npm start
```

GET `/apis` supports query params:

- `country`
- `pricing`
- `category`
- `q` (full-text search in `id/name/country/organization/category/tags`)

Example:

```bash
curl "http://localhost:3000/apis?country=Taiwan&pricing=free&category=weather&q=cwa"
```

Run a local static server from the repository root and open `http://localhost:8000/dashboard/`.


## 品質門檻（Minimum Quality Checks）

在提交前可執行：

```bash
npm run check
```

此指令會依序執行：

- `npm run lint`：語法檢查（web/api/root）。
- `npm run typecheck`：結構型別檢查（seed metadata / API metadata / web 頁面必要檔案）。
- `npm run test`：基本測試（API proxy 與 root `/apis` filter）。


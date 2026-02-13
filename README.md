# api-collections

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

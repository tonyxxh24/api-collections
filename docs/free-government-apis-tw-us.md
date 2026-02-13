# 專案可用 API 與政府免費 API 清單（台灣 / 美國）

> 更新日期：2026-02-13
>
> 說明：這份清單已同步到專案 `data/apis/seed.json`，可直接透過 `GET /apis` 查詢。

---

## 1) 這個專案目前實際可打的 API（已在 seed 資料中）

目前共 **9 個**（台灣 4 + 美國 5）：

| id | 名稱 | 國家 | 費用 | 認證 |
|---|---|---|---|---|
| `tw-cwa-opendata` | Taiwan Central Weather Administration Open Data API | Taiwan | free | API Key |
| `tw-motc-tdx` | Taiwan TDX Transport API | Taiwan | free | OAuth2 Client Credentials |
| `tw-data-gov-openapi` | Taiwan Government Open Data Platform API | Taiwan | free | None（依資料集） |
| `tw-taipei-open-data` | Taipei City Open Data API | Taiwan | free | None（依資料集） |
| `us-noaa-nws` | US NOAA National Weather Service API | United States | free | 無（建議帶 User-Agent） |
| `us-census-data` | US Census Bureau Data API | United States | free | API Key（低流量可選填） |
| `us-nasa-openapi` | US NASA Open APIs | United States | free | API Key（可用 DEMO_KEY） |
| `us-openfda` | US FDA OpenFDA API | United States | free | API Key（可選） |
| `us-cdc-socrata` | US CDC Open Data API (Socrata) | United States | free | None（App Token 可選） |

---

## 2) 已加入 code 的新增 API

### 台灣政府
- `tw-data-gov-openapi`（政府資料開放平台）
- `tw-taipei-open-data`（臺北市政府資料開放平台）

### 美國政府
- `us-nasa-openapi`（NASA）
- `us-openfda`（FDA）
- `us-cdc-socrata`（CDC / Socrata）

---

## 3) 使用方式

### 查全部
```bash
curl "http://localhost:3000/apis"
```

### 查台灣免費 API
```bash
curl "http://localhost:3000/apis?country=Taiwan&pricing=free"
```

### 查美國政府健康類 API
```bash
curl "http://localhost:3000/apis?country=United%20States&category=health"
```


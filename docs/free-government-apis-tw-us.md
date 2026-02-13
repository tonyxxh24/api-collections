# 專案可用 API 與政府免費 API 清單（台灣 / 美國）

> 更新日期：2026-02-13
> 
> 說明：此清單分為兩部分：
> 1) 目前這個專案裡「已建檔、可透過 `/apis` 查詢」的 API。  
> 2) 額外整理的台灣政府 / 美國政府常用免費 API（可作為後續擴充候選）。

---

## 1) 這個專案目前實際可打的 API（已在 seed 資料中）

可透過後端端點 `GET /apis` 查詢到以下 4 個 API：

| id | 名稱 | 國家 | 費用 | 認證 |
|---|---|---|---|---|
| `tw-cwa-opendata` | Taiwan Central Weather Administration Open Data API | Taiwan | free | API Key |
| `tw-motc-tdx` | Taiwan TDX Transport API | Taiwan | free | OAuth2 Client Credentials |
| `us-noaa-nws` | US NOAA National Weather Service API | United States | free | 無（建議帶 User-Agent） |
| `us-census-data` | US Census Bureau Data API | United States | free | API Key（低流量可選填） |

---

## 2) 台灣政府免費 API（可用候選）

| API | 單位 | 類型 | 認證 | 文件 / 入口 |
|---|---|---|---|---|
| CWA Open Data | 中央氣象署 | 氣象、觀測、預報 | API Key | https://opendata.cwa.gov.tw/devManual/insrtuction |
| TDX 運輸資料 API | 交通部（TDX 平台） | 公車、軌道、路況、旅運 | OAuth2 | https://tdx.transportdata.tw/api-service/swagger |
| 政府資料開放平台 API | 國發會資料開放平台 | 各部會開放資料目錄/資料集 | 多數免認證（依資料集） | https://data.gov.tw/ |
| 臺北市政府資料開放平台 API | 臺北市政府 | 市政資料、交通、民生 | 多數免認證（依資料集） | https://data.taipei/ |

---

## 3) 美國政府免費 API（可用候選）

| API | 單位 | 類型 | 認證 | 文件 / 入口 |
|---|---|---|---|---|
| NOAA Weather.gov API | NOAA / National Weather Service | 天氣警報、格點預報 | 無（建議 User-Agent） | https://www.weather.gov/documentation/services-web-api |
| U.S. Census Data API | U.S. Census Bureau | 人口、經濟、社會統計 | API Key（低量可不帶） | https://www.census.gov/data/developers/guidance/api-user-guide.html |
| NASA Open APIs | NASA | 天文、地球觀測、影像 | 多數使用 API Key（可用 DEMO_KEY） | https://api.nasa.gov/ |
| openFDA API | U.S. FDA | 藥品、不良反應、器材資料 | API Key（可不帶，有限流） | https://open.fda.gov/apis/ |
| CDC Open Data API（Socrata） | U.S. CDC | 公衛監測與統計資料 | 多數免認證（高量可用 app token） | https://data.cdc.gov/ |

---

## 4) 建議下一步（若要直接整合進本專案）

1. 先以 `country=Taiwan/United States` + `pricing=free` 做資料治理規則。
2. 優先擴充「免認證或低門檻認證」API（例如 NOAA、Census、NASA）。
3. 每個新 API 補齊：
   - `rateLimit.policy/notes`
   - `license.name/url`
   - `requestTemplates`（至少 1 條）
   - `exampleResponses`（至少 1 筆）

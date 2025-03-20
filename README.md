# 🚀 Flight Price Demo 機票比價範例

使用 Amadeus API 構建的簡易機票比價搜尋，部署於 Cloudflare Pages，支援匯率自動換算 (EUR ➔ TWD)。

## 🌐 功能特色

- 搜尋條件：
  - 出發地 & 目的地（IATA 機場代碼）
  - 出發日期、回程日期
  - 直飛航班過濾
- 顯示內容：
  - 航空公司全名 & 航班號
  - 去程 & 回程航班的詳細資訊
  - 總價 (EUR) + 台幣換算 (TWD)
  - 機票來源（GDS / Airline）
  - 出票航空公司
  - 是否為直飛或含轉機

---

## ⚙️ 運作流程

1. 前端 (index.html)
2. 後端 Function (functions/api/search.js)
3. 價格自動換算：
   - 使用 [exchangerate.host](https://exchangerate.host) API 取得即時 EUR → TWD 匯率

---

## 📋 環境變數

| 變數名稱  | 說明                   |
|---------|----------------------|
| `API_KEY` | Amadeus API 金鑰       |
| `API_SECRET` | Amadeus API 密鑰       |

---

## 🛫 GDS 說明

**GDS (Global Distribution System)** 為全球旅行產業分銷平台，提供票務代理、航空公司等查詢與預訂服務，常見有 Amadeus、Sabre、Travelport 等。

搜尋結果會顯示票價來源，如：


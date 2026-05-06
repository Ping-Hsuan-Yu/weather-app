# 開發用「歷史資料 Replay」功能規劃

> 狀態：尚未實作 — 此文件為日後實作前的設計筆記
> 相依：`scripts/record-weather.js`（每 5 分鐘記錄一筆，輸出到 `recordings/`）

## 目標

讓開發時可以在頁面上切換任意「過去抓到的某一筆 CWA 資料」，藉此重現換日、邊界時間、缺值等難以即時遇到的場景。

只在 dev 環境啟用，不影響 production 行為與 bundle size。

## 資料來源

- `recordings/{ISO-timestamp}_weather.json` — `GET_WEATHER` 完整 response
- `recordings/{ISO-timestamp}_solar.json` — `GET_SOLAR_EVENTS` 完整 response
- 兩個檔案以同樣的 timestamp 配對；可能會出現只有 weather 沒有 solar 的情況（fetch error 時）

## 整體流程

```
[Replay UI 面板] -- 選擇 timestamp -->  URL ?replay=<ts>
                                           |
                                           v
                                  [Apollo HttpLink]
                                  附上 x-replay-ts header
                                           |
                                           v
                                  [/api/graphql route]
                                  偵測到 header → 從檔案讀取
                                  否則照舊 proxy 到 CWA
```

選用 URL query param 而非 cookie / localStorage 的理由：
- 重新整理後狀態保留
- 可貼網址給別人 reproduce 同一個 bug
- 切回即時資料只要清掉 query param

## 實作切片

### Phase 1：後端 replay 能力

1. **新增 dev-only API**：`GET /api/dev/recordings`
   - 掃 `recordings/` 列出所有 timestamp（已配對的 weather + solar）
   - production build 時以 `process.env.NODE_ENV !== "production"` 把整個 route 擋掉（直接回 404）
   - 回傳格式：
     ```json
     { "timestamps": ["2026-05-02T05-08-32-247Z", ...] }
     ```

2. **修改 `/api/graphql/route.ts`**
   - 讀取 request header `x-replay-ts`
   - 若有值且檔案存在 → 依 query 名稱（`Aqi` / `Forecast`）回傳對應 JSON
   - 若有值但檔案缺失 → 回 404 並在 response body 註明，方便前端顯示「該時間點無資料」
   - 若無值 → 維持現行 proxy 行為

3. **修改 `src/lib/apolloClient.ts`**
   - HttpLink 加上動態 headers（從 `localStorage` / URL 讀 `replay` 值）
   - 切換 replay 時要清空 Apollo cache（否則會直接吃舊 cache 不打 server）
   - 提示：用 `setContext` link 而不是 HttpLink 的固定 headers，才能每次請求動態取值

### Phase 2：UI 控制面板

只在 `NODE_ENV === "development"` 才掛載；建議放在 root layout 最外層 portal，不要混進業務元件。

最小可用版本：
- 浮動於畫面右下角的小 panel（可摺疊）
- 內容：
  - 上一筆 / 下一筆按鈕
  - 顯示目前 timestamp（含本地時區轉換）
  - 「Live」按鈕：清掉 replay query param 回到即時資料
  - 進度條 / slider 拖曳跨越整個 72 小時範圍
- 切換時：
  1. 更新 URL query param
  2. 清空 Apollo cache
  3. 觸發 `useSuspenseQuery` 重新打 server（會自動因 URL 變動 re-render）

進階版本（之後再考慮）：
- 自動播放（每秒前進 N 筆，視覺化看數值如何隨時間變化）
- 標記「異常」snapshot 的書籤
- diff 模式：並排顯示前後兩筆

### Phase 3（選做）：時間 mocking

問題：replay 一筆凌晨 02:00 的資料，但目前畫面上的「現在」是依 `new Date()` 算的。例如 `Forecast24hr` 會用「現在」去切預報資料起點，造成顯示與當下時間錯位。

選項：
- **不處理**：接受顯示錯位，反正只是要看資料。最省事。
- **替換 `new Date()`**：開發模式下，用 replay timestamp 當「現在」覆寫一個全域 `getNow()` helper。需要把目前散落在各元件的 `new Date()` 收斂成一個 helper。
- **元件層 prop**：`<WeatherDataProvider now={replayTime ?? new Date()}>`，用 context 傳 now。

建議走第三條（context 傳 now），日後寫測試也能受益。實作前先把所有 `new Date()` 列出來盤點。

## 待確認決策

- **配對缺失要忽略還是顯示**：solar 抓失敗、weather 還在的 timestamp 要不要列入可選清單？傾向「列入但 UI 標紅」，方便就是用來重現這種狀況。
- **Recording 範圍滾動**：72 小時跑完後新檔案還會繼續產生嗎？目前 script 跑完 72 小時就 exit，要長期累積需要改 script。
- **Replay panel 的 slider 視覺**：時間軸上要不要標出有 errors.log 紀錄的時段？

## 不在範圍內

- Production 環境的時間切換（這只服務開發者）
- 把 `recordings/` 上傳到雲端共用（個人本機資料就夠了）
- 跨座標 replay（目前只記錄台中一個點，要支援多座標需要先擴充 script）

## 相關檔案

- `scripts/record-weather.js` — 資料來源產生器
- `src/app/api/graphql/route.ts` — Phase 1 主要修改點
- `src/lib/apolloClient.ts` — Phase 1 動態 headers
- `src/context/WeatherDataContext.tsx` — Phase 3 注入 now
- `src/app/layout.tsx` — Phase 2 掛載 dev panel

# 臺灣即時天氣預報

> [!NOTE]
> #### 為何開發？
> 一直以來使用的天氣預報app因為一些內部原因從網路上下架了，手機內建的天氣預報又不是拿中央氣象署的資料，準確性不太夠，氣象局開發的app又實在是太醜了，索性就自己開發一個🤩

- 資料來源：[交通部中央氣象署](https://www.cwa.gov.tw/)
- 顯示數據：
  - 當前溫度
  - 體感溫度
  - 當日最高最低溫
  - 未來24小時
    - 氣溫預報
    - 天氣狀況
    - 降雨機率
  - 未來一週
    - 日夜溫度
    - 日夜天氣狀況
    - 降雨機率
  - AQI
  - 紫外線指數
  - 相對濕度
  - 日落日出時間
- 功能：
  - 現在位置
  - 深色模式隨日落時間

---
    
### TODO
  * [x] ~~發佈到一個公開的地方(順便解決cors的問題)~~
    * [x] ~~轉換框架 Vite -> Next 建立Proxy 解決cors的問題~~
  * [x] 儲存使用者地理位置
  * [x] 地理位置刷新按鈕
  * [x] -99 狀態處理(溫度濕度)
  * [ ] Loading skeleton
  * [ ] metaData 設定 (apple-icon/favicon/manifest.json)
  * [ ] 自行選擇其他地點氣象
  * [ ] 根據天氣狀況改變背景
    * [ ] 設計不同天氣狀況的背景
  * [ ] 顯示昨天天氣供參
    * [ ] 穿衣建議
  * [ ] 整合曬衣/適合外出與否資訊
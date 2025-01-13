import { useWeatherContext } from "../contexts/WeatherContext";

export default function Aqi() {
    const {aqiData} = useWeatherContext()
  return (
    <div className="glass basis-1/3 pt-1 pb-2 px-2">
    {/* <div className="bg-stone-50 dark:bg-slate-700 basis-1/3 pt-1 pb-2 px-2 rounded shadow"> */}
      <div className="flex justify-between items-baseline">
        <span className="text-stone-500 dark:text-stone-200">AQI</span>
        <span className="text-xl text-stone-900 dark:text-stone-50">{aqiData.data}</span>
      </div>
      <div className="w-full h-1 aqi-bar rounded-sm relative mt-1 mb-2">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white"
          style={{ left: `${Number(aqiData.data)/3}%` }}
        ></div>
      </div>
      <div className="text-end text-xs text-stone-500 dark:text-stone-200">{aqiData.status}</div>
    </div>
  );
}

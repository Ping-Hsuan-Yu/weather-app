import { useWeatherContext } from "../contexts/WeatherContext";

export default function RelativeHumidity() {
  const { relativeHumidity } = useWeatherContext();
  return (
    <div className="basis-1/3 py-1 px-2 glass">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-stone-500 dark:text-stone-200">相對濕度</span>
        <span className="text-xl text-stone-900 dark:text-stone-50">
          {Math.round(Number(relativeHumidity))}
          <span className="text-sm">%</span>
        </span>
      </div>
      <div className="w-full h-1 rh-bar rounded-sm relative mt-1 mb-2">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white"
          style={{ left: `${relativeHumidity}%` }}
        ></div>
      </div>
    </div>
  );
}

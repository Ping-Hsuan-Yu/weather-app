import { useWeatherContext } from "../contexts/WeatherContext";

export default function MinMaxTemp() {
  const { todayMinTemp, todayMaxTemp } = useWeatherContext();

  return (
    <div className="flex -translate-x-1">
      <span className="material-symbols-outlined text-2xl text-orange-600 dark:text-orange-500 translate-y-1">
        straight
      </span>
      <div className="text-3xl font-light text-stone-500 dark:text-stone-200">
        <span className="tracking-tight">{todayMaxTemp.slice(0, -1)}</span>
        <span className="tracking-wider">{todayMaxTemp.slice(-1)}</span>
        <sup className="text-lg">°</sup>
      </div>
      <span className="material-symbols-outlined text-2xl text-sky-600 dark:text-sky-500 rotate-180">
        straight
      </span>
      <div className="text-3xl font-light text-stone-500 dark:text-stone-200">
        <span className="tracking-tight">{todayMinTemp.slice(0, -1)}</span>
        <span className="tracking-wider">{todayMinTemp.slice(-1)}</span>
        <sup className="text-lg">°</sup>
      </div>
    </div>
  );
}

import { useWeatherContext } from "../contexts/WeatherContext";

export default function ApparentTemp() {
  const { apparentTempCompare, apparentTemp } = useWeatherContext();

  return (
    <div className="font-light text-stone-500 dark:text-stone-200">
      <span className="text-sm">體感溫度</span>
      <span className={`text-2xl ms-1 ${apparentTempCompare}`}>
        {apparentTemp}
        <sup className="text-base">°</sup>
      </span>
    </div>
  );
}

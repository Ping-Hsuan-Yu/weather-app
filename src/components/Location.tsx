import { useWeatherContext } from "../contexts/WeatherContext";

export default function Location() {
  const { town } = useWeatherContext();

  return (
    <div className="flex justify-center items-center text-stone-500 dark:text-stone-200 gap-1">
      <span className="material-symbols-outlined text-xl">near_me</span>
      <div className="text-xs">
        {town.ctyName}
        {town.townName}
      </div>
    </div>
  );
}

import { useWeatherContext } from "../contexts/WeatherContext";

export default function CurrentTemp() {
  const { currentTemp } = useWeatherContext();

  return (
    <div className="text-8xl font-thin tracking-tight dark:text-stone-50">
      <span className="tracking-tight">
        {currentTemp.toString().slice(0, -1)}
      </span>
      <span>{currentTemp.toString().slice(-1)}</span>
      <sup className="text-6xl">°</sup>
    </div>
  );
}

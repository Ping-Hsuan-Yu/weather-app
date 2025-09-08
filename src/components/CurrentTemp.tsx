"use client";

import { useWeatherData } from "@/context/WeatherDataContext";

export default function CurrentTemp() {
  const { currentTemp } = useWeatherData();

  return (
    <div className="text-8xl font-thin tracking-tight text-primary">
      <span className="tracking-tight">
        {currentTemp.toString().slice(0, -1)}
      </span>
      <span>{currentTemp.toString().slice(-1)}</span>
      <sup className="text-6xl">°</sup>
    </div>
  );
}

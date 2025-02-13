"use client"

import { useMemo } from "react";
import { useWeatherContext } from "@/context/WeatherContext";

export default function Aqi() {
  const { weatherData } = useWeatherContext();
  const aqiData = useMemo(
    () => ({ data: weatherData.aqi[0].aqi, status: weatherData.aqi[0].status }),
    [weatherData]
  );

  return (
    <div className="glass basis-1/3 pt-1 pb-2 px-2">
      <div className="flex justify-between items-baseline">
        <span className="text-secondary">AQI</span>
        <span className="text-xl text-primary">{aqiData.data}</span>
      </div>
      <div className="w-full h-1 aqi-bar rounded-sm relative mt-1 mb-2">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white"
          style={{ left: `${Number(aqiData.data) / 3}%` }}
        ></div>
      </div>
      <div className="text-end text-xs text-secondary">{aqiData.status}</div>
    </div>
  );
}

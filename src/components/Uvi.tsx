"use client"

import { useMemo } from "react";
import { useWeatherContext } from "@/context/WeatherContext";

export default function Uvi() {
  const { weatherData } = useWeatherContext();
  const uv = useMemo(
    () => weatherData.aqi[0].town.forecastWeekday.UVIndex.Time[0],
    [weatherData]
  );
  const notToday = new Date(uv.StartTime).getDate() !== new Date().getDate();
  const uvBar = Number(uv.UVIndex) >= 10 ? "95" : `${uv.UVIndex}0`;
  return (
    <div className=" basis-1/3 pt-1 pb-2 px-2 glass">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-secondary">紫外線指數</span>
        <span className="text-xl text-primary">
          {notToday ? "0" : uv.UVIndex}
        </span>
      </div>
      <div className="w-full h-1 uvi-bar rounded-sm relative mt-1 mb-2">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white"
          style={{ left: `${notToday ? "0" : uvBar}%` }}
        ></div>
      </div>
      {!notToday && (
        <div className="text-end text-xs text-secondary">
          {uv.UVExposureLevel}
        </div>
      )}
    </div>
  );
}

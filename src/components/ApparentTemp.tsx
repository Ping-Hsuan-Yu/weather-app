"use client";

import { useMemo } from "react";
import { useWeatherData } from "@/context/WeatherDataContext";

export default function ApparentTemp() {
  const { weatherData, currentTemp } = useWeatherData();
  
  const apparentTemp = useMemo(() => {
    const data = weatherData.aqi[0].town.forecast72hr.ApparentTemperature.Time;
    const now = new Date();
    const closest = data.reduce((prev, current) => {
      const prevDiff = Math.abs(
        new Date(prev.DataTime).getTime() - now.getTime()
      );
      const currentDiff = Math.abs(
        new Date(current.DataTime).getTime() - now.getTime()
      );
      return currentDiff < prevDiff ? current : prev;
    });
    return closest.ApparentTemperature;
  }, [weatherData]);

  const apparentTempCompare = useMemo(() => {
    if (Number(apparentTemp) > currentTemp) {
      return "text-red-600";
    } else if (Number(apparentTemp) < currentTemp) {
      return "text-sky-600";
    } else {
      return "";
    }
  }, [apparentTemp, currentTemp]);
  return (
    <div className="font-light">
      <span className="text-sm text-tertiary">體感溫度</span>
      <span className={`text-2xl ms-1 ${apparentTempCompare}`}>
        {apparentTemp}
        <sup className="text-base">°</sup>
      </span>
    </div>
  );
}

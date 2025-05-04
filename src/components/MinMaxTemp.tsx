"use client";

import { useMemo } from "react";
import { useWeatherContext } from "@/context/WeatherContext";

export default function MinMaxTemp() {
  const { weatherData } = useWeatherContext();
  const todayMinTemp = useMemo(() => {
    const forecastMinTemp = Number(
      weatherData.aqi[0].town.forecastWeekday.MinTemperature.Time[0]
        .MinTemperature
    );
    const dailyLowTemp = Number(
      weatherData.aqi[0].station.WeatherElement.DailyExtreme.DailyLow
        .TemperatureInfo.AirTemperature
    );
    return Math.round(Math.min(forecastMinTemp, dailyLowTemp)).toString();
  }, [weatherData]);

  const todayMaxTemp = useMemo(() => {
    const forecastMaxTemp = Number(
      weatherData.aqi[0].town.forecastWeekday.MaxTemperature.Time[0]
        .MaxTemperature
    );
    const dailyHighTemp = Number(
      weatherData.aqi[0].station.WeatherElement.DailyExtreme.DailyHigh
        .TemperatureInfo.AirTemperature
    );
    return Math.round(Math.max(forecastMaxTemp, dailyHighTemp)).toString();
  }, [weatherData]);

  return (
    <div className="flex -translate-x-1">
      <span className="material-symbols-outlined text-2xl text-orange-600 dark:text-orange-500 translate-y-1">
        straight
      </span>
      <div className="text-3xl font-light text-tertiary">
        <span className="tracking-tight">{todayMaxTemp.slice(0, -1)}</span>
        <span className="tracking-wider">{todayMaxTemp.slice(-1)}</span>
        <sup className="text-lg">°</sup>
      </div>
      <span className="material-symbols-outlined text-2xl text-sky-600 dark:text-sky-500 rotate-180">
        straight
      </span>
      <div className="text-3xl font-light text-tertiary">
        <span className="tracking-tight">{todayMinTemp.slice(0, -1)}</span>
        <span className="tracking-wider">{todayMinTemp.slice(-1)}</span>
        <sup className="text-lg">°</sup>
      </div>
    </div>
  );
}

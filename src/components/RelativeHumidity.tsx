"use client"

import { useMemo } from "react";
import { useWeatherContext } from "@/context/WeatherContext";

export default function RelativeHumidity() {
  const { weatherData, secondaryStation } = useWeatherContext();
  const relativeHumidity = useMemo(() => {
    const hUMD = weatherData.aqi[0].station.weatherElement.filter(
      (item) => item.elementName === "HUMD"
    )[0].elementValue;
    const secHUMD = secondaryStation?.weatherElement.filter(
      (item) => item.elementName === "HUMD"
    )[0].elementValue;
    const result = hUMD === "-99.0" ? secHUMD : hUMD;
    return result;
  }, [weatherData]);
  return (
    <div className="basis-1/3 py-1 px-2 glass">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-secondary">相對濕度</span>
        <span className="text-xl text-primary">
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

"use client";

import { useWeatherData } from "@/context/WeatherDataContext";
import { useLocation } from "@/context/LocationContext";

export default function Location() {
  const { town } = useWeatherData();
  const { getUserPosition } = useLocation();

  return (
    <div className="flex justify-center items-center text-tertiary gap-1">
      <span className="material-symbols-outlined text-xl">near_me</span>
      <div className="text-xs">
        {`${town.townName} ${town.villageName}`}
      </div>
      <span className="material-symbols-outlined text-xl cursor-pointer" onClick={getUserPosition}>sync</span>
    </div>
  );
}

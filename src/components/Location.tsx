"use client"

import { useWeatherContext } from "@/context/WeatherContext";

export default function Location() {
  const { town, getUserPosition } = useWeatherContext();

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

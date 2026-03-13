"use client";

import { useCallback, useEffect, useState } from "react";

type Coordinates = { latitude: number; longitude: number };

const DEFAULT_LOCATION: Coordinates = {
  latitude: 24.169384,
  longitude: 120.658199,
};

export function useUserLocation() {
  // 初始值為 null，server 和 client 一致，避免 hydration mismatch
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const saveLocationToLocalStorage = useCallback((loc: Coordinates) => {
    try {
      localStorage.setItem("userLocation", JSON.stringify(loc));
    } catch {
      // no-op
    }
  }, []);

  const getUserPosition = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc = { latitude, longitude };
        setUserLocation(loc);
        saveLocationToLocalStorage(loc);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, [saveLocationToLocalStorage]);

  // mount 後才讀 localStorage，確保 SSR 不會執行
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userLocation");
      if (raw) {
        setUserLocation(JSON.parse(raw));
      } else if ("geolocation" in navigator) {
        getUserPosition();
      } else {
        setUserLocation(DEFAULT_LOCATION);
      }
    } catch {
      setUserLocation(DEFAULT_LOCATION);
    }
  }, [getUserPosition]);

  return { userLocation, setUserLocation, getUserPosition } as const;
}


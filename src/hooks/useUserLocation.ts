"use client";

import { useCallback, useEffect, useState } from "react";

type Coordinates = { latitude: number; longitude: number };

const DEFAULT_LOCATION: Coordinates = {
  latitude: 24.169384,
  longitude: 120.658199,
};

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<Coordinates>(() => {
    if (typeof window === "undefined") return DEFAULT_LOCATION;
    try {
      const raw = localStorage.getItem("userLocation");
      return raw ? JSON.parse(raw) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const saveLocationToLocalStorage = useCallback((loc: Coordinates) => {
    if (typeof window === "undefined") return;
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

  useEffect(() => {
    // If no saved location, try to fetch current position once on mount
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("userLocation");
      if (!raw && "geolocation" in navigator) {
        getUserPosition();
      }
    } catch {
      // ignore
    }
  }, [getUserPosition]);

  return { userLocation, setUserLocation, getUserPosition } as const;
}


"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { useUserLocation } from "@/hooks/useUserLocation";

type Coordinates = { latitude: number; longitude: number };

type LocationContextType = {
  userLocation: Coordinates;
  getUserPosition: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { userLocation, getUserPosition } = useUserLocation();

  const value = useMemo(
    () => ({ userLocation, getUserPosition }),
    [userLocation, getUserPosition]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}


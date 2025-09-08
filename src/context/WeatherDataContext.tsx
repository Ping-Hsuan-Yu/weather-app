"use client";

import {
  skipToken,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@apollo/client";
import { createContext, ReactNode, useContext, useMemo } from "react";
import {
  AqiQueryResult,
  ForecastQueryResult,
  LocationName,
  Station,
} from "@/interface/interface";
import { GET_SOLAR_EVENTS, GET_WEATHER } from "@/graphql/queries";
import { useLocation } from "@/context/LocationContext";

type WeatherDataContextType = {
  weatherData: AqiQueryResult;
  town: LocationName;
  currentTemp: number;
  secondaryStation: Station | null;
  solarEventsToDate: {
    sunrise: Date;
    sunset: Date;
    tomorrowSunrise: Date;
    tomorrowSunset: Date;
  };
};

const WeatherDataContext = createContext<WeatherDataContextType | undefined>(
  undefined
);

export function WeatherDataProvider({ children }: { children: ReactNode }) {
  const { userLocation } = useLocation();

  const now = new Date();
  const theDayAfterTomorrow = new Date();
  theDayAfterTomorrow.setDate(now.getDate() + 2);
  const time = theDayAfterTomorrow.toISOString().split("T")[0];

  const { error: weatherDataError, data: weatherData } = useSuspenseQuery(
    GET_WEATHER,
    userLocation
      ? {
          variables: {
            lon: userLocation?.longitude,
            lat: userLocation?.latitude,
            time: time,
          },
        }
      : skipToken
  ) as UseSuspenseQueryResult<AqiQueryResult>;

  if (weatherDataError) {
    console.error("weatherDataError: ", weatherDataError);
  } else {
    console.log("weatherData: ",weatherData);
  }

  const town = useMemo(() => {
    const { ctyName, townName, villageName } = weatherData!.aqi[0].town;
    return { ctyName, townName, villageName };
  }, [weatherData]);

  const { error: solarEventsDataError, data: solarEventsData } =
    useSuspenseQuery(
      GET_SOLAR_EVENTS,
      town
        ? {
            variables: {
              ctyName: town.ctyName,
              time: time,
            },
          }
        : skipToken
    ) as UseSuspenseQueryResult<ForecastQueryResult>;

  if (solarEventsDataError) {
    console.error("sunriseSunsetDataError: ", solarEventsDataError);
  } else {
    console.log("sunriseSunsetData: ", solarEventsData);
  }

  const solarEvents = solarEventsData!.forecast.Locations[0].sunRise;

  const solarEventsToDate = useMemo(() => {
    return {
      sunrise: new Date(
        `${solarEvents[0].Date}T${solarEvents[0].SunRiseTime}:00`
      ),
      sunset: new Date(
        `${solarEvents[0].Date}T${solarEvents[0].SunSetTime}:00`
      ),
      tomorrowSunrise: new Date(
        `${solarEvents[1].Date}T${solarEvents[1].SunRiseTime}:00`
      ),
      tomorrowSunset: new Date(
        `${solarEvents[1].Date}T${solarEvents[1].SunSetTime}:00`
      ),
    };
  }, [solarEvents]);

  function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const toRadians = (deg: number) => deg * (Math.PI / 180);

    const R = 6371; // km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function findClosestStation(
    stations: Station[],
    targetLat: number,
    targetLon: number
  ): Station | null {
    let closestStation: Station | null = null;
    let minDistance = Infinity;

    stations.forEach((station) => {
      const stationLat = parseFloat(
        station.GeoInfo.Coordinates[1].StationLatitude
      );
      const stationLon = parseFloat(
        station.GeoInfo.Coordinates[1].StationLongitude
      );
      const distance = haversineDistance(
        targetLat,
        targetLon,
        stationLat,
        stationLon
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    });

    return closestStation;
  }

  const secondaryStation = findClosestStation(
    weatherData!.aqi[0].town.station,
    userLocation.latitude,
    userLocation.longitude
  );

  const currentTemp = useMemo(() => {
    const stationTemp = Math.round(
      Number(weatherData!.aqi[0].station.WeatherElement.AirTemperature)
    );
    const secStationTemp = Math.round(
      Number(secondaryStation?.WeatherElement.AirTemperature)
    );
    return stationTemp === -99 ? Number(secStationTemp) : stationTemp;
  }, [weatherData, secondaryStation]);

  const value = useMemo(
    () => ({
      weatherData: weatherData!,
      town,
      currentTemp,
      secondaryStation,
      solarEventsToDate
    }),
    [weatherData, town, currentTemp, secondaryStation, solarEventsToDate]
  );

  return (
    <WeatherDataContext.Provider value={value}>
      {children}
    </WeatherDataContext.Provider>
  );
}

export function useWeatherData() {
  const ctx = useContext(WeatherDataContext);
  if (!ctx)
    throw new Error("useWeatherData must be used within a WeatherDataProvider");
  return ctx;
}

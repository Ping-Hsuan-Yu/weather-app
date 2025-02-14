"use client"

import {
  skipToken,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@apollo/client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AqiQueryResult,
  ForecastQueryResult,
  LocationName,
  Station,
} from "@/interface/interface";
import { GET_SUNRISESET, GET_WEATHER } from "@/graphql/queries";

type WeatherContextType = {
  weatherData: AqiQueryResult;
  town: LocationName;
  currentTemp: number;
  secondaryStation: Station | null;
  sunriseSunsetDate: {
    sunrise: Date;
    sunset: Date;
    tomorrowSunrise: Date;
    tomorrowSunset: Date;
  };
  isDarkMode: boolean;
  getUserPosition: () => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {

  const saveLocationToLocalStorage = useCallback((latitude: number, longitude: number) => {
    localStorage.setItem("userLocation", JSON.stringify({ latitude, longitude }));
  }, [])

  const getLocationFromLocalStorage = useCallback(() => {
    const data = localStorage.getItem("userLocation");
    return data ? JSON.parse(data) : null;
  }, []);

  const getUserPosition = useCallback(() => navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });
      saveLocationToLocalStorage(latitude, longitude);
    },
    (error) => {
      console.error("Error getting user location:", error);
    }
  ), [])

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>(getLocationFromLocalStorage() ?? { latitude: 24.169384, longitude: 120.658199 });
 
  const getUserLocation = () => {
    if (getLocationFromLocalStorage()) {
      setUserLocation(getLocationFromLocalStorage())
    } else {
      if (navigator.geolocation) {
        getUserPosition();
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  };

  useEffect(getUserLocation, []);

  console.log(userLocation);


  const now = new Date();
  const theDayAfterTomorrow = new Date();
  theDayAfterTomorrow.setDate(now.getDate() + 2);
  const time = theDayAfterTomorrow.toISOString().split("T")[0];

  const {
    error: weatherDataError,
    data: weatherData,
  }: UseSuspenseQueryResult<AqiQueryResult> = useSuspenseQuery(
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
  }

  const town = useMemo(() => {
    const { ctyName, townName, villageName } = weatherData.aqi[0].town;
    return { ctyName, townName, villageName };
  }, [weatherData]);

  const {
    error: sunriseSunsetDataError,
    data: sunriseSunsetData,
  }: UseSuspenseQueryResult<ForecastQueryResult> = useSuspenseQuery(
    GET_SUNRISESET,
    town
      ? {
        variables: {
          ctyName: town.ctyName,
          time: time,
        },
      }
      : skipToken
  ) as UseSuspenseQueryResult<ForecastQueryResult>;

  if (sunriseSunsetDataError) {
    console.error("sunriseSunsetDataError: ", sunriseSunsetDataError);
  }

  const sunriseSunset = sunriseSunsetData.forecast.Locations[0].sunRise;

  const sunriseSunsetDate = useMemo(() => {
    return {
      sunrise: new Date(
        `${sunriseSunset[0].Date}T${sunriseSunset[0].SunRiseTime}:00`
      ),
      sunset: new Date(
        `${sunriseSunset[0].Date}T${sunriseSunset[0].SunSetTime}:00`
      ),
      tomorrowSunrise: new Date(
        `${sunriseSunset[1].Date}T${sunriseSunset[1].SunRiseTime}:00`
      ),
      tomorrowSunset: new Date(
        `${sunriseSunset[1].Date}T${sunriseSunset[1].SunSetTime}:00`
      ),
    };
  }, [sunriseSunset]);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 檢查當前時間是否需要啟用 dark mode
    const checkDarkMode = () => {
      const now = new Date();
      // const now = new Date("2025-01-14T18:00:00+08:00");
      const currentTime = now.getHours() * 60 + now.getMinutes(); // 當前分鐘數

      // 計算日出與日落的分鐘數
      const [sunriseHour, sunriseMinute] =
        sunriseSunset[0].SunRiseTime.split(":").map(Number);
      const [sunsetHour, sunsetMinute] =
        sunriseSunset[0].SunSetTime.split(":").map(Number);
      const sunriseTime = sunriseHour * 60 + sunriseMinute;
      const sunsetTime = sunsetHour * 60 + sunsetMinute;

      // 如果不在日出到日落之間，啟用 dark mode
      const isDark = currentTime < sunriseTime || currentTime >= sunsetTime;
      setIsDarkMode(isDark);

      // 更新 HTML <html> 的 class
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // 初始檢查
    checkDarkMode();

    // 每分鐘檢查一次
    const interval = setInterval(checkDarkMode, 60000); // 每分鐘檢查一次
    return () => clearInterval(interval); // 清除 interval
  }, [sunriseSunset]);

  function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const toRadians = (deg: number) => deg * (Math.PI / 180);

    const R = 6371; // 地球半徑 (公里)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 兩點之間的距離 (公里)
  }

  function findClosestStation(
    stations: Station[],
    targetLat: number,
    targetLon: number
  ): Station | null {
    let closestStation = null;
    let minDistance = Infinity;

    stations.forEach((station) => {
      const stationLat = parseFloat(station.latitude);
      const stationLon = parseFloat(station.longitude);
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
    weatherData.aqi[0].town.station,
    userLocation.latitude,
    userLocation.longitude
  );

  const currentTemp = useMemo(() => {
    const stationTemp = Math.round(
      Number(
        weatherData.aqi[0].station.weatherElement.filter(
          (item) => item.elementName === "TEMP"
        )[0].elementValue
      )
    );
    const secStationTemp = Math.round(
      Number(
        secondaryStation?.weatherElement.filter(
          (item) => item.elementName === "TEMP"
        )[0].elementValue
      )
    );
    return stationTemp === -99 ? Number(secStationTemp) : stationTemp;
  }, [weatherData, secondaryStation]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        town,
        currentTemp,
        secondaryStation,
        sunriseSunsetDate,
        isDarkMode,
        getUserPosition
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
};

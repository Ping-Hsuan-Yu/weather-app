import {
  skipToken,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@apollo/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AqiQueryResult,
  ForecastQueryResult,
  TownDetails,
  TownQueryResult
} from "../interface";
import { GET_SUNRISESET, GET_WEATHER, GET_WEATHER_FORECAST } from "../query";

type WeatherContextType = {
  weatherData:AqiQueryResult
  weatherForecastData:TownQueryResult
  town: TownDetails;
  currentTemp: number;
  todayMinTemp: string;
  todayMaxTemp: string;
  apparentTemp: string;
  apparentTempCompare: string;
  aqiData: { data: string; status: string };
  relativeHumidity: string;
  sunriseSunsetData: ForecastQueryResult;
  sunriseSunsetDate: {
    sunrise: Date;
    sunset: Date;
    tomorrowSunrise: Date;
    tomorrowSunset: Date;
  };
  isDarkMode: boolean;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>({ latitude: 24.169384, longitude: 120.658199 });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(getUserLocation, []);

  
  const { data: weatherData }: UseSuspenseQueryResult<AqiQueryResult> =
   useSuspenseQuery(
      GET_WEATHER,
      userLocation
        ? {
            variables: {
              lon: userLocation?.longitude,
              lat: userLocation?.latitude,
            },
          }
        : skipToken
    ) as UseSuspenseQueryResult<AqiQueryResult>;

  const { data: weatherForecastData }: UseSuspenseQueryResult<TownQueryResult> =
    useSuspenseQuery(
      GET_WEATHER_FORECAST,
      userLocation
        ? {
            variables: {
              lon: userLocation?.longitude,
              lat: userLocation?.latitude,
            },
          }
        : skipToken
    ) as UseSuspenseQueryResult<TownQueryResult>;

  const town = useMemo(() => weatherData.aqi[0].town, [weatherData]);

  const now = new Date();
  const theDayAfterTomorrow = new Date();
  theDayAfterTomorrow.setDate(now.getDate() + 2);
  const time = theDayAfterTomorrow.toISOString().split("T")[0];

  const {
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

  const sunriseSunsetDate = useMemo(
    () => ({
      sunrise: new Date(
        `${sunriseSunsetData.forecast.Locations[0].sunRise[0].Date}T${sunriseSunsetData.forecast.Locations[0].sunRise[0].SunRiseTime}:00`
      ),
      sunset: new Date(
        `${sunriseSunsetData.forecast.Locations[0].sunRise[0].Date}T${sunriseSunsetData.forecast.Locations[0].sunRise[0].SunSetTime}:00`
      ),
      tomorrowSunrise: new Date(
        `${sunriseSunsetData.forecast.Locations[0].sunRise[1].Date}T${sunriseSunsetData.forecast.Locations[0].sunRise[1].SunRiseTime}:00`
      ),
      tomorrowSunset: new Date(
        `${sunriseSunsetData.forecast.Locations[0].sunRise[1].Date}T${sunriseSunsetData.forecast.Locations[0].sunRise[1].SunSetTime}:00`
      ),
    }),
    [sunriseSunsetData]
  );

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 檢查當前時間是否需要啟用 dark mode
    const checkDarkMode = () => {
      const now = new Date();
      // const now = new Date("2025-01-13T18:00:00+08:00");
      const currentTime = now.getHours() * 60 + now.getMinutes(); // 當前分鐘數

      // 計算日出與日落的分鐘數
      const [sunriseHour, sunriseMinute] =
        sunriseSunsetData.forecast.Locations[0].sunRise[0].SunRiseTime.split(
          ":"
        ).map(Number);
      const [sunsetHour, sunsetMinute] =
        sunriseSunsetData.forecast.Locations[0].sunRise[0].SunSetTime.split(
          ":"
        ).map(Number);
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
  }, []);

  const currentTemp = useMemo(
    () =>
      Math.round(
        Number(
          weatherData.aqi[0].station.weatherElement.filter(
            (item) => item.elementName === "TEMP"
          )[0].elementValue
        )
      ),
    [weatherData]
  );

  const todayMinTemp = useMemo(
    () =>
      weatherForecastData.town.forecastWeekday.MinTemperature.Time[0]
        .MinTemperature,
    [weatherForecastData]
  );

  const todayMaxTemp = useMemo(
    () =>
      weatherForecastData.town.forecastWeekday.MaxTemperature.Time[0]
        .MaxTemperature,
    [weatherForecastData]
  );

  const apparentTemp = useMemo(() => {
    const data = weatherForecastData.town.forecast72hr.ApparentTemperature.Time;
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
  }, [weatherForecastData]);

  const apparentTempCompare = useMemo(() => {
    if (Number(apparentTemp) > currentTemp) {
      return "text-red-600";
    } else if (Number(apparentTemp) < currentTemp) {
      return "text-sky-600";
    } else {
      return "";
    }
  }, [apparentTemp, currentTemp]);

  const aqiData = useMemo(
    () => ({ data: weatherData.aqi[0].aqi, status: weatherData.aqi[0].status }),
    [weatherData]
  );

  const relativeHumidity = useMemo(
    () =>
      weatherData.aqi[0].station.weatherElement.filter(
        (item) => item.elementName === "HUMD"
      )[0].elementValue,
    [weatherData]
  );


  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        weatherForecastData,
        town,
        currentTemp,
        todayMinTemp,
        todayMaxTemp,
        apparentTemp,
        apparentTempCompare,
        aqiData,
        relativeHumidity,
        sunriseSunsetData,
        sunriseSunsetDate,
        isDarkMode,
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

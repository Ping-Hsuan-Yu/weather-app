"use client"

import { ScrollArea } from "@radix-ui/themes";
import { useWeatherContext } from "@/context/WeatherContext";
import CodeToIcon from "./CodeToIcon";

export default function Forecast24hr() {
  const { weatherData, sunriseSunsetDate } = useWeatherContext();
  const temperatureData = weatherData.aqi[0].town.forecast72hr.Temperature.Time;
  const weatherData72 = weatherData.aqi[0].town.forecast72hr.Weather.Time;
  const pOPData =
    weatherData.aqi[0].town.forecast72hr.ProbabilityOfPrecipitation.Time;

  const concatData = temperatureData.map((temp) => {
    const targetTime = new Date(temp.DataTime);
    const targetWeather = weatherData72.find(
      (weather) =>
        new Date(weather.StartTime) <= targetTime &&
        targetTime <= new Date(weather.EndTime)
    );
    const targetPOP = pOPData.find(
      (pop) =>
        new Date(pop.StartTime) <= targetTime &&
        targetTime <= new Date(pop.EndTime)
    );
    const { DataTime, Temperature } = temp;
    const { Weather, WeatherCode } = targetWeather!;
    const { ProbabilityOfPrecipitation } = targetPOP!;
    return {
      DataTime: new Date(DataTime),
      Temperature,
      Weather,
      WeatherCode,
      ProbabilityOfPrecipitation,
      isDay:
        (sunriseSunsetDate.sunrise <= targetTime &&
          targetTime <= sunriseSunsetDate.sunset) ||
        (sunriseSunsetDate.tomorrowSunrise <= targetTime &&
          targetTime <= sunriseSunsetDate.tomorrowSunset),
    };
  });

  concatData.push({
    DataTime: sunriseSunsetDate.sunrise,
    Temperature: "日出",
    isDay: true,
    Weather: "日出",
    WeatherCode: "0",
    ProbabilityOfPrecipitation: "",
  });
  concatData.push({
    DataTime: sunriseSunsetDate.sunset,
    Temperature: "日落",
    isDay: false,
    Weather: "日落",
    WeatherCode: "0",
    ProbabilityOfPrecipitation: "",
  });
  concatData.push({
    DataTime: sunriseSunsetDate.tomorrowSunrise,
    Temperature: "日出",
    isDay: true,
    Weather: "日出",
    WeatherCode: "0",
    ProbabilityOfPrecipitation: "",
  });
  concatData.push({
    DataTime: sunriseSunsetDate.tomorrowSunset,
    Temperature: "日落",
    isDay: false,
    Weather: "日落",
    WeatherCode: "0",
    ProbabilityOfPrecipitation: "",
  });

  concatData.sort((a, b) => a.DataTime.getTime() - b.DataTime.getTime());

  const current = new Date();
  const filterData = concatData.filter((item) => {
    const now = new Date(current.setMinutes(0, 0, 0));
    const later = new Date(current.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    return item.DataTime >= now && item.DataTime <= later;
  });

  return (
    <ScrollArea className="mt-2 glass py-2 h-30">
      <table>
        <tbody>
          <tr className="text-center">
            {filterData.map((temp, idx) => (
              <td
                key={`${temp.DataTime}${idx}`}
                className="text-stone-500 dark:text-stone-400"
              >
                {Number.isNaN(Number(temp.Temperature)) ? (
                  `${temp.DataTime.getHours()}:${temp.DataTime.getMinutes()}`
                ) : temp.DataTime.getHours() === 0 ? (
                  <span className="text-sm border border-stone-400 rounded p-0.5">
                    明日
                  </span>
                ) : (
                  temp.DataTime.getHours()
                )}
              </td>
            ))}
          </tr>
          <tr className="text-center">
            {filterData.map((weather, idx) => (
              <td key={`${weather.Weather}${idx}`} className="px-4 py-2">
                <CodeToIcon
                  weather={weather.Weather}
                  weatherCode={weather.WeatherCode}
                  isDay={weather.isDay}
                  POP={weather.ProbabilityOfPrecipitation}
                />
              </td>
            ))}
          </tr>
          <tr className="text-center text-primary">
            {filterData.map((temp, idx) => (
              <td key={`${temp.Temperature}${idx}`}>
                {Number.isNaN(Number(temp.Temperature)) ? (
                  <span className="text-sm border border-stone-700 dark:border-stone-400 rounded p-0.5">
                    {temp.Temperature}
                  </span>
                ) : (
                  <span>
                    {temp.Temperature}
                    <sup>°</sup>
                  </span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </ScrollArea>
  );
}

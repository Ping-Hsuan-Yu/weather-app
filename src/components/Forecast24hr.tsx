import { ScrollArea } from "@radix-ui/themes";
import { useWeatherContext } from "../contexts/WeatherContext";
import CodeToIcon from "./CodeToIcon";


//TODO: 重新整理邏輯 先加入日出日落在進行資料篩選 溫度 天氣 降雨機率 合併？分散？
export default function Forecast24hr() {
  const { weatherData, sunriseSunsetDate } = useWeatherContext();
  const temperatureData = weatherData.aqi[0].town.forecast72hr.Temperature;
  const weatherData72 = weatherData.aqi[0].town.forecast72hr.Weather;
  const pOPData =
    weatherData.aqi[0].town.forecast72hr.ProbabilityOfPrecipitation;
  const current = new Date();
  
  // Filter temperature data
  const filteredTemperature = temperatureData.Time.filter((entry) => {
    const entryTime = new Date(entry.DataTime);
    entryTime.setMinutes(0, 0, 0);
    const now = new Date(current.setMinutes(0, 0, 0));
    const later = new Date(current.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    return entryTime >= now && entryTime <= later;
  });

  // Filter weather data
  const filteredWeather = weatherData72.Time.filter((entry) => {
    const startTime = new Date(entry.StartTime);
    const endTime = new Date(entry.EndTime);
    const now = new Date(filteredTemperature[0].DataTime);
    const later = new Date(
      filteredTemperature[filteredTemperature.length - 1].DataTime
    );

    return (
      (startTime >= now && startTime <= later) || // Check if StartTime is in range
      (endTime >= now && endTime <= later) || // Check if EndTime is in range
      (startTime <= now && endTime >= later) // Check if range overlaps
    );
  });

  const withSunriseSunset = filteredTemperature.map((item) => {
    const dateTime = new Date(item.DataTime);
    return {
      DateTime: dateTime,
      Temperature: item.Temperature,
      isDay:
        (sunriseSunsetDate.sunrise <= dateTime &&
          dateTime <= sunriseSunsetDate.sunset) ||
        (sunriseSunsetDate.tomorrowSunrise <= dateTime &&
          dateTime <= sunriseSunsetDate.tomorrowSunset),
    };
  });

  withSunriseSunset.push({
    DateTime: sunriseSunsetDate.sunrise,
    Temperature: "日出",
    isDay: true,
  });
  withSunriseSunset.push({
    DateTime: sunriseSunsetDate.sunset,
    Temperature: "日落",
    isDay: false,
  });
  withSunriseSunset.push({
    DateTime: sunriseSunsetDate.tomorrowSunrise,
    Temperature: "日出",
    isDay: true,
  });
  withSunriseSunset.push({
    DateTime: sunriseSunsetDate.tomorrowSunset,
    Temperature: "日落",
    isDay: false,
  });

  withSunriseSunset.sort((a, b) => a.DateTime.getTime() - b.DateTime.getTime());
  withSunriseSunset.pop();
  withSunriseSunset.shift();

  const weatherPerHour = withSunriseSunset.map((temp) => ({
    ...temp,
    ...(filteredWeather.find((weather) => {
      const startTime = new Date(weather.StartTime);
      const endTime = new Date(weather.EndTime);
      const target = new Date(temp.DateTime);
      return startTime <= target && target <= endTime;
    }) ?? {
      StartTime: "",
      EndTime: "",
      Weather: "",
      WeatherCode: "",
      DateTime: temp.DateTime,
      Temperature: temp.Temperature,
    }),
    POP: pOPData.Time.find((pop) => {
      const startTime = new Date(pop.StartTime);
      const endTime = new Date(pop.EndTime);
      const target = new Date(temp.DateTime);
      return startTime <= target && target <= endTime;
    })?.ProbabilityOfPrecipitation,
  }));

  console.log(withSunriseSunset)

  return (
    <ScrollArea className="mt-2 glass py-2 h-30">
      <table>
        <tbody>
          <tr className="text-center">
            {withSunriseSunset.map((temp, idx) => (
              <td
                key={`${temp.DateTime}${idx}`}
                className="text-stone-500 dark:text-stone-400"
              >
                {idx == 0 && !Number.isNaN(Number(temp.Temperature)) ? (
                  <span className="text-sm">現在</span>
                ) : Number.isNaN(Number(temp.Temperature)) ? (
                  `${temp.DateTime.getHours()}:${temp.DateTime.getMinutes()}`
                ) : temp.DateTime.getHours() === 0 ? (
                  <span className="text-sm border border-stone-400 rounded p-0.5">
                    明日
                  </span>
                ) : (
                  temp.DateTime.getHours()
                )}
              </td>
            ))}
          </tr>
          <tr className="text-center">
            {weatherPerHour.map((weather, idx) => (
              <td key={`${weather.Weather}${idx}`} className="px-4 py-2">
                <CodeToIcon
                  weather={weather.Weather}
                  weatherCode={weather.WeatherCode}
                  sunriseOrSunset={weather.Temperature}
                  isSunRiseSet={Number.isNaN(Number(weather.Temperature))}
                  isDay={weather.isDay}
                  POP={weather.POP}
                />
              </td>
            ))}
          </tr>
          <tr className="text-center text-primary">
            {withSunriseSunset.map((temp, idx) => (
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

import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useWeatherContext } from "../contexts/WeatherContext";
import CodeToIcon from "./CodeToIcon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels
);

export default function ForecastWeekday() {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const labels = useMemo(() => {
    const today = new Date();
    const initialLabels = ["昨", "今", "明"];
    for (let index = 2; index <= 5; index++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + index);
      initialLabels.push(weekdays[futureDate.getDay()]);
    }
    return initialLabels;
  }, [weekdays]);

  const weekDate = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + index);
      return futureDate.getDate();
    });
  }, []);

  const { isDarkMode, weatherForecastData } = useWeatherContext();
  const maxTemperatureData =
    weatherForecastData.town.forecastWeekday.MaxTemperature.Time;
  console.log(weatherForecastData.town.forecastWeekday.Weather.Time);
  const maxTemperature = Object.values(
    maxTemperatureData.reduce(
      (
        acc: Record<
          string,
          {
            DateTime: string;
            MaxTemperature: string;
          }
        >,
        item
      ) => {
        const date = item.StartTime.split("T")[0];
        const temperature = parseInt(item.MaxTemperature, 10);
        if (
          !acc[date] ||
          temperature > parseInt(acc[date].MaxTemperature, 10)
        ) {
          acc[date] = {
            DateTime: item.StartTime,
            MaxTemperature: temperature.toString(),
          };
        }
        return acc;
      },
      {}
    )
  );

  const minTemperatureData =
    weatherForecastData.town.forecastWeekday.MinTemperature.Time;

  const minTemperature = Object.values(
    minTemperatureData.reduce(
      (
        acc: Record<
          string,
          {
            DateTime: string;
            MinTemperature: string;
          }
        >,
        item
      ) => {
        const date = item.StartTime.split("T")[0];
        const temperature = parseInt(item.MinTemperature, 10);
        if (
          !acc[date] ||
          temperature < parseInt(acc[date].MinTemperature, 10)
        ) {
          acc[date] = {
            DateTime: item.StartTime,
            MinTemperature: temperature.toString(),
          };
        }
        return acc;
      },
      {}
    )
  );

  return (
    <div className="glass mt-2 px-2 py-4">
      <div className="flex justify-between items-baseline px-4 mb-2">
        {labels.map((day, index) => (
          <div key={day} className="text-center">
            <div
              className={
                index == 0
                  ? "text-stone-400"
                  : "text-stone-900 dark:text-stone-50"
              }
            >
              {day}
            </div>
            <div className={
                index == 0
                  ? "text-stone-400 text-sm"
                  : "text-stone-500 dark:text-stone-200 text-sm"
              }>
              {weekDate[index]}
              <span className="text-xs">日</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center px-4 mb-2">
        <div className="w-6 h-6 flex justify-center items-center text-sm glass text-stone-400">早</div>
        {weatherForecastData.town.forecastWeekday.Weather.Time.map(
          (time, index) =>
            index !== 0 &&
            index % 2 === 0 && (
              <CodeToIcon
                key={time.StartTime}
                weather={time.Weather}
                weatherCode={time.WeatherCode}
                isDay
              />
            )
        )}
      </div>
      <Line
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: false,
            },
            datalabels: {
              display: true,
              color: isDarkMode ? "#fafaf9" : "#1c1917",
              font: {
                family: "Barlow",
                size: 14,
              },
              formatter: (value) => `${value}°`,
            },
          },
          layout: {
            padding: {
              top: 30,
              right: 28,
              bottom: 24,
              left: 28,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              data: maxTemperature.map((max) => max.MaxTemperature),
              borderColor: "#ea580c",
              backgroundColor: "#ea580c",
              tension: 0.4,
              datalabels: {
                align: "top",
              },
            },
            {
              data: minTemperature.map((min) => min.MinTemperature),
              borderColor: "#0284c7",
              backgroundColor: "#0284c7",
              tension: 0.4,
              datalabels: {
                align: "bottom",
              },
            },
          ],
        }}
      />
      <div className="flex justify-between items-center px-4 mt-3 mb-1">
        <div className="w-6 h-6 flex justify-center items-center text-sm glass text-stone-400">晚</div>
        {weatherForecastData.town.forecastWeekday.Weather.Time.map(
          (time, index) =>
            index !== 1 &&
            index % 2 === 1 && (
              <CodeToIcon
                key={time.StartTime}
                weather={time.Weather}
                weatherCode={time.WeatherCode}
                isDay={false}
              />
            )
        )}
      </div>
    </div>
  );
}

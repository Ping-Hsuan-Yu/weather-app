import SunriseSvg from "../assets/svg-static/sunrise.svg";
import SunsetSvg from "../assets/svg-static/sunset.svg";

export default function CodeToIcon({
  weather,
  weatherCode,
  isDay,
  POP
}: {
  weather: string;
  weatherCode: string;
  isDay: boolean;
  POP?:string;
}) {
  const code = Number(weatherCode);
  const isRain = (8 <= code && code <= 23) || (29 <= code && code <= 42);
  return (
    <div className="w-6 h-10 flex justify-center flex-col">
      {code === 0 ? (
        weather === "日出" ? (
          <img src={SunriseSvg} alt="日出" className="w-full" />
        ) : (
          <img src={SunsetSvg} alt="日落" className="w-full" />
        )
      ) : (
        <>
          <img
            src={`https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${
              isDay ? "day" : "night"
            }/${weatherCode}.svg`}
            alt={weather}
            title={weather}
            className="w-full"
          />
          {isRain && (
            <div className="mt-1 text-xs font-semibold text-sky-600 dark:text-sky-500">
              {POP}%
            </div>
          )}
        </>
      )}
    </div>
  );
}

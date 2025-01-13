import SunriseSvg from "../assets/svg-static/sunrise.svg";
import SunsetSvg from "../assets/svg-static/sunset.svg";

export default function CodeToIcon({
  weather,
  weatherCode,
  sunriseOrSunset,
  isSunRiseSet,
  isDay,
}: {
  weather: string;
  weatherCode: string;
  sunriseOrSunset?: string;
  isSunRiseSet?: boolean;
  isDay: boolean;
}) {
  return (
    <div className="w-6">
      {isSunRiseSet ? (
        sunriseOrSunset === "日出" ? (
          <img src={SunriseSvg} alt="日出" className="w-full" />
        ) : (
          <img src={SunsetSvg} alt="日落" className="w-full" />
        )
      ) : (
        <img
          src={`https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${
            isDay ? "day" : "night"
          }/${weatherCode}.svg`}
          alt={weather}
          title={weather}
          className="w-full"
        />
      )}
    </div>
  );
}

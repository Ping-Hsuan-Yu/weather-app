"use client";

import SunriseSvg from "@/assets/svg-static/sunrise.svg";
import SunsetSvg from "@/assets/svg-static/sunset.svg";
import Image from "next/image";

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
          <Image src={SunriseSvg} alt="日出" className="w-full" />
        ) : (
          <Image src={SunsetSvg} alt="日落" className="w-full" />
        )
      ) : (
        <>
          <Image
            src={`https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${
              isDay ? "day" : "night"
            }/${weatherCode}.svg`}
            alt={weather}
            title={weather}
            className="w-full"
            width={24}
            height={24}
          />
          {isRain && POP != "-" && (
            <div className="mt-1 text-xs font-semibold text-sky-600 dark:text-sky-500">
              {POP}%
            </div>
          )}
        </>
      )}
    </div>
  );
}

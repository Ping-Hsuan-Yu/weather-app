"use client";

import ApparentTemp from "@/components/ApparentTemp";
import Aqi from "@/components/Aqi";
import CurrentTemp from "@/components/CurrentTemp";
import Forecast24hr from "@/components/Forecast24hr";
import ForecastWeekday from "@/components/ForecastWeekday";
import Location from "@/components/Location";
import MinMaxTemp from "@/components/MinMaxTemp";
import RelativeHumidity from "@/components/RelativeHumidity";
import ShaderGradientBG from "@/components/ShaderGradientBG";
import Uvi from "@/components/Uvi";

import { LocationProvider } from "@/context/LocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WeatherDataProvider } from "@/context/WeatherDataContext";

import client from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";

export default function HomePage() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <LocationProvider>
          <WeatherDataProvider>
            <div className="flex w-dvw min-h-dvh bg-slate-50 dark:bg-slate-800 relative">
              <ShaderGradientBG />
              <div className="m-auto w-full max-w-lg p-4 relative">
                <Location />
                <div className="flex flex-col items-center gap-1 py-2">
                  <MinMaxTemp />
                  <CurrentTemp />
                  <ApparentTemp />
                </div>
                <div className="flex gap-2 mt-2">
                  <RelativeHumidity />
                  <Aqi />
                  <Uvi />
                </div>
                <Forecast24hr />
                <ForecastWeekday />
              </div>
            </div>
          </WeatherDataProvider>
        </LocationProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

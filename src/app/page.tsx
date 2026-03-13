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

import { LocationProvider, useLocation } from "@/context/LocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WeatherDataProvider } from "@/context/WeatherDataContext";

import client from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";

function WeatherSkeleton() {
  return (
    <div className="m-auto w-full max-w-lg p-4 relative animate-pulse">
      {/* Temp area */}
      <div className="flex py-2">
        <div className="h-56 flex-1 bg-white/10 rounded-xl" />
      </div>
      {/* 3 metric cards */}
      <div className="flex gap-2 mt-2">
        <div className="h-24 flex-1 bg-white/10 rounded-xl" />
        <div className="h-24 flex-1 bg-white/10 rounded-xl" />
        <div className="h-24 flex-1 bg-white/10 rounded-xl" />
      </div>
      {/* Forecast rows */}
      <div className="h-36 mt-4 bg-white/10 rounded-xl" />
      <div className="h-64 mt-4 bg-white/10 rounded-xl" />
    </div>
  );
}

function WeatherContent() {
  const { isReady } = useLocation();

  if (!isReady) {
    return <WeatherSkeleton />;
  }

  return (
    <WeatherDataProvider>
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
    </WeatherDataProvider>
  );
}

export default function HomePage() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <LocationProvider>
          <div className="flex min-h-dvh bg-slate-50 dark:bg-slate-800 relative">
            <ShaderGradientBG />
            <WeatherContent />
          </div>
        </LocationProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

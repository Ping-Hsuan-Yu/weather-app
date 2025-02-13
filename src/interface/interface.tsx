export interface WeatherTime {
  StartTime: string;
  Weather: string;
  WeatherCode: string;
}

export interface UVITime {
  StartTime: string;
  UVIndex: string;
  UVExposureLevel: string;
}

export interface PoP12hTime {
  StartTime: string;
  ProbabilityOfPrecipitation: string;
}

export interface MinTemperatureTime {
  StartTime: string;
  MinTemperature: string;
}

export interface MaxTemperatureTime {
  StartTime: string;
  MaxTemperature: string;
}

export interface LocationWeekday {
  MinTemperature: {
    Time: MinTemperatureTime[];
  };
  MaxTemperature: {
    Time: MaxTemperatureTime[];
  };
  ProbabilityOfPrecipitation: {
    Time: PoP12hTime[];
  };
  UVIndex: {
    Time: UVITime[];
  };
  Weather: {
    Time: WeatherTime[];
  };
}

export interface Weather {
  StartTime: string;
  EndTime: string;
  Weather: string;
  WeatherCode: string;
}

export interface Temperature {
  DataTime: string;
  Temperature: string;
}

export interface ProbabilityOfPrecipitation {
  StartTime: string;
  EndTime: string;
  ProbabilityOfPrecipitation: string;
}

export interface ApparentTemperature {
  DataTime: string;
  ApparentTemperature: string;
}

export interface Location72hr {
  ApparentTemperature: {
    Time: ApparentTemperature[];
  };
  ProbabilityOfPrecipitation: {
    Time: ProbabilityOfPrecipitation[];
  };
  Temperature: {
    Time: Temperature[];
  };
  Weather: {
    Time: Weather[];
  };
}

export interface TownVillageItem {
  ctyName: string;
  townName: string;
  villageName:string;
  forecast72hr: Location72hr;
  forecastWeekday: LocationWeekday;
  station: Station[];
}

export interface WeatherElement {
  elementName: string;
  elementValue: string;
}

export interface Station {
  latitude:string;
  longitude:string;
  weatherElement: WeatherElement[];
}

export interface AQI {
  aqi: string;
  status: string;
  station: Station;
  town: TownVillageItem;
}

export interface AqiQueryResult {
  aqi: AQI[];
}

export interface SunRiseTime {
  Date: string;
  BeginCivilTwilightTime: string;
  SunRiseTime: string;
  SunSetTime: string;
  EndCivilTwilightTime: string;
}

export interface Location {
  sunRise: SunRiseTime[];
}

export interface Forecast {
  Locations: Location[];
}

export interface ForecastQueryResult {
  forecast: Forecast;
}

export interface LocationName {
  ctyName: string;
  townName: string;
  villageName:string;
}

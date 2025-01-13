export interface ApparentTemperatureTime {
  DataTime: string;
  ApparentTemperature: string;
}

export interface ApparentTemperature {
  ElementName: string;
  Time: ApparentTemperatureTime[];
}

export interface WeatherTime {
  ElementName: string;
  Time: {
    StartTime: string;
    Weather: string;
    WeatherCode: string;
  }[];
}

export interface MinTemperatureTime {
  StartTime: string;
  EndTime: string;
  MinTemperature: string;
}

export interface MaxTemperatureTime {
  StartTime: string;
  EndTime: string;
  MaxTemperature: string;
}

export interface ForecastWeekday {
  Weather: WeatherTime;
  MinTemperature: {
    ElementName: string;
    Time: MinTemperatureTime[];
  };
  MaxTemperature: {
    ElementName: string;
    Time: MaxTemperatureTime[];
  };
}

export interface ProbabilityOfPrecipitation {
  ElementName: string;
  Time: {
    StartTime: string;
    EndTime: string;
    ProbabilityOfPrecipitation: string;
  }[];
}

export interface Temperature {
  ElementName: string;
  Time: {
    DataTime: string;
    Temperature: string;
  }[];
}

export interface Weather {
  ElementName: string;
  Time: {
    StartTime: string;
    EndTime: string;
    Weather: string;
    WeatherCode: string;
  }[];
}

export interface Forecast72hr {
  ProbabilityOfPrecipitation: ProbabilityOfPrecipitation;
  Temperature: Temperature;
  Weather: Weather;
  ApparentTemperature: ApparentTemperature;
}

export interface Town {
  forecastWeekday: ForecastWeekday;
  forecast72hr: Forecast72hr;
}

export interface TownQueryResult {
  town: Town;
}

export interface WeatherElement {
  elementName: string;
  elementValue: string;
}

export interface Station {
  weatherElement: WeatherElement[];
}

export interface TownDetails {
  ctyName: string;
  townName: string;
}

export interface AQI {
  aqi: string;
  status: string;
  station: Station;
  town: TownDetails;
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

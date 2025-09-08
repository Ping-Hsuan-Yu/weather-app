import { gql } from "@apollo/client";

export const GET_WEATHER = gql`
  query Aqi($lon: Float, $lat: Float) {
    aqi(longitude: $lon, latitude: $lat) {
      aqi
      status
      station {
        GeoInfo {
          Coordinates {
            StationLatitude
            StationLongitude
          }
        }
        WeatherElement {
          Weather
          Now {
            Precipitation
          }
          AirTemperature
          RelativeHumidity
          DailyExtreme {
            DailyHigh {
              TemperatureInfo {
                AirTemperature
              }
            }
            DailyLow {
              TemperatureInfo {
                AirTemperature
              }
            }
          }
        }
      }
      town {
        ctyName
        townName
        villageName
        forecast72hr {
          ApparentTemperature {
            Time(first: 12) {
              ApparentTemperature
            }
          }
          ProbabilityOfPrecipitation {
            Time(first: 12) {
              StartTime
              EndTime
              ProbabilityOfPrecipitation
            }
          }
          Temperature {
            Time(first: 30) {
              DataTime
              Temperature
            }
          }
          Weather {
            Time(first: 12) {
              StartTime
              EndTime
              Weather
              WeatherCode
            }
          }
        }
        forecastWeekday {
          MinTemperature {
            Time {
              StartTime
              MinTemperature
            }
          }
          MaxTemperature {
            Time {
              StartTime
              MaxTemperature
            }
          }
          ProbabilityOfPrecipitation {
            Time {
              StartTime
              ProbabilityOfPrecipitation
            }
          }
          UVIndex {
            Time(first: 1) {
              StartTime
              UVIndex
              UVExposureLevel
            }
          }
          Weather {
            Time {
              StartTime
              Weather
              WeatherCode
            }
          }
        }
        station {
          GeoInfo {
            Coordinates {
              StationLatitude
              StationLongitude
            }
          }
          WeatherElement {
            Weather
            Now {
              Precipitation
            }
            AirTemperature
            RelativeHumidity
            DailyExtreme {
              DailyHigh {
                TemperatureInfo {
                  AirTemperature
                }
              }
              DailyLow {
                TemperatureInfo {
                  AirTemperature
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SOLAR_EVENTS = gql`
  query Forecast($ctyName: String, $time: String) {
    forecast(LocationName: $ctyName) {
      Locations {
        sunRise(timeTo: $time) {
          Date
          BeginCivilTwilightTime
          SunRiseTime
          SunSetTime
          EndCivilTwilightTime
        }
      }
    }
  }
`;

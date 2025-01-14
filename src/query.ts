import { gql } from "@apollo/client";

export const GET_WEATHER_FORECAST = gql`
  query Town($lon: Float, $lat: Float) {
    town(Longitude: $lon, Latitude: $lat) {
      forecastWeekday {
        Weather {
          ElementName
          Time {
            StartTime
            Weather
            WeatherCode
          }
        }
        MinTemperature {
          ElementName
          Time {
            StartTime
            MinTemperature
          }
        }
        MaxTemperature {
          ElementName
          Time {
            StartTime
            MaxTemperature
          }
        }
        ProbabilityOfPrecipitation {
          ElementName
          Time {
            StartTime
            ProbabilityOfPrecipitation
          }
        }
      }
      forecast72hr {
        ProbabilityOfPrecipitation {
          ElementName
          Time {
            StartTime
            EndTime
            ProbabilityOfPrecipitation
          }
        }
        Temperature {
          ElementName
          Time(first: 24) {
            DataTime
            Temperature
          }
        }
        ApparentTemperature {
          ElementName
          Time(first: 12) {
            DataTime
            ApparentTemperature
          }
        }
        Weather {
          ElementName
          Time(first: 12) {
            StartTime
            EndTime
            Weather
            WeatherCode
          }
        }
      }
    }
  }
`;

export const GET_WEATHER = gql`
  query Aqi($lon: Float, $lat: Float) {
    aqi(longitude: $lon, latitude: $lat) {
      town {
        ctyName
        townName
      }
      aqi
      status
      station {
        weatherElement {
          elementName
          elementValue
        }
      }
    }
  }
`;

export const GET_SUNRISESET = gql`
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

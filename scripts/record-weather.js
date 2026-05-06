// 每 5 分鐘抓一次 CWA 資料，連續 72 小時，存到 recordings/。
// 查詢內容刻意與 src/graphql/queries.ts 保持一致 — 改動 queries 時請同步更新本檔。
//
// 執行：node scripts/record-weather.js
// 中止：Ctrl+C（已抓到的檔案不會遺失）

const fs = require("fs");
const path = require("path");
const { GraphQLClient, gql } = require("graphql-request");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "recordings");
const ENV_FILE = path.join(ROOT, ".env.local");

const LOCATION = { latitude: 24.169384, longitude: 120.658199 }; // 台中
const INTERVAL_MS = 5 * 60 * 1000;
const DURATION_MS = 72 * 60 * 60 * 1000;

function loadEnvFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  const content = fs.readFileSync(filepath, "utf8");
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(ENV_FILE);

const ENDPOINT = process.env.CWA_GRAPHQL_ENDPOINT;
const AUTH = process.env.CWA_KEY;
if (!ENDPOINT || !AUTH) {
  console.error("[fatal] 找不到 CWA_GRAPHQL_ENDPOINT 或 CWA_KEY (請檢查 .env.local)");
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const client = new GraphQLClient(ENDPOINT, {
  headers: {
    Authorization: AUTH,
    "Content-Type": "application/json",
  },
});

const GET_WEATHER = gql`
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

const GET_SOLAR_EVENTS = gql`
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

function fileSafeTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function logError(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(path.join(OUTPUT_DIR, "errors.log"), line);
  console.error(line.trimEnd());
}

async function snapshot() {
  const ts = fileSafeTimestamp();
  console.log(`[${ts}] fetching...`);

  let weatherData;
  try {
    weatherData = await client.request(GET_WEATHER, {
      lon: LOCATION.longitude,
      lat: LOCATION.latitude,
    });
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${ts}_weather.json`),
      JSON.stringify(weatherData, null, 2)
    );
  } catch (err) {
    logError(`[${ts}] weather fetch failed: ${err.message}`);
    return;
  }

  const ctyName = weatherData?.aqi?.[0]?.town?.ctyName;
  if (!ctyName) {
    logError(`[${ts}] weather response missing ctyName, skip solar fetch`);
    return;
  }

  try {
    const dayAfterTomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const solarData = await client.request(GET_SOLAR_EVENTS, {
      ctyName,
      time: dayAfterTomorrow,
    });
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${ts}_solar.json`),
      JSON.stringify(solarData, null, 2)
    );
  } catch (err) {
    logError(`[${ts}] solar fetch failed: ${err.message}`);
  }
}

const startedAt = Date.now();
const totalSnapshots = Math.floor(DURATION_MS / INTERVAL_MS) + 1;
console.log(`Output dir : ${OUTPUT_DIR}`);
console.log(`Location   : ${LOCATION.latitude}, ${LOCATION.longitude}`);
console.log(`Schedule   : 每 5 分鐘 1 次, 共 72 小時 (~${totalSnapshots} 筆)`);
console.log(`Started at : ${new Date(startedAt).toISOString()}\n`);

snapshot();
const interval = setInterval(snapshot, INTERVAL_MS);
setTimeout(() => {
  clearInterval(interval);
  console.log("\n72 小時完成，結束。");
  process.exit(0);
}, DURATION_MS);

process.on("SIGINT", () => {
  clearInterval(interval);
  console.log("\n收到 SIGINT，結束。");
  process.exit(0);
});

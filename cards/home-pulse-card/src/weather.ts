// Pure logic for the weather's "today" range. No DOM; tested in test/weather.test.mjs.
import type { HassEntity } from "./types";

export type ForecastType = "daily" | "twice_daily" | "hourly";

/** One forecast entry as Home Assistant sends it (`weather/subscribe_forecast`). */
export interface ForecastItem {
  datetime: string;
  temperature?: number;
  templow?: number;
  is_daytime?: boolean;
  [key: string]: unknown;
}

/** WeatherEntityFeature bits. */
const FEATURE: Record<ForecastType, number> = { daily: 1, hourly: 2, twice_daily: 4 };

/** The forecast to ask for: daily if the entity has one, else twice-daily, else hourly. */
export function forecastType(s?: HassEntity): ForecastType | undefined {
  const features = Number(s?.attributes.supported_features ?? 0);
  return (["daily", "twice_daily", "hourly"] as const).find((t) => (features & FEATURE[t]) !== 0);
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export interface TempRange {
  high: number;
  low?: number;
}

/**
 * Today's high and low, rounded. Daily: today's entry (or the first one, which some providers date at
 * midnight UTC). Twice-daily: the max and min of today's halves. Hourly: the rest of today, needs a few
 * hours to mean anything. Undefined when the forecast doesn't say.
 */
export function todayRange(items: ForecastItem[] | undefined, type: ForecastType, now = new Date()): TempRange | undefined {
  if (!Array.isArray(items) || !items.length) return undefined;
  const dated = items
    .map((i) => ({ i, d: new Date(i.datetime) }))
    .filter(({ i, d }) => typeof i.temperature === "number" && !Number.isNaN(d.getTime()));
  const today = dated.filter(({ d }) => sameDay(d, now)).map(({ i }) => i);
  let picked: ForecastItem[];
  if (type === "daily") picked = today.length ? [today[0]] : dated.length ? [dated[0].i] : [];
  else if (type === "twice_daily") picked = today;
  else picked = today.length >= 3 ? today : [];
  if (!picked.length) return undefined;
  const temps = picked.map((i) => i.temperature as number);
  const lows = picked.map((i) => (typeof i.templow === "number" ? i.templow : type === "daily" ? undefined : i.temperature));
  const knownLows = lows.filter((t): t is number => typeof t === "number");
  const high = Math.round(Math.max(...temps));
  const low = knownLows.length ? Math.round(Math.min(...knownLows)) : undefined;
  return low !== undefined && low < high ? { high, low } : { high };
}

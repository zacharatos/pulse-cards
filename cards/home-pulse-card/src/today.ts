// Pure logic for the "Today" line: today's and tomorrow's calendar events and dated sensors.
import type { HassEntity, HomeAssistant, HomePulseCardConfig, TodayConfig } from "./types";

export interface TodayItem {
  entity: string;
  title: string;
  /** 0 = today, 1 = tomorrow, undefined = a text sensor shown as it is. */
  day?: 0 | 1;
  /** Local start time ("17:30" formatting happens in the card), when the item has one. */
  start?: Date;
  /** Ongoing calendar event: its end time. */
  until?: Date;
  allDay: boolean;
  /** "Recycling tomorrow" style: the sensor names a thing, the day is appended. */
  dated: boolean;
}

const domainOf = (id: string) => id.split(".")[0];
const EMPTY = new Set(["", "unknown", "unavailable", "none", "off", "0"]);

/** `today` config as an object, or undefined when the line is turned off. */
export function todayConfig(config: HomePulseCardConfig): TodayConfig | undefined {
  if (config.today === false) return undefined;
  return config.today === true || config.today === undefined ? {} : config.today;
}

/** Calendars to read: configured, or every visible calendar. */
export function todayCalendars(hass: HomeAssistant, config: HomePulseCardConfig): string[] {
  const t = todayConfig(config);
  if (!t) return [];
  if (t.calendars?.length) return t.calendars;
  return Object.keys(hass.states)
    .filter((id) => domainOf(id) === "calendar" && !hass.entities?.[id]?.hidden)
    .sort();
}

export function todayEntities(config: HomePulseCardConfig): { entity: string; name?: string }[] {
  const t = todayConfig(config);
  return (t?.entities ?? []).map((e) => (typeof e === "string" ? { entity: e } : e));
}

/** "2026-10-05 17:30:00" (calendar attributes are local time) or an ISO string. */
export function parseLocal(s: unknown): Date | undefined {
  if (typeof s !== "string" || !s) return undefined;
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T00:00:00` : s.replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Whole local days from `now` to `d` (0 = same day). */
export function dayDiff(now: Date, d: Date): number {
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((b - a) / 86_400_000);
}

const asDay = (n: number, tomorrow: boolean): 0 | 1 | undefined => (n === 0 ? 0 : n === 1 && tomorrow ? 1 : undefined);

function calendarItem(s: HassEntity, now: Date, tomorrow: boolean): TodayItem | undefined {
  const title = String(s.attributes.message ?? "").trim();
  const start = parseLocal(s.attributes.start_time);
  if (!title || !start) return undefined;
  const allDay = !!s.attributes.all_day;
  const end = parseLocal(s.attributes.end_time);
  if (s.state === "on") {
    // Running now. A timed event shows "until 18:00"; an all-day one is just today's title.
    return { entity: s.entity_id, title, day: 0, until: allDay ? undefined : end, allDay, dated: false };
  }
  if (end && end.getTime() <= now.getTime()) return undefined;
  const day = asDay(dayDiff(now, start), tomorrow);
  if (day === undefined) return undefined;
  return { entity: s.entity_id, title, day, start: allDay ? undefined : start, allDay, dated: false };
}

const DAY_UNITS = new Set(["d", "day", "days", "ημέρες", "μέρες"]);

function sensorItem(s: HassEntity, name: string | undefined, now: Date, tomorrow: boolean): TodayItem | undefined {
  const label = name ?? String(s.attributes.friendly_name ?? s.entity_id);
  const at = (day: number, start?: Date): TodayItem | undefined => {
    const d = asDay(day, tomorrow);
    return d === undefined ? undefined : { entity: s.entity_id, title: label, day: d, start, allDay: !start, dated: true };
  };
  // waste_collection_schedule and similar expose "days until" as an attribute.
  const daysTo = s.attributes.daysTo ?? s.attributes.days_to;
  if (typeof daysTo === "number") return at(daysTo);
  const cls = s.attributes.device_class;
  if (cls === "date") {
    const d = parseLocal(s.state);
    return d ? at(dayDiff(now, d)) : undefined;
  }
  if (cls === "timestamp") {
    const d = parseLocal(s.state);
    if (!d || d.getTime() < now.getTime()) return undefined;
    return at(dayDiff(now, d), d);
  }
  if (DAY_UNITS.has(String(s.attributes.unit_of_measurement ?? "").toLowerCase()) && !Number.isNaN(Number(s.state)))
    return at(Number(s.state));
  // Anything else is a text sensor (e.g. a template): shown as it is, hidden when empty.
  if (EMPTY.has(s.state.trim().toLowerCase())) return undefined;
  return { entity: s.entity_id, title: name ? `${name}: ${s.state}` : s.state, allDay: true, dated: false };
}

/** `calendars` lets the card pass its cached list instead of scanning `hass.states` on every render. */
export function todayItems(
  hass: HomeAssistant,
  config: HomePulseCardConfig,
  now: Date,
  calendars: string[] = todayCalendars(hass, config)
): TodayItem[] {
  const t = todayConfig(config);
  if (!t) return [];
  const tomorrow = t.tomorrow !== false;
  const items: TodayItem[] = [];
  for (const id of calendars) {
    const s = hass.states[id];
    const item = s && calendarItem(s, now, tomorrow);
    if (item) items.push(item);
  }
  for (const { entity, name } of todayEntities(config)) {
    const s = hass.states[entity];
    const item = s && sensorItem(s, name, now, tomorrow);
    if (item) items.push(item);
  }
  // Running now, then today by time (all-day first), then tomorrow; text sensors last.
  const rank = (i: TodayItem) =>
    i.until ? 0 : i.day === 0 ? 1 : i.day === 1 ? 2 : 3;
  return items.sort(
    (a, b) => rank(a) - rank(b) || (a.start?.getTime() ?? 0) - (b.start?.getTime() ?? 0)
  );
}

/** One item as text. `t` translates (`today`, `tomorrow`, `until`), `time` formats a Date as "17:30". */
export function formatTodayItem(
  i: TodayItem,
  t: (key: string, vars?: Record<string, string | number>) => string,
  time: (d: Date) => string
): string {
  if (i.until) return `${i.title} ${t("today_until", { time: time(i.until) })}`;
  const parts = [i.title];
  if (i.day === 1) parts.push(t("today_tomorrow"));
  else if (i.day === 0 && i.dated) parts.push(t("today_today"));
  if (i.start) parts.push(time(i.start));
  return parts.join(" ");
}

export function todayWatched(hass: HomeAssistant, config: HomePulseCardConfig): string[] {
  return [...todayCalendars(hass, config), ...todayEntities(config).map((e) => e.entity)];
}

import { REPORT_TIMEZONE } from './report.const.ts';

export type WeekRange = {
  startAt: number;
  endAt: number;
  startDateIso: string;
  endDateIso: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;
const MONDAY_ISO_INDEX = 1;
const WEEKDAY_SHORT_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function parisWallClockAsUtcMs(utcMs: number): number {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIMEZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(utcMs)).map((part) => [part.type, part.value])
  );
  return Date.parse(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`
  );
}

// Une seule itération suffit : les bascules été/hiver ont lieu à 2h-3h du matin, jamais à minuit.
function parisMidnightUtcMs(dateIso: string): number {
  const naiveMs = Date.parse(`${dateIso}T00:00:00Z`);
  const offsetMs = parisWallClockAsUtcMs(naiveMs) - naiveMs;
  return naiveMs - offsetMs;
}

function parisDateIso(utcMs: number): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(utcMs));
}

function parisIsoWeekday(utcMs: number): number {
  const shortName = new Intl.DateTimeFormat('en-US', {
    timeZone: REPORT_TIMEZONE,
    weekday: 'short',
  }).format(new Date(utcMs));
  return WEEKDAY_SHORT_NAMES.indexOf(shortName as (typeof WEEKDAY_SHORT_NAMES)[number]) + 1;
}

function addDaysIso(dateIso: string, days: number): string {
  return new Date(Date.parse(`${dateIso}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

// Dernière semaine complète en heure de Paris : lundi 00:00:00.000 → dimanche 23:59:59.999.
export function previousWeekRange(nowMs: number): WeekRange {
  const todayIso = parisDateIso(nowMs);
  const mondayThisWeekIso = addDaysIso(todayIso, -(parisIsoWeekday(nowMs) - MONDAY_ISO_INDEX));
  const mondayPrevWeekIso = addDaysIso(mondayThisWeekIso, -DAYS_PER_WEEK);
  return {
    startAt: parisMidnightUtcMs(mondayPrevWeekIso),
    endAt: parisMidnightUtcMs(mondayThisWeekIso) - 1,
    startDateIso: mondayPrevWeekIso,
    endDateIso: addDaysIso(mondayThisWeekIso, -1),
  };
}

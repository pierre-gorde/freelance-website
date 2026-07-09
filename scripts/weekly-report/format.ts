import {
  DIRECT_REFERRER_LABEL,
  EMAIL_COLORS,
  EMAIL_SUBJECT_PREFIX,
  REPORT_LOCALE,
  SITE_LABEL,
} from './report.const.ts';
import type { MetricRow, WebsiteStats } from './umami.ts';
import type { WeekRange } from './week.ts';

export type ReportData = {
  range: WeekRange;
  stats: WebsiteStats;
  topPages: MetricRow[];
  topReferrers: MetricRow[];
  topEvents: MetricRow[];
  dashboardUrl: string;
};

const PERCENT_BASE = 100;
const SECONDS_PER_MINUTE = 60;
const NOON_UTC_SUFFIX = 'T12:00:00Z';

function formatDateFr(dateIso: string): string {
  return new Intl.DateTimeFormat(REPORT_LOCALE, { day: 'numeric', month: 'long' }).format(
    new Date(`${dateIso}${NOON_UTC_SUFFIX}`)
  );
}

function formatTrend(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? 'nouveau' : '—';
  }
  const delta = Math.round(((current - previous) / previous) * PERCENT_BASE);
  if (delta === 0) {
    return 'stable';
  }
  return delta > 0 ? `+${delta} % vs S-1` : `${delta} % vs S-1`;
}

function formatDuration(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  const minutes = Math.floor(rounded / SECONDS_PER_MINUTE);
  const seconds = rounded % SECONDS_PER_MINUTE;
  return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
}

function safeRatio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function buildSubject(range: WeekRange): string {
  return `${EMAIL_SUBJECT_PREFIX} ${SITE_LABEL} — du ${formatDateFr(range.startDateIso)} au ${formatDateFr(range.endDateIso)}`;
}

function kpiCell(label: string, value: string, trend: string): string {
  return `
    <td width="33%" style="padding: 12px 16px; border: 1px solid ${EMAIL_COLORS.border}; border-radius: 8px; background: ${EMAIL_COLORS.bgSubtle};">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: ${EMAIL_COLORS.muted};">${label}</div>
      <div style="font-size: 26px; font-weight: 600; color: ${EMAIL_COLORS.text}; margin-top: 4px;">${value}</div>
      <div style="font-size: 12px; color: ${EMAIL_COLORS.muted}; margin-top: 2px;">${trend}</div>
    </td>`;
}

function metricTable(title: string, rows: MetricRow[], emptyLabel: string): string {
  const body =
    rows.length === 0
      ? `<tr><td style="padding: 8px 0; color: ${EMAIL_COLORS.muted}; font-size: 14px;">${emptyLabel}</td></tr>`
      : rows
          .map(
            (row) => `
      <tr>
        <td style="padding: 6px 0; font-size: 14px; color: ${EMAIL_COLORS.text}; border-bottom: 1px solid ${EMAIL_COLORS.border};">${row.x ?? DIRECT_REFERRER_LABEL}</td>
        <td align="right" style="padding: 6px 0; font-size: 14px; font-weight: 600; color: ${EMAIL_COLORS.text}; border-bottom: 1px solid ${EMAIL_COLORS.border};">${row.y.toLocaleString(REPORT_LOCALE)}</td>
      </tr>`
          )
          .join('');
  return `
    <h2 style="font-size: 15px; color: ${EMAIL_COLORS.accent}; margin: 28px 0 8px; text-transform: uppercase; letter-spacing: 0.04em;">${title}</h2>
    <table width="100%" cellpadding="0" cellspacing="0">${body}</table>`;
}

export function buildHtml(data: ReportData): string {
  const { range, stats, topPages, topReferrers, topEvents, dashboardUrl } = data;
  const previous = stats.comparison;
  const bounceRate = Math.round(safeRatio(stats.bounces, stats.visits) * PERCENT_BASE);
  const prevBounceRate = Math.round(safeRatio(previous.bounces, previous.visits) * PERCENT_BASE);
  const avgDuration = safeRatio(stats.totaltime, stats.visits);

  return `
<div style="font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: ${EMAIL_COLORS.text};">
  <h1 style="font-size: 20px; margin: 0;">${SITE_LABEL}</h1>
  <p style="margin: 4px 0 24px; color: ${EMAIL_COLORS.muted}; font-size: 14px;">
    Semaine du ${formatDateFr(range.startDateIso)} au ${formatDateFr(range.endDateIso)}
  </p>

  <table width="100%" cellpadding="0" cellspacing="8">
    <tr>
      ${kpiCell('Visites', stats.visits.toLocaleString(REPORT_LOCALE), formatTrend(stats.visits, previous.visits))}
      ${kpiCell('Visiteurs', stats.visitors.toLocaleString(REPORT_LOCALE), formatTrend(stats.visitors, previous.visitors))}
      ${kpiCell('Pages vues', stats.pageviews.toLocaleString(REPORT_LOCALE), formatTrend(stats.pageviews, previous.pageviews))}
    </tr>
    <tr>
      ${kpiCell('Taux de rebond', `${bounceRate} %`, formatTrend(bounceRate, prevBounceRate))}
      ${kpiCell('Durée moyenne', formatDuration(avgDuration), formatTrend(stats.totaltime, previous.totaltime))}
      <td width="33%"></td>
    </tr>
  </table>

  ${metricTable('Pages les plus vues', topPages, 'Aucune page vue cette semaine.')}
  ${metricTable('Sources de trafic', topReferrers, 'Aucune source enregistrée.')}
  ${metricTable('Clics (events)', topEvents, 'Aucun clic tracké cette semaine.')}

  <p style="margin-top: 32px; font-size: 13px; color: ${EMAIL_COLORS.muted};">
    Détail complet sur le <a href="${dashboardUrl}" style="color: ${EMAIL_COLORS.accent};">dashboard Umami</a>.
  </p>
</div>`;
}

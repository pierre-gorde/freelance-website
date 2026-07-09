import { writeFile } from 'node:fs/promises';
import { sendEmail } from './email.ts';
import { buildHtml, buildSubject, type ReportData } from './format.ts';
import {
  SAMPLE_STATS,
  SAMPLE_TOP_EVENTS,
  SAMPLE_TOP_PAGES,
  SAMPLE_TOP_REFERRERS,
} from './sample.const.ts';
import { fetchStats, fetchTopMetrics, resolveShareAccess } from './umami.ts';
import { previousWeekRange, type WeekRange } from './week.ts';
import { UMAMI_DASHBOARD_URL } from './report.const.ts';

const SAMPLE_FLAG = '--sample';
const SAMPLE_OUTPUT_DEFAULT_PATH = 'weekly-report-preview.html';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Variable d'environnement manquante : ${name}`);
    process.exit(1);
  }
  return value;
}

function sampleReport(range: WeekRange): ReportData {
  return {
    range,
    stats: SAMPLE_STATS,
    topPages: SAMPLE_TOP_PAGES,
    topReferrers: SAMPLE_TOP_REFERRERS,
    topEvents: SAMPLE_TOP_EVENTS,
    dashboardUrl: UMAMI_DASHBOARD_URL,
  };
}

async function fetchReport(range: WeekRange): Promise<ReportData> {
  const shareUrl = requireEnv('UMAMI_SHARE_URL');
  const access = await resolveShareAccess(shareUrl);
  console.log(`📊 Récupération des stats Umami du ${range.startDateIso} au ${range.endDateIso}`);
  const [stats, topPages, topReferrers, topEvents] = await Promise.all([
    fetchStats(access, range.startAt, range.endAt),
    fetchTopMetrics(access, 'path', range.startAt, range.endAt),
    fetchTopMetrics(access, 'referrer', range.startAt, range.endAt),
    fetchTopMetrics(access, 'event', range.startAt, range.endAt),
  ]);
  return { range, stats, topPages, topReferrers, topEvents, dashboardUrl: shareUrl };
}

async function main(): Promise<void> {
  const sampleMode = process.argv.includes(SAMPLE_FLAG);
  const range = previousWeekRange(Date.now());
  const report = sampleMode ? sampleReport(range) : await fetchReport(range);
  const html = buildHtml(report);

  if (sampleMode) {
    const outputPath =
      process.argv[process.argv.indexOf(SAMPLE_FLAG) + 1] ?? SAMPLE_OUTPUT_DEFAULT_PATH;
    await writeFile(outputPath, html);
    console.log(`👀 Aperçu écrit dans ${outputPath} — sujet : « ${buildSubject(range)} »`);
    return;
  }

  const emailId = await sendEmail(requireEnv('RESEND_API_KEY'), {
    from: requireEnv('REPORT_EMAIL_FROM'),
    to: requireEnv('REPORT_EMAIL_TO'),
    subject: buildSubject(range),
    html,
  });
  console.log(`✉️ Rapport envoyé (id Resend : ${emailId})`);
}

main().catch((error) => {
  console.error('❌ Échec du rapport hebdo :', error);
  process.exit(1);
});

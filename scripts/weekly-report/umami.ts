import { TOP_ROWS_LIMIT } from './report.const.ts';

export type StatsBreakdown = {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
};

export type WebsiteStats = StatsBreakdown & { comparison: StatsBreakdown };

export type MetricRow = { x: string | null; y: number };

export type MetricType = 'path' | 'referrer' | 'event';

export type UmamiShareAccess = {
  gatewayUrl: string;
  websiteId: string;
  token: string;
};

const SHARE_PATH_PATTERN = /\/analytics\/([a-z0-9-]+)\/share\/([^/]+)/;

// L'accès API classique d'Umami Cloud est réservé au plan Pro. On reproduit ce
// que fait la page publique de partage (gratuite) : la share URL redirige vers
// /analytics/{region}/share/{shareId}, le gateway régional échange le shareId
// contre un token JWT, accepté ensuite par les endpoints stats via les headers
// x-umami-share-token + x-umami-share-context. Flux non documenté — si Umami
// le casse, le workflow échouera explicitement ici.
export async function resolveShareAccess(shareUrl: string): Promise<UmamiShareAccess> {
  const landing = await fetch(shareUrl);
  const match = new URL(landing.url).pathname.match(SHARE_PATH_PATTERN);
  if (!match) {
    throw new Error(
      `Share URL non reconnue (attendu une redirection vers /analytics/<region>/share/<id>) : ${shareUrl} → ${landing.url}`
    );
  }
  const [, region, shareId] = match;
  const gatewayUrl = `https://gateway-${region}.umami.is/api`;
  const response = await fetch(`${gatewayUrl}/share/${shareId}`);
  if (!response.ok) {
    throw new Error(`Umami share ${response.status} : ${await response.text()}`);
  }
  const { websiteId, token } = (await response.json()) as { websiteId: string; token: string };
  return { gatewayUrl, websiteId, token };
}

async function umamiGet<T>(
  access: UmamiShareAccess,
  path: string,
  params: Record<string, string>
): Promise<T> {
  const url = new URL(`${access.gatewayUrl}/websites/${access.websiteId}${path}`);
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url, {
    headers: {
      'x-umami-share-token': access.token,
      'x-umami-share-context': '1',
    },
  });
  if (!response.ok) {
    throw new Error(`Umami API ${response.status} sur ${path} : ${await response.text()}`);
  }
  return (await response.json()) as T;
}

export async function fetchStats(
  access: UmamiShareAccess,
  startAt: number,
  endAt: number
): Promise<WebsiteStats> {
  return umamiGet<WebsiteStats>(access, '/stats', {
    startAt: String(startAt),
    endAt: String(endAt),
  });
}

export async function fetchTopMetrics(
  access: UmamiShareAccess,
  type: MetricType,
  startAt: number,
  endAt: number
): Promise<MetricRow[]> {
  return umamiGet<MetricRow[]>(access, '/metrics', {
    type,
    startAt: String(startAt),
    endAt: String(endAt),
    limit: String(TOP_ROWS_LIMIT),
  });
}

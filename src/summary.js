import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, '..', 'data');

/** @returns {string} YYYY-MM-DD in Asia/Shanghai */
export function shanghaiDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** @returns {string} wall-clock ISO with +08:00 for Asia/Shanghai */
export function shanghaiNowIso(d = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}+08:00`;
}

/** Previous calendar day (Asia/Shanghai) as YYYY-MM-DD */
function previousShanghaiDate(dateYmd) {
  // Parse as Shanghai midnight, subtract 24h in ms via UTC epoch
  const [y, m, d] = dateYmd.split('-').map(Number);
  const utcMs = Date.UTC(y, m - 1, d) - 24 * 60 * 60 * 1000;
  const prev = new Date(utcMs);
  const yy = prev.getUTCFullYear();
  const mm = String(prev.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(prev.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function summaryPathForDate(date) {
  return path.join(DATA_DIR, `${date}.json`);
}

export function buildMockSummary(date = shanghaiDate()) {
  const onsetDay = previousShanghaiDate(date);
  return {
    date,
    sleep_total_min: 412,
    sleep_deep_min: 78,
    sleep_onset: `${onsetDay}T23:42:00+08:00`,
    hrv: 42,
    resting_hr: 56,
    steps: 8340,
    source: 'mock',
    fetched_at: shanghaiNowIso(),
  };
}

/**
 * TODO(credentials): Replace mock with Health Kit REST pull once
 * HUAWEI_CLIENT_ID / HUAWEI_CLIENT_SECRET and user tokens exist.
 * Scopes (read-only; start with basic/open approval level):
 *   https://www.huawei.com/healthkit/sleep.read
 *   https://www.huawei.com/healthkit/heartrate.read  (resting HR + HRV where exposed)
 *   https://www.huawei.com/healthkit/step.read
 * API base: https://health-api.cloud.huawei.com/healthkit/v2
 */
export async function pullDailySummary({ date = shanghaiDate(), forceMock = false } = {}) {
  const hasTokens =
    Boolean(process.env.HUAWEI_ACCESS_TOKEN) ||
    Boolean(process.env.HUAWEI_REFRESH_TOKEN);
  const allowMock = process.env.ALLOW_MOCK_PULL !== 'false';

  if (!hasTokens || forceMock) {
    if (!allowMock && !forceMock) {
      const err = new Error(
        'No Huawei tokens configured. Set tokens or ALLOW_MOCK_PULL=true for mock data.',
      );
      err.code = 'NO_TOKENS';
      throw err;
    }
    return buildMockSummary(date);
  }

  // TODO: exchange refresh token → access token, then query sleep / heart / steps
  const err = new Error(
    'Health Kit live pull not implemented yet (waiting on AppGallery credentials).',
  );
  err.code = 'NOT_IMPLEMENTED';
  throw err;
}

export async function writeSummary(summary) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = summaryPathForDate(summary.date);
  await fs.writeFile(file, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  return file;
}

export async function readSummary(date = shanghaiDate()) {
  const file = summaryPathForDate(date);
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    if (e && e.code === 'ENOENT') return null;
    throw e;
  }
}

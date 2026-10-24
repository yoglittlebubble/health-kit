import 'dotenv/config';
import express from 'express';
import {
  pullDailySummary,
  readSummary,
  shanghaiDate,
  writeSummary,
} from './summary.js';

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, date: shanghaiDate() });
});

/**
 * OAuth callback placeholder for 服务器应用 + 微信小程序授权回流.
 * TODO(credentials): validate state, exchange code → tokens, persist refresh_token securely.
 * Docs: https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/open-platform-oauth-0000001053627305
 */
app.get('/oauth/callback', (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;
  if (error) {
    return res.status(400).json({
      ok: false,
      error,
      error_description: errorDescription || null,
      todo: 'Inspect Huawei OAuth error; do not log secrets.',
    });
  }
  if (!code) {
    return res.status(400).json({
      ok: false,
      error: 'missing_code',
      hint: 'Expect ?code=&state= from Huawei OAuth redirect.',
    });
  }
  // Intentionally do not exchange code yet — no real client secret in repo.
  res.status(501).json({
    ok: false,
    todo: 'Exchange authorization code for access_token + refresh_token using HUAWEI_CLIENT_ID / HUAWEI_CLIENT_SECRET.',
    received: {
      code_present: true,
      state: state || null,
    },
  });
});

app.get('/summary/today', async (_req, res) => {
  try {
    const date = shanghaiDate();
    const summary = await readSummary(date);
    if (!summary) {
      return res.status(404).json({
        ok: false,
        error: 'not_found',
        date,
        hint: 'POST /pull first (mock allowed when no tokens).',
      });
    }
    res.json(summary);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/summary/:date', async (req, res) => {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ ok: false, error: 'invalid_date' });
    }
    const summary = await readSummary(date);
    if (!summary) {
      return res.status(404).json({ ok: false, error: 'not_found', date });
    }
    res.json(summary);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * Pull Health Kit (or mock) and write data/YYYY-MM-DD.json
 * Body optional: { "date": "YYYY-MM-DD", "forceMock": true }
 */
app.post('/pull', async (req, res) => {
  try {
    const date = req.body?.date || shanghaiDate();
    const forceMock = Boolean(req.body?.forceMock);
    const summary = await pullDailySummary({ date, forceMock });
    const file = await writeSummary(summary);
    res.json({ ok: true, file, summary });
  } catch (e) {
    const status = e.code === 'NO_TOKENS' ? 400 : e.code === 'NOT_IMPLEMENTED' ? 501 : 500;
    res.status(status).json({ ok: false, error: e.message, code: e.code || null });
  }
});

app.listen(port, () => {
  console.log(`health-kit-bridge listening on :${port} (TZ hint: Asia/Shanghai)`);
});

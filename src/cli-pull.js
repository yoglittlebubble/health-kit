import 'dotenv/config';
import { pullDailySummary, writeSummary, shanghaiDate } from './summary.js';

const args = process.argv.slice(2).filter((a) => a !== '--');
const forceMock = args.includes('--mock');
const dateArg = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const date = dateArg || shanghaiDate();

const summary = await pullDailySummary({ date, forceMock });
const file = await writeSummary(summary);
console.log(JSON.stringify({ ok: true, file, summary }, null, 2));

# health-kit-bridge

华为 **Health Kit（服务器应用）** → 每日固定摘要 JSON 的后端骨架。  
消费方：健康抗炎管家看板。时区：**Asia/Shanghai**。

> 当前阶段：**申请并行 + 骨架与摘要格式**。无真实 Client Secret；无凭证时 `POST /pull` 写 **mock** 数据。

## 架构

```
微信小程序（OAuth 入口）
        │  authorization code
        ▼
本后端 health-kit-bridge
        │  OAuth token + REST
        ▼
Huawei Health Kit 云端 API
        │
        ▼
data/YYYY-MM-DD.json  ←── schemas/daily-summary.schema.json
        │
        ▼
健康抗炎管家（每日摘要）
```

产品类型在 AppGallery Connect 选 **服务器应用**。个人开发者开通 Health Kit 前通常还需上架华为应用市场的移动应用（见 `docs/apply-checklist.md`）。

## 摘要字段

| 字段 | 说明 |
| --- | --- |
| `date` | Asia/Shanghai 日历日 `YYYY-MM-DD` |
| `sleep_total_min` | 总睡眠（分钟） |
| `sleep_deep_min` | 深睡（分钟） |
| `sleep_onset` | 入睡时刻（ISO-8601 或 `HH:mm`） |
| `hrv` | 心率变异性 |
| `resting_hr` | 静息心率（bpm） |
| `steps` | 步数 |
| `source` | `huawei_health_kit` \| `mock` |
| `fetched_at` | 拉取写入时间（ISO-8601） |

示例：`examples/daily-summary.example.json`  
Schema：`schemas/daily-summary.schema.json`

## 需要申请的 Scope（只读、先基础）

- `https://www.huawei.com/healthkit/sleep.read`
- `https://www.huawei.com/healthkit/heartrate.read`
- `https://www.huawei.com/healthkit/step.read`

## 环境变量

复制 `.env.example` → `.env`：

- `HUAWEI_CLIENT_ID`
- `HUAWEI_CLIENT_SECRET`
- `HUAWEI_REDIRECT_URI`（默认 `http://localhost:8787/oauth/callback`）
- `ALLOW_MOCK_PULL=true`（无 token 时允许 mock）

**切勿**把真实 Secret 写进仓库。

## 本地运行

```bash
npm install
cp .env.example .env
npm run pull -- --mock    # 写入 data/<今天>.json
npm start                 # :8787
```

### 路由（桩）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/healthz` | 存活检查 |
| `GET` | `/oauth/callback` | OAuth 回调占位（501，待凭证） |
| `GET` | `/summary/today` | 读当日摘要文件 |
| `GET` | `/summary/:date` | 读指定日 |
| `POST` | `/pull` | 拉数并写入 `data/`（无 token → mock） |

## TODO（有凭证后再做）

1. `/oauth/callback` 用 code 换 `access_token` / `refresh_token` 并安全落盘。
2. `pullDailySummary` 调 Health Kit REST（非 mock）。
3. 定时任务每日自动 `POST /pull`，把 JSON 交给健康抗炎管家。

申请步骤与链接：[`docs/apply-checklist.md`](docs/apply-checklist.md)。申请材料底稿见 [`docs/apply`](docs/apply)，隐私政策与用户协议见 [`docs/legal`](docs/legal)（公开 URL 待 GitHub Pages）。

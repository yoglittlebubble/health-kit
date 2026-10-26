# Health Kit 申请清单（个人开发者并行推进）

> 骨架与摘要格式可先落地；**真实拉数**必须等 AppGallery Connect 审核通过并拿到 Client ID / Secret。

## 申请材料（仓库内）

底稿与官方表格已放进仓库，填表时以此为准：

| 材料 | 路径 |
| --- | --- |
| 隐私政策 | [`docs/legal/privacy-policy.md`](legal/privacy-policy.md)、[`docs/legal/privacy-policy.html`](legal/privacy-policy.html) |
| 用户协议 | [`docs/legal/user-agreement.md`](legal/user-agreement.md)、[`docs/legal/user-agreement.html`](legal/user-agreement.html) |
| 采购计划 | [`docs/apply/procurement-plan.md`](apply/procurement-plan.md) |
| 开发者信息底稿 | [`docs/apply/developer-info.md`](apply/developer-info.md) |
| 已填个人开发者清单 | [`docs/apply/申请材料清单（个人开发者）-已填.xlsx`](apply/申请材料清单（个人开发者）-已填.xlsx) |
| 空白个人模板 | [`docs/申请材料清单（个人开发者）.xlsx`](申请材料清单（个人开发者）.xlsx) |
| 空白企业模板 | [`docs/申请材料清单（企业开发者）.xlsx`](申请材料清单（企业开发者）.xlsx) |

隐私政策与用户协议的**公开 URL 仍是 TODO**，要等 GitHub Pages（或其他托管）启用后才能填进华为表单。Pages 源选 `/docs` 时，站点根路径为：

- `https://yoglittlebubble.github.io/health-kit/privacy-policy.html`
- `https://yoglittlebubble.github.io/health-kit/user-agreement.html`

对应文件同时放在 `docs/privacy-policy.html`、`docs/user-agreement.html`（与 `docs/legal/` 内副本内容相同），这样 source=`/docs` 会把它们发到站点根。`docs/.nojekyll` 让 Pages 按静态文件原样提供，不经 Jekyll 处理。

## 1. 开发者与产品类型

1. 打开 [AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html) → 我的项目 → 新建/选择项目。
2. 创建应用。云端 REST 对接时，产品类型选 **服务器应用**（与微信小程序作为授权入口的常见组合一致）。
3. **个人开发者硬门槛**：开通 Health Kit 通常要求已有 **上架华为应用市场的移动应用**（极简鸿蒙/安卓壳即可），或改为企业开发者资质。本仓库不阻塞于该步骤，但上线前必须解决。
4. 官方开通说明：[申请开通 Health Service Kit](https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/apply-kitservice-0000001050071707)（以当前文档为准）。

## 2. OAuth / 重定向

1. 在 AGC 拿到 `Client ID`、`Client Secret`，写入本地 `.env`（勿提交仓库）。
2. 配置回调：`HUAWEI_REDIRECT_URI`（本地开发可用 `http://localhost:8787/oauth/callback`）。
3. 微信小程序侧：登录华为账号后把 `code` 交给本后端的 `/oauth/callback`（或小程序云函数转发）。授权码模式参见[开放平台 OAuth](https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/open-platform-oauth-0000001053627305)。

## 3. 只需申请的读权限（先基础开放等级）

先只勾 **读**，不要写权限：

| 数据 | Scope |
| --- | --- |
| 睡眠 | `https://www.huawei.com/healthkit/sleep.read` |
| 心率 / 静息心率 / HRV（按平台暴露） | `https://www.huawei.com/healthkit/heartrate.read` |
| 步数 | `https://www.huawei.com/healthkit/step.read` |

Scope 列表参考：[Scopes](https://developer.huawei.com/consumer/en/doc/HMS-Plugin-Guides-V1/scopes-0000001074269582-V1)。  
云端 REST 概览：[接口使用说明](https://developer.huawei.com/consumer/cn/doc/HMSCore-References/rest-overview-0000001254420693)。

## 4. 审核与测试预期

- 审核大约 **10 个工作日**（以审核邮件为准）。
- 测试期常见限制：约前 **100** 名用户（以当前政策为准）。
- 403 / insufficient scopes：核对 AGC 已申请 scope、授权时用户勾选、以及 `appId`/`Client ID` 与申请一致。FAQ：[云侧数据开放 FAQ](https://developer.huawei.com/consumer/en/doc/HMSCore-Guides/faq-0000001476980529)。

## 5. 通过后本仓库要做的事

1. 填好 `.env` 中的 `HUAWEI_CLIENT_ID` / `HUAWEI_CLIENT_SECRET` / `HUAWEI_REDIRECT_URI`。
2. 实现 `/oauth/callback` 换 token，安全保存 `refresh_token`。
3. 实现 `pullDailySummary` 真实 REST，写入 `data/YYYY-MM-DD.json`，字段对齐 `schemas/daily-summary.schema.json`。
4. 把当日 JSON 交给 [健康抗炎管家](grokbot://app/v1/agent?id=8215b87a-c6cc-49b4-9c33-a0ae9f9072ab) 更新看板。

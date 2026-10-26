# 个人开发者申请信息底稿（Health Kit / 材料清单用）

> 供填写华为个人开发者 Health Kit 申请材料（含 xlsx 清单）时复制。  
> 请勿编造企业名称；「已上架」等状态以 AGC 控制台为准，本底稿**不声称**应用市场已上架。  
> 日期：2026-10-26（Asia/Shanghai）

---

## 1. 开发者基本信息

| 字段 | 填写内容 |
| --- | --- |
| 姓名 | 卢俊晓 |
| 开发者类型 | 个人开发者 |
| 身份 | 本科生 / 个人开发者 |
| 所在机构 | 上海海事大学 |
| 院系专业年级 | 能源与动力工程 · 大二 |
| 联系邮箱 | wuyansiwuyu@gmail.com |
| 联系手机 | +86 13817194409 |
| 华为开发者账号昵称（参考） | 尤格小泡泡（以控制台显示为准） |

## 2. 应用与项目信息

| 字段 | 填写内容 |
| --- | --- |
| AGC 项目 | Bot协同 |
| 应用名称 | HealthKitBridge |
| 包名 / Package Name | `com.yoglittlebubble.healthkit` |
| APP ID | `6917619950040464521` |
| 产品形态说明 | 移动应用壳 + 服务器端 health-kit-bridge（REST）；计划以微信小程序作为 OAuth 授权入口 |
| 当前 AGC 状态（参考） | 准备提交（**非**已上架；以上架进度需另行推进） |
| 代码仓库 | https://github.com/yoglittlebubble/health-kit |

## 3. 应用说明（可粘贴「应用简介 / 使用场景」）

HealthKitBridge 是个人开发者卢俊晓开发的个人抗炎健康数据桥接应用。用户通过华为账号授权后，后端以 Health Kit 云端只读接口拉取睡眠、心率/HRV、步数等基础数据，按 Asia/Shanghai 日历日汇总为固定字段 JSON，供个人抗炎健康看板展示与趋势查看。

本应用：

- 面向个人自用与学习联调，非医疗机构、非诊疗服务；
- **只读**申请基础健康数据，不向 Health Kit 写入；
- 不出售用户健康数据，不做广告画像；
- 测试阶段用户规模控制在平台测试政策范围内（约 ≤100 人）。

## 4. 申请权限及用途说明

| 权限 / Scope | 类型 | 用途说明（对应抗炎看板） |
| --- | --- | --- |
| `https://www.huawei.com/healthkit/sleep.read` | 只读 | 读取总睡眠、深睡、入睡时刻等，评估睡眠恢复与炎症相关作息 |
| `https://www.huawei.com/healthkit/heartrate.read` | 只读 | 读取静息心率、HRV 等，观察自主神经与恢复状态 |
| `https://www.huawei.com/healthkit/step.read` | 只读 | 读取日步数，作为日常活动量指标 |

**不申请**写权限及其他敏感扩展 scope。OAuth 令牌仅用于代表用户调用上述只读接口。

## 5. 隐私政策与用户协议链接

| 文档 | 本地路径 | 公开 URL |
| --- | --- | --- |
| 隐私政策 | `docs/legal/privacy-policy.html`（及 `.md`） | **TODO**：`https://yoglittlebubble.github.io/health-kit/privacy-policy.html`（待 GitHub Pages） |
| 用户协议 | `docs/legal/user-agreement.html`（及 `.md`） | **TODO**：`https://yoglittlebubble.github.io/health-kit/user-agreement.html`（待 GitHub Pages） |

表单若强制要求可访问 HTTPS 链接：先完成 GitHub Pages 发布，再填上述 URL；发布前可附 HTML 文件或仓库路径说明。

## 6. 采购计划摘要

见同目录 `procurement-plan.md`。一句话：**无商业采购，Health Kit 相关预算 ¥0，测试用户 ≤100，审核约 10 个工作日后自测。**

## 7. xlsx 清单常见列对照（按需粘贴）

若官方「个人开发者申请材料清单」含下列列，建议填写：

| 常见列名 | 建议值 |
| --- | --- |
| 开发者姓名 | 卢俊晓 |
| 证件/身份说明 | 个人开发者；在校本科生（上海海事大学） |
| 应用名称 | HealthKitBridge |
| 应用包名 | com.yoglittlebubble.healthkit |
| 应用简介 | （见上文第 3 节） |
| 申请数据类型 | 睡眠、心率（含 HRV/静息心率）、步数 |
| 申请权限 | sleep.read / heartrate.read / step.read（只读） |
| 数据用途 | 个人抗炎健康看板每日摘要 |
| 是否商业用途 | 否 |
| 预计用户规模 | 测试期 ≤100 |
| 隐私政策 URL | TODO（GitHub Pages 地址见上） |
| 用户协议 URL | TODO（GitHub Pages 地址见上） |
| 联系人邮箱 | wuyansiwuyu@gmail.com |
| 联系人电话 | +86 13817194409 |
| 备注 | 服务器应用 REST 拉取；壳应用上架进度独立推进中 |

## 8. 待办（填表前确认）

- [ ] 将 `docs/legal/*.html` 发布到 GitHub Pages，替换表单中的 TODO URL  
- [ ] 确认 AGC 中可被「选择产品」选中的已发布/可发布应用状态  
- [ ] 按华为当期模板核验是否需上传盖章扫描件（个人一般为签字即可，以官方 xlsx 说明为准）  
- [ ] 隐私政策、用户协议、采购计划、本页信息与控制台填写保持一致  

---

底稿维护：与仓库 `docs/apply-checklist.md`、`README.md` 保持一致；更新联系方式或包名时请同步修订本文件。

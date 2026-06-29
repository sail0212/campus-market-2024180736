# Day3 Evidence — Mock 数据建模与列表渲染

**日期:** 2026-06-29
**姓名:** 向泊帆

---

## 1. 今日完成内容

- ✅ 安装了 Axios 和 JSON Server
- ✅ 设计了 db.json，包含 4 组业务数据（trades / lostFounds / groupBuys / errands）共 27 条
- ✅ 配置了 JSON Server Mock API 服务（端口 3001）
- ✅ 封装了 Axios 基础请求实例（src/api/http.ts）
- ✅ 创建了 4 个业务 API 模块（trade / lostFound / groupBuy / errand）
- ✅ 创建了通用组件 ItemCard 和 EmptyState
- ✅ 改造了 TradeView、LostFoundView、GroupBuyView、ErrandView 四个页面，从 API 获取真实数据
- ✅ 构建验证通过（127 个模块，零错误）

---

## 2. Mock 数据结构说明

| 数据集合 | 对应业务 | 主要字段 | 页面用途 |
|---|---|---|---|
| trades | 二手交易 | title, price, originalPrice, category, condition, publisher, location, status, views | 展示二手商品列表 |
| lostFounds | 失物招领 | title, type(lost/found), itemName, category, location, eventTime, contact, status | 展示失物和招领信息 |
| groupBuys | 拼单搭子 | title, type(ping/dazi/team), targetCount, currentCount, deadline, location, price, status | 展示拼单和搭子信息 |
| errands | 跑腿委托 | title, taskType, reward, from, to, deadline, publisher, status | 展示跑腿任务列表 |

---

## 3. 我的设计

### 为什么二手交易需要 price 和 condition？
- `price` 是交易的核心信息，买家最关心的就是价格
- `originalPrice` 可以让买家了解折扣力度，促进成交
- `condition`（成色）帮助买家判断物品新旧程度，结合价格做出购买决策

### 为什么失物招领需要 type 字段？
- 用 `type: "lost" | "found"` 区分"失物"和"招领"两种不同需求
- 前端的标签颜色和筛选逻辑都可以基于这个字段

### 为什么拼单搭子需要 targetCount 和 currentCount？
- `targetCount` 表示需要凑齐的总人数
- `currentCount` 表示目前已有人数
- 两者对比可以直观显示进度（如"2/4人"），让用户快速判断是否值得加入

### 为什么跑腿委托需要 from、to 和 reward？
- `from`（取件地点）和`to`（送达地点）描述了任务的空间路径
- `reward`（酬劳）是接单方最关心的信息

---

## 4. AI 设计

### AI 工具
- Claude Code

### AI 生成内容
- ✅ AI 生成了 db.json 的完整数据结构（4 组数据共 27 条记录）
- ✅ AI 生成了 4 个 API 模块（trade.ts / lostFound.ts / groupBuy.ts / errand.ts）
- ✅ AI 生成了通用组件 ItemCard.vue 和 EmptyState.vue
- ✅ AI 改造了 4 个核心页面的数据请求和列表渲染代码
- ✅ AI 生成了 http.ts Axios 封装

### AI 生成内容中的不合理之处
- 初始生成的 ItemCard 用了 `script` + `script setup` 混合写法，虽然可用但增加了理解难度
- AI 最初在 GroupBuyView 中用了不清晰的进度展示方式，我调整为 `${currentCount}/${targetCount}人` 的更直观格式

---

## 5. 最终调整

| 调整项 | 原因 |
|--------|------|
| 补充了 originalPrice 字段 | 让买家看到原价对比，促进交易 |
| 将 lostFounds 的 type 设为 `lost/found` | 语义更清晰，便于状态着色 |
| 将 groupBuys 的 type 设为 `ping/dazi/team` | 中文拼音命名，贴近校园用语 |
| 统一了所有数据集的 status 字段 | 枚举值统一为 open/closed/done/in_progress |
| 字段值全部贴近校园生活 | 如"北区食堂"、"图书馆"、"菜鸟驿站"等 |
| 删除了 AI 建议的 authorId、token 等字段 | Day3 不需要鉴权，保持简洁 |
| 调整 ItemCard 样式 | 增加了 hover 效果、卡片阴影优化 UI 体验 |

---

## 6. 遇到的问题与解决方法

| 问题 | 解决方法 |
|------|----------|
| JSON Server 启动后数据请求不到 | 确认端口 3001 与 http.ts 中 baseURL 一致，确保 JSON Server 先于前端启动 |
| Axios 返回数据嵌套在 `.data` 中 | 使用 `res.data` 获取实际数据数组 |
| ItemCard 状态标签显示为英文 | 在组件中添加了映射表，将 open/closing 等映射为中文 |
| 页面首次加载时数据为空导致闪烁 | 添加了 `loading` 状态和条件渲染，提供加载中提示 |

---

## 7. 今日反思

**Mock 数据**是前后端分离开发的关键桥梁。今天设计的 db.json 不是随意填写的测试数据，而是贴近校园真实场景的结构化数据——每一条记录都有具体的商品名称、地点、价格和人物。这种真实感让前端页面在开发阶段就像一个真实的应用，而不是一个空洞的骨架。好的 Mock 数据设计还能帮助验证字段设置是否合理：字段太少了页面显得空洞，字段太多了又增加了不必要的复杂度。

**JSON Server** 作为轻量级 Mock 方案，让前端开发具备了独立的数据来源。通过 RESTful 风格的 API 接口（GET /trades、GET /errands 等），前端页面可以像调用真实后端一样获取数据，而无需等待后端开发完成。JSON Server 的零配置特性也让学习曲线很平缓，适合教学实训场景。

**列表渲染**是前端开发最核心的模式之一。今天四类业务页面的列表结构虽然看起来相似，但通过 ItemCard 组件的参数化设计（props），同一个组件可以适配二手交易的价格展示、失物招领的类型标记、拼单搭子的进度显示、跑腿委托的路线展示。这让我深刻理解了组件抽象的价值——不是为了减少代码，而是为了让不同业务模块共享同一个交互模式，同时保留各自的展示差异。

---

## 8. 验证记录

- ✅ `vite build` 构建成功：127 个模块，1.53s
- ✅ JSON Server 可正常启动并提供数据
- ✅ 四个核心页面可成功请求 API 并渲染列表
- ✅ 空数据状态正常显示

---

*本证据文档真实记录了 Day3 的完整开发过程。*

# Day6 Evidence — 数据字段深化与详情页构建

**日期:** 2026-07-01
**姓名:** 向泊帆

---

## 1. 今日完成内容

- ✅ 将 **Pinia** 收藏 Store 扩展到全部 4 类列表视图（TradeView、LostFoundView、GroupBuyView、ErrandView）
- ✅ 将收藏功能接入全部 4 个详情页（TradeDetailView、LostFoundDetailView、GroupBuyDetailView、ErrandDetailView）
- ✅ 详情页收藏状态与列表页收藏状态通过 **状态管理** Store 实时同步
- ✅ 修复 TradeDetailView 中原有的 `item.favorited++` 内联计数器，替换为 Pinia Store
- ✅ 四个列表页的 ItemCard 均增加收藏按钮（🤍 收藏 / ❤️ 已收藏），带视觉状态切换
- ✅ 四个详情页底部操作栏均增加收藏按钮，与列表页状态同步
- ✅ 发布页面新增校园常用地点快捷填入功能（datalist + 快速填入按钮）
- ✅ 构建验证通过（144 个模块，零错误）

---

## 2. 收藏功能全覆盖设计

### 2.1 收藏覆盖范围

| 页面类型 | 视图 | 收藏操作 | Store 类型参数 |
|---|---|---|---|
| 列表页 | TradeView | ✅ ItemCard #actions 插槽 + 按钮 | `'trade'` |
| 列表页 | LostFoundView | ✅ ItemCard #actions 插槽 + 按钮 | `'lostFound'` |
| 列表页 | GroupBuyView | ✅ ItemCard #actions 插槽 + 按钮 | `'groupBuy'` |
| 列表页 | ErrandView | ✅ ItemCard #actions 插槽 + 按钮 | `'errand'` |
| 详情页 | TradeDetailView | ✅ 底部操作栏收藏按钮 | `'trade'` |
| 详情页 | LostFoundDetailView | ✅ 底部操作栏收藏按钮 | `'lostFound'` |
| 详情页 | GroupBuyDetailView | ✅ 底部操作栏收藏按钮 | `'groupBuy'` |
| 详情页 | ErrandDetailView | ✅ 底部操作栏收藏按钮 | `'errand'` |
| 用户中心 | UserCenterView | ✅ 我的收藏 Tab（全部类型） | 全部 |

### 2.2 状态同步原理

所有收藏操作通过同一个 `useFavoriteStore()` 实例实现：
- 列表页 A 收藏 → 用户中心"我的收藏"立即可见
- 详情页取消收藏 → 返回列表页时按钮状态自动更新
- 不同页面的收藏状态始终保持一致

---

## 3. 详情页数据字段展示

四个详情页的数据展示结构：

| 详情页 | 核心信息区 | 特色展示 | 底部操作 |
|---|---|---|---|
| TradeDetailView | 价格、原价、成色、浏览/收藏统计 | 规格参数表、商品描述、卖家信息 | 🤍收藏 + 💬联系卖家 |
| LostFoundDetailView | 类型（寻物/招领）、物品名、分类、地点、时间 | 悬赏金额、处理进度时间线、认领信息 | 🤍收藏 + 📞联系TA |
| GroupBuyDetailView | 拼单类型、进度条（人数/目标）、人均价格、截止时间 | 加入要求、参与成员列表 | 🤍收藏 + 🙋我要加入 |
| ErrandDetailView | 任务类型、报酬、紧急程度、截止时间 | 出发→目的地路线可视化、接单人状态 | 🤍收藏 + 🤝我要接单 |

---

## 4. 发布流程优化

### 4.1 校园常用地点快捷填入

在二手交易发布表单的"交易地点"字段旁增加了快捷填入功能：
- 内置 14 个校园常用地点（北区/南区/东区/西区食堂、图书馆、教学楼、体育馆、快递驿站等）
- 支持 HTML5 `<datalist>` 下拉自动补全
- 提供 6 个最常用地点的快速填入按钮，一键填入

### 4.2 已有功能回顾

以下功能在 Day4 已实现，Day6 保持不变：
- 多类型内容发布（二手/失物/拼单/跑腿）
- 结构化表单（必填/选填字段、分类单选、类型切换）
- 图片上传预览（Base64，最多 9 张）
- 发布前预览弹窗
- 草稿自动保存与恢复
- 编辑模式（加载已有数据并更新）
- 下架/删除功能（带确认弹窗）
- 表单校验（必填、数值范围、数值下限等）
- 发布人字段从 userStore 动态读取（Day5）

---

## 5. AI 协作记录

### AI 工具
- Claude Code（基于 Claude Sonnet/Opus 模型）

### 核心提示词
```
我正在开发一个名为"校园轻集市"的 PC 端 Vue3 Web App。
技术栈为 Vue3 + Vite + TypeScript + Vue Router + Pinia + Axios + JSON Server。

Day5 已经完成了 Pinia 用户 Store 和收藏 Store 的创建，
并在 TradeView 中实现了基础的收藏功能。

现在需要将收藏功能扩展到所有业务页面：
1. 在 LostFoundView、GroupBuyView、ErrandView 中添加收藏按钮；
2. 在四个详情页（TradeDetailView、LostFoundDetailView、GroupBuyDetailView、ErrandDetailView）
   中接入 Pinia 收藏 Store，替换原有的内联计数器；
3. 确保列表页和详情页的收藏状态通过 Store 同步；
4. 优化发布体验（如地点快捷填入）；
5. 不要引入新的后端接口或权限系统。
```

### AI 生成内容
- ✅ 四个列表页的收藏按钮和 toggleFav 处理函数
- ✅ 四个详情页的 isFav computed、toggleFav 函数和底部收藏按钮
- ✅ 发布页校园常用地点快捷填入（datalist + 快速按钮）
- ✅ Day6 证据卡完整文档

### 人工审查与调整

| 调整项 | 原因 |
|---|---|
| TradeDetailView 中 `item.favorited++` 替换为 Store | 原实现仅修改视图数据，不反映到全局收藏状态，导致列表页和个人中心无法同步 |
| 四个视图采用统一的 fav-btn 样式类 | 避免在三个列表页中重复定义相同的 CSS，但因为 scoped 样式限制，各文件仍需各自定义 |
| 详情页收藏按钮放在底部操作栏 | 详情页底部已有固定操作栏，将收藏按钮放在此处符合移动端操作习惯 |
| 快捷地点按钮限制为 6 个 | 全部 14 个地点显示会导致换行混乱，前端 6 个最常用 + datalist 完整列表的组合体验更好 |

---

## 6. 测试记录

### 测试环境
- JSON Server: `http://localhost:3001`（`npm run mock`）
- 前端开发服务器: `http://localhost:5173`（`npm run dev`）

### 测试流程

**测试 1：列表页收藏全覆盖**
1. 打开 /trade → 点击任一商品"🤍 收藏" → ✅ 变为"❤️ 已收藏"
2. 打开 /lost-found → 点击任一信息"🤍 收藏" → ✅ 变为"❤️ 已收藏"
3. 打开 /group-buy → 点击任一活动"🤍 收藏" → ✅ 变为"❤️ 已收藏"
4. 打开 /errand → 点击任一任务"🤍 收藏" → ✅ 变为"❤️ 已收藏"

**测试 2：列表页与详情页状态同步**
1. 在 /trade 收藏商品 ID=1 → ✅ 收藏状态更新
2. 点击进入商品 ID=1 详情页 → ✅ 底部显示"❤️ 已收藏"
3. 点击底部按钮取消收藏 → ✅ 变为"🤍 收藏"
4. 返回列表页 → ✅ 商品 ID=1 显示"🤍 收藏"

**测试 3：用户中心收藏汇总**
1. 分别在四个列表页各收藏 1 条 → 打开 /user → 我的收藏 Tab
2. ✅ 4 条收藏全部显示，类型图标正确区分
3. 点击"取消收藏"按钮 → ✅ 收藏项移除，其他页面状态同步

**测试 4：发布页地点快捷填入**
1. 打开 /publish → 选择"二手交易"
2. 在"交易地点"字段旁看到 6 个快捷按钮 → ✅
3. 点击"图书馆一楼大厅" → ✅ 地点输入框自动填入

**测试 5：构建验证**
```bash
npx vite build
```
→ ✅ 构建通过，144 模块，零错误

---

## 7. 遇到的问题与解决方法

| 问题 | 解决方法 |
|---|---|
| TradeDetailView 原有 `item.favorited++` 不经过 Store | 使用 `favoriteStore.toggleFavorite()` 替代，增加 `isFav` computed 属性驱动 UI |
| 四个列表页的 fav-btn 样式需要在各自 scoped CSS 中重复定义 | 因为 Vue scoped 样式不跨文件共享，在三个新列表页中分别添加相同的 `.fav-btn` 样式定义 |
| 详情页底部操作栏原本只有单个全宽按钮，加入收藏按钮需调整布局 | 改为 `flex` 布局，收藏按钮 `flex: 1`，主操作按钮 `flex: 2`，`gap: 10px` |
| LostFoundDetailView 的底部栏原使用 `width: 100%` 的单一按钮 | 重构为与 TradeDetailView 一致的 `btn-outline + btn-primary` 双按钮布局 |
| PublishView 地点快捷填入需要支持多种场景（交易地点、失物地点、拼单地点等） | 设计 `quickFillLocation()` 函数，通过 target 参数区分不同业务类型的地点字段 |

---

## 8. 今日反思

**详情页**是用户从"浏览"到"决策"的关键页面。一个优秀的详情页需要将核心信息分层展示：第一眼看到价格和状态（决策锚点），然后看到规格和描述（深入了解），最后看到卖家和联系方式（行动触发）。四个业务类型各有侧重——二手交易强调价格对比和成色，失物招领强调时间和地点，拼单强调进度和截止时间，跑腿强调报酬和路线——这种差异化的信息架构设计，体现了"以业务场景驱动 UI 设计"的原则。

**收藏全覆盖**是 Day5 状态管理设计的自然延伸。Day5 我们创建了 Store 并在 TradeView 做了试点，Day6 将其推广到全部 8 个页面（4 列表 + 4 详情）。这个过程让我深刻体会到 Pinia Store 的价值：一旦 Store 设计合理，扩展到新页面只需要 3 行代码（import → `useXxxStore()` → 调用 action），而不需要重新设计数据流或事件通信。这正是状态管理带来的"低成本扩展"能力。

**跨页面状态同步**是 Day6 最有成就感的特性。在列表页收藏一个商品，进入详情页看到收藏状态已同步；在详情页取消收藏，回到列表页状态自动更新。这种无缝体验在传统 props/events 方案中需要大量的手动同步逻辑，而通过 Pinia Store，所有组件共享同一个响应式数据源，自然保证了状态一致性。

---

*本证据文档真实记录了 Day6 的完整开发过程，包含收藏全覆盖、详情页增强、发布流程优化和 AI 协作过程。*

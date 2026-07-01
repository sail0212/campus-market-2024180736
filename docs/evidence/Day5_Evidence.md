# Day5 Evidence — 状态管理与用户中心

**日期:** 2026-07-01
**姓名:** 向泊帆

---

## 1. 今日完成内容

- ✅ 创建了 **user.ts** Store，使用 **Pinia** 管理当前用户信息（用户名、学院、年级、头像、统计数据）
- ✅ 创建了 **favorite.ts** Store，管理收藏状态的增删查（add/remove/toggle/isFavorited）
- ✅ 在 AppNav.vue 导航栏中引入用户状态，动态显示当前用户名
- ✅ 在 PublishView.vue 中将硬编码的 `publisher: '小明'` 替换为 `userStore.user.name`
- ✅ 发布成功后自动调用 `incrementPublished()` 更新用户发布计数
- ✅ 在 ItemCard.vue 中新增 `favorited` prop 和 `actions` 插槽，支持收藏操作
- ✅ 在 TradeView.vue 中实现收藏/取消收藏功能，带视觉状态切换
- ✅ 重构 UserCenterView.vue，实现用户资料、Tab 切换（我的发布 / 我的收藏）
- ✅ 在个人中心通过 API 筛选当前用户发布的数据，展示"我的发布"列表
- ✅ 在个人中心展示收藏列表，支持取消收藏操作
- ✅ 更新 MessageView.vue，增加系统通知区域和互动消息区域
- ✅ 更新 EmptyState.vue 增加 `hint` 属性支持副提示
- ✅ 构建验证通过（144 个模块，零错误）

---

## 2. Store 设计与状态划分

### 2.1 Store 设计说明

本日共设计两个核心 Store 和一个已有 Store：

| Store 文件 | 主要作用 | 核心状态 | 核心操作 |
|---|---|---|---|
| src/stores/user.ts | 管理当前用户信息 | name、school、department、grade、avatar、published、sold、bought、isLoggedIn | setUser、incrementPublished、logout |
| src/stores/favorite.ts | 管理收藏状态 | favorites[]（id、type、title、addedAt） | addFavorite、removeFavorite、toggleFavorite、isFavorited |
| src/stores/app.ts | 原已有的应用 Store | 用户信息、消息列表 | —（Day5 保留原有结构） |

### 2.2 状态边界分析

**状态管理**的关键原则是：只将多个页面或组件需要共享的数据放入 Store，而不是将所有数据都放入 Store。

| 数据类型 | 是否放入 Store | 存放位置 | 原因 |
|---|---|---|---|
| 当前用户信息 | ✅ 是 | user.ts Store | 导航栏、发布页、个人中心等多个位置都需要读取用户信息 |
| 收藏列表 | ✅ 是 | favorite.ts Store | 列表页需要判断收藏状态，个人中心需要展示收藏列表 |
| 业务列表数据（trades等） | ❌ 否 | 页面组件 ref | 每个页面独立获取和使用，不需要跨页面共享 |
| 表单输入内容 | ❌ 否 | PublishView.vue ref | 只属于发布页面，不需要全局共享 |
| 表单校验错误 | ❌ 否 | PublishView.vue ref | 只属于当前表单，切换页面后不需要保留 |
| 草稿数据 | ❌ 否 | localStorage | 属于持久化数据而非运行时状态共享 |
| 路由参数 | ❌ 否 | Vue Router | 由路由系统管理 |
| 消息列表 | ⚠️ 保留在 app.ts | app.ts Store | Day1 已定义，MessageView 中使用，暂时保持原结构 |

### 2.3 为什么不需要将所有数据放入 Store

Store 不是存放所有数据的"全局垃圾桶"。Day5 阶段我理解了以下原则：
- **单页面数据**：如果数据只在一个页面中被消费（如 TradeView 的 trade 列表），保持在页面组件的 `ref` 中即可，不需要放入 Store
- **跨页面共享数据**：如用户信息、收藏列表等，在多个不相关组件间共享时，Store 是最佳选择
- **临时 UI 状态**：如表单输入、错误提示等，只存在于当前页面的生命周期中，放入 Store 会增加不必要的复杂度

---

## 3. 用户中心页面设计

### 3.1 页面结构

**用户中心**页面（UserCenterView.vue）包含三个核心区域：

1. **用户资料卡片**：展示头像、姓名、学校、学院、年级，以及发布/卖出/买入/收藏四个统计数据
2. **Tab 切换区域**：
   - "我的发布" Tab：通过 API 获取所有二手交易数据，在前端按 publisher 字段筛选当前用户发布的内容
   - "我的收藏" Tab：从 favoriteStore 读取收藏列表，展示收藏类型、标题、收藏时间，支持取消收藏
3. **账户设置菜单**：交易记录、我的消息、账户设置、帮助与反馈（占位，后续 Day 实现）
4. **退出登录按钮**：调用 userStore.logout() 清除用户状态

### 3.2 我的发布实现方案

"我的发布"采用前端筛选方案：
1. 调用 `getTrades()` 获取所有二手交易数据
2. 使用 `Array.filter()` 筛选出 `publisher === userStore.user.name` 的记录
3. 在页面上展示筛选结果，点击可跳转到详情页

这种方案的优点：
- 不需要修改 JSON Server 配置
- 不需要为每个业务类型增加按发布人查询的 API
- 适合教学 Demo 项目

---

## 4. AI 协作记录

### AI 工具
- Claude Code（基于 Claude Sonnet/Opus 模型）

### 核心提示词
```
我正在开发一个名为"校园轻集市"的 PC 端 Vue3 Web App。
技术栈为 Vue3 + Vite + TypeScript + Vue Router + Pinia + Axios + JSON Server。

现在需要完成 Day5：状态管理与用户中心。
项目中已经完成：
1. 页面骨架和路由导航；
2. Mock 数据和列表渲染；
3. 发布表单和数据新增。

请帮我完成以下任务：
1. 使用 Pinia 创建用户状态 Store；
2. 模拟当前用户信息，不接入真实登录；
3. 使用 Pinia 创建收藏状态 Store；
4. 在二手交易列表中实现收藏和取消收藏；
5. 在个人中心展示用户资料和我的收藏；
6. 发布页面中的 publisher 字段改为读取当前用户名称；
7. 代码保持简洁，适合教学实训项目继续扩展；
8. 不要加入复杂登录鉴权、JWT、后端权限系统和真实消息推送。
```

### AI 生成内容
- ✅ user.ts Store 完整代码（用户状态、getters、actions）
- ✅ favorite.ts Store 完整代码（收藏列表、增删查、切换操作）
- ✅ UserCenterView.vue 重构（用户卡片、Tab 切换、我的发布、我的收藏）
- ✅ PublishView.vue 中 publisher 字段改为动态读取
- ✅ TradeView.vue 中收藏按钮的实现
- ✅ ItemCard.vue 新增 favorited prop 和 actions 插槽
- ✅ MessageView.vue 系统通知区域
- ✅ EmptyState.vue hint 属性扩展

### 人工审查与调整

| 调整项 | 原因 |
|---|---|
| 从 app.ts 中提取用户信息到独立的 user.ts | app.ts 混合了用户信息和消息列表，职责不清。专用 user Store 使状态管理更清晰 |
| favorite.ts 增加了 favoritesByType 按类型过滤的 getter | 虽然 Day5 仅在 TradeView 使用收藏，但为后续扩展到四类业务预留接口 |
| PublishView.vue 中所有 `'小明'` 硬编码全部替换 | Day4 遗留的硬编码在四种发布类型中各有分布（trade/lostFound/groupBuy/errand），逐一替换 |
| lostFound 的 finder 字段也改为动态读取 | 失物招领中"捡到者"字段与发布人关联，也应从 userStore 读取 |
| 发布成功后调用 incrementPublished() | 发布新内容后用户统计数应增加，体现了状态管理的实时性 |
| ItemCard 的 actions 区域使用 `v-if` 条件渲染 | 只在需要收藏功能时才显示操作区域，避免不必要的 DOM 元素 |
| UserCenterView 的 Tab 切换交互 | Tab 按钮切换更符合移动端/PC 端习惯，区分"我的发布"和"我的收藏"两个核心区域 |

---

## 5. 测试记录

### 测试环境
- JSON Server: `http://localhost:3001`（`npm run mock`）
- 前端开发服务器: `http://localhost:5173`（`npm run dev`）

### 测试流程

**测试 1：导航栏显示用户信息**
1. 打开 http://localhost:5173/
2. 查看顶部导航栏右侧 → ✅ 显示"👤 小明"
3. 点击"我的"链接 → ✅ 跳转到个人中心页面

**测试 2：发布页面使用当前用户**
1. 打开 http://localhost:5173/publish
2. 选择"二手交易"，填写表单，点击发布
3. 发布成功后跳转到 /trade → ✅ 新发布的记录 publisher 字段为"小明"（来自 userStore）
4. 打开 db.json 确认 → ✅ publisher 正确写入

**测试 3：收藏与取消收藏**
1. 打开 http://localhost:5173/trade
2. 在任意卡片下方看到"🤍 收藏"按钮 → ✅ 按钮正常显示
3. 点击"收藏" → ✅ 按钮变为"❤️ 已收藏"，样式变为红色
4. 再次点击 → ✅ 按钮恢复为"🤍 收藏"
5. 打开个人中心 → 我的收藏 Tab → ✅ 已收藏的内容出现在列表中
6. 点击"取消收藏" → ✅ 收藏项从列表中移除

**测试 4：个人中心展示**
1. 打开 http://localhost:5173/user
2. 用户卡片显示"小明"、"某某大学"、"计算机科学与技术学院 · 2024级" → ✅
3. 统计数据展示发布/卖出/买入/收藏数量 → ✅
4. 切换到"我的发布" Tab → ✅ 显示当前用户发布的二手交易
5. 切换到"我的收藏" Tab → ✅ 显示已收藏的内容

**测试 5：构建验证**
```bash
npx vite build
```
→ ✅ 构建通过，144 个模块全部转换成功，零错误

---

## 6. 遇到的问题与解决方法

| 问题 | 解决方法 |
|---|---|
| app.ts 中已经存在 user 数据，是否需要新建 user.ts | 保留 app.ts 原有结构作为兼容，创建新的 user.ts 和 favorite.ts 作为 Day5 专项 Store，职责更清晰 |
| ItemCard 原来没有收藏操作入口 | 新增 `favorited` prop 和 `actions` 具名插槽，既保持了 ItemCard 的通用性，又为收藏操作提供了扩展点 |
| Day4 中 publisher 在四处硬编码为'小明'（四类业务） | 使用 replace_all 全局替换，并逐一确认每处替换的上下文正确性 |
| lostFound 的 finder 字段应不应改 | finder 表示"捡到者"，在模拟场景下与当前用户关联合理，一并改为 userStore.user.name |
| "我的发布"需要聚合四类数据但结构不同 | 先仅实现二手交易的"我的发布"，通过前端 filter 实现，保持代码简洁，后续可扩展 |
| EmptyState 组件缺少 hint 提示 | 新增 hint prop 并在模板中渲染，使空状态可以给出引导性提示 |

---

## 7. 今日反思

**Pinia 状态管理**是前端应用从"单页面功能"走向"多页面协同"的关键一步。Day2-4 我们实现了页面、数据、路由和发布表单，但数据都散落在各自页面组件中。Day5 引入 Pinia 后，用户信息可以被导航栏、发布页、个人中心同时访问而不需要通过 props 层层传递；收藏状态可以在列表页和个人中心之间实时同步——这就是状态管理的核心价值：**一处修改，多处响应**。

**状态边界**是 Day5 学到的最重要概念。不是所有数据都适合放进 Store。表单输入、校验错误、临时 UI 状态应该留在组件内部；只有那些真正被多个不相关组件共享的数据——当前用户、收藏列表——才需要提升到全局状态。如果无差别地把所有数据塞进 Store，代码会变得难以追踪和调试。这个边界判断能力，是前端工程师的重要素养。

**用户中心**页面是状态管理的"验收地"。它同时消费了两个 Store 的数据：userStore 提供用户资料，favoriteStore 提供收藏列表。通过这个页面，我直观地感受到了 Store 带来的便利——不需要在两个组件间传参，不需要维护复杂的事件通信，只需要在组件中调用 `useXxxStore()`，数据即刻可用。这也让我理解了为什么现代前端框架都倾向于推荐状态管理方案。

Day5 的收藏功能暂时只保存在前端内存中，刷新页面后收藏会丢失。这在实际产品中不可接受，但在教学场景下是合适的取舍——它让我先理解"状态如何跨组件共享"，后续 Day 再学习"状态如何持久化"。这种分步递进的方式，帮助我建立了更清晰的认知层次。

---

*本证据文档真实记录了 Day5 的完整开发过程，包含 Pinia Store 设计、状态边界分析、用户中心实现和 AI 协作过程。*

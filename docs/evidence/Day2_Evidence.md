# Day2 Evidence — 页面骨架与路由导航

**日期:** 2026-06-28
**姓名:** 向泊帆

---

## 1. 今日完成内容

今天完成了"校园轻集市"PC 端 Web App 的前端页面骨架搭建，包括：

- ✅ 创建了 8 个核心业务页面
- ✅ 配置了 Vue Router 路由系统（9 条路由）
- ✅ 搭建了公共布局组件（AppLayout、AppHeader、AppNav）
- ✅ 改造了 App.vue 使用统一布局
- ✅ 实现了页面之间的正常跳转
- ✅ 验证了项目构建通过（67 个模块，零错误）

---

## 2. 页面与路由清单

| 页面名称 | 路由路径 | 文件位置 |
|---|---|---|
| 首页 | `/` | `src/views/HomeView.vue` |
| 二手交易 | `/trade` | `src/views/TradeView.vue` |
| 失物招领 | `/lost-found` | `src/views/LostFoundView.vue` |
| 拼单搭子 | `/group-buy` | `src/views/GroupBuyView.vue` |
| 跑腿委托 | `/errand` | `src/views/ErrandView.vue` |
| 发布信息 | `/publish` | `src/views/PublishView.vue` |
| 消息中心 | `/message` | `src/views/MessageView.vue` |
| 个人中心 | `/user` | `src/views/UserCenterView.vue` |

---

## 3. 公共布局组件

| 组件 | 文件路径 | 职责 |
|------|----------|------|
| AppLayout | `src/components/AppLayout.vue` | 整体页面布局，包含 header + nav + content |
| AppHeader | `src/components/AppHeader.vue` | 顶部品牌区，展示项目名称和简介 |
| AppNav | `src/components/AppNav.vue` | 主导航菜单，router-link 跳转 |

布局结构：App.vue → AppLayout → AppHeader + AppNav + RouterView

---

## 4. AI 协作记录

### 使用的 AI 工具
- Claude Code

### 核心提示词
- "帮我完成 Day2 实验手册中的任务：创建 8 个页面骨架、配置路由、搭建公共布局组件"
- AI 批量生成了页面模板代码
- AI 协助设计了 4 种业务分类的颜色方案

### AI 生成的内容
- 8 个页面的初始模板代码
- 3 个布局组件的结构和样式
- 路由配置文件

### 人工审查与修改
- ✅ 检查了每个页面的文件名是否与路由对应
- ✅ 修改了 HomeView，使首页展示 4 个业务分类入口
- ✅ 为 TradeView 补充了商品列表数据（复用 Pinia store）
- ✅ 为 LostFoundView 补充了失物/招领 mock 数据
- ✅ 为 GroupBuyView 补充了拼单/搭子/组队 mock 数据
- ✅ 为 ErrandView 补充了跑腿任务 mock 数据
- ✅ 为 UserCenterView 补充了用户信息和功能菜单
- ✅ 调整了导航栏样式和颜色方案
- ✅ 验证了所有路由可正常访问

---

## 5. 遇到的问题与解决方法

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 首页路径冲突 | Day2 要求 `/` 直指 HomeView，但之前有 `/home` 重定向 | 删除 `/home` 路由，`/` 直接渲染 HomeView |
| TradeView 商品卡片需要跳转详情 | 原有 `/detail/:id` 路由被移除 | 重新添加 `/detail/:id` 路由以支持详情页跳转 |
| 页面过多导致样式分散 | 每个页面单独写样式 | 已通过全局 CSS 变量统一主题色和基础样式 |
| AI 初始生成的页面内容过于简单 | 只生成 h1 标题骨架 | 人工补充了 mock 数据和页面具体结构 |

---

## 6. 今日反思

**页面骨架**是前端项目的基础框架。今天搭建的 8 个页面虽然还没有接入真实数据和完整业务逻辑，但它们明确了整个应用的结构和边界。每个页面都有清晰的定位：首页作为入口，TradeView/LostFoundView/GroupBuyView/ErrandView 分别对应四大业务场景，PublishView 负责信息发布，MessageView 和 UserCenterView 承担用户交互和个人管理。这种清晰的页面划分使得后续开发可以按模块并行推进。

**路由导航**是连接所有页面的纽带。通过 Vue Router 的配置，每个页面都有语义化的 URL 路径（如 `/trade`、`/lost-found`），而不是无意义的 `/page1`。这种设计让 URL 本身就具有可读性，也方便后续添加权限控制和导航高亮。

**公共布局**实现了"一次定义，全局复用"。AppLayout、AppHeader、AppNav 三个组件的拆分体现了"页面组件"和"通用组件"的区别——前者负责具体业务逻辑，后者提供框架和容器。这种分离让页面代码更简洁，也让后续维护（如修改导航样式）变得更加容易——只需改一处即可全局生效。

这三者共同构成了一个可扩展的前端框架。没有页面骨架，代码组织会变得混乱；没有路由导航，页面之间无法联通；没有公共布局，每个页面都要重复写导航代码。今天的练习让我真正理解了为什么前端项目要先建立结构再填充内容。

---

## 7. 验证记录

- ✅ `vite build` 构建成功：67 个模块，2.23s
- ✅ 浏览器访问所有 8 个 URL 均可正常显示
- ✅ 导航菜单点击跳转正常，active 高亮生效
- ✅ 控制台无报错
- ✅ 刷新页面后路由正常工作

---

*本证据文档真实记录了 Day2 的完整开发过程。*

# AI 协作记录

## Day1 - 2026-06-27

### 协作内容：项目分析 & Day1 任务

---

### Prompt 1: 分析项目目录结构

**Prompt:**
```
请帮我分析 campus-market-seed 项目的目录结构，说明每个目录的用途。
```

**AI 输出（摘要）:**
- `src/api` — API 接口层，封装后端请求
- `src/components` — 可复用的 Vue 组件
- `src/router` — Vue Router 路由配置
- `src/stores` — Pinia 状态管理
- `src/views` — 页面级视图组件
- `src/App.vue` — 根组件
- `src/main.ts` — 应用入口
- `docs/` — 课程文档与证据模板
- `scripts/` — 自动检测工具
- `public/` — 静态资源目录

**自己的理解:**
这是 Vue 3 社区推荐的标准工程化目录结构，按功能分层。我需要重点开发 `views`（页面）、`components`（组件）、`stores`（状态管理）、`api`（接口）这几个目录。

---

### Prompt 2: 解释 main.ts

**Prompt:**
```
请解释下面这段 main.ts 代码的作用：

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

**AI 输出（摘要）:**
1. `createApp(App)` — 创建 Vue 3 应用实例，App.vue 作为根组件
2. `createPinia()` — 创建 Pinia 状态管理实例，通过 `app.use()` 注册
3. `router` — 注册路由插件
4. `app.mount('#app')` — 挂载到 `index.html` 中的 `#app` DOM 节点

**自己的理解:**
这是 Vue 3 的标准启动流程：创建实例 → 注册插件 → 挂载 DOM。和 Vue 2 的 `new Vue()` 不同，Vue 3 采用 `createApp` 的工厂函数模式。Pinia 替代了 Vuex，是 Vue 3 官方推荐的状态管理方案。

---

### Prompt 3: Router 的作用

**Prompt:**
```
请解释 Vue Router 在这个项目中的作用，为什么首页能显示？

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})
```

**AI 输出（摘要）:**
- Router 管理前端路由，使用 HTML5 History 模式
- `/` 路径映射到 `HomeView` 组件
- `RouterView` 是路由出口，根据 URL 渲染对应组件
- 访问 `http://localhost:5173/` 时，匹配到 `/` 路由，渲染 `HomeView`

**自己的理解:**
Router 是 SPA 的核心，通过 URL 变化切换页面组件，不需要刷新整个页面。当前只有首页一个路由，后续我需要添加更多路由（如商品列表、商品详情、购物车等）。

---

### Prompt 4: 技术栈分析

**Prompt:**
```
请分析这个项目使用的技术栈，包括：
- 前端框架
- 构建工具
- 类型系统
- 状态管理
- 路由方案
- 代码规范工具
```

**AI 输出（摘要）:**

| 技术 | 选型 | 说明 |
|------|------|------|
| 前端框架 | Vue 3.5 | Composition API |
| 语言 | TypeScript 6.0 | 类型安全 |
| 构建工具 | Vite 8.0 | 快速开发服务器 |
| 状态管理 | Pinia 3.0 | 轻量级状态管理 |
| 路由 | Vue Router 5.1 | SPA 路由 |
| 代码检查 | ESLint + Oxlint | 代码规范 |
| 包管理器 | pnpm 11.9 | 高效依赖管理 |

**自己的理解:**
这是一个现代化的 Vue 3 工程化项目，采用当前社区主流技术栈。Vite 替代了 Webpack 提供更快的开发体验，Pinia 替代 Vuex 简化状态管理，TypeScript 保障类型安全。

---

### 最终结论

通过 AI 协作，我快速理解了项目的技术架构和代码结构。AI 帮助我：
- 快速梳理项目目录结构
- 理解核心代码逻辑
- 了解技术选型的原因

但在理解过程中，我也需要结合自己的 Vue 基础知识进行判断，确保真正理解而非照搬 AI 输出。

---

### 验证记录

- ✅ 项目能够正常运行 (`pnpm dev`)
- ✅ 浏览器访问 `http://localhost:5173` 显示"项目启动成功"
- ✅ 理解 main.ts 启动流程
- ✅ 理解 Router 工作原理
- ✅ 理解项目目录结构

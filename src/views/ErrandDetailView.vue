<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getErrandById, deleteErrand, type ErrandItem } from '@/api/errand'
import { useFavoriteStore } from '@/stores/favorite'
import { formatTime, formatDateTime, errandStatusLabel, urgencyLabel, deadlineRemaining } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()

const item = ref<ErrandItem | null>(null)
const loading = ref(true)
const showDeleteConfirm = ref(false)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    const res = await getErrandById(id.value)
    item.value = res.data
  } catch (e) {
    console.error('获取跑腿详情失败', e)
  } finally {
    loading.value = false
  }
})

function goBack() { router.back() }

function goEdit() {
  if (item.value) {
    router.push({ path: '/publish', query: { type: 'errand', edit: String(item.value.id) } })
  }
}

async function handleDelete() {
  if (!item.value) return
  try {
    await deleteErrand(item.value.id)
    router.push('/errand')
  } catch (e) {
    console.error('删除失败', e)
    alert('删除失败，请重试')
  }
}

const remaining = computed(() => {
  if (!item.value) return { text: '', expired: false }
  return deadlineRemaining(item.value.deadline)
})

const taskIcon = computed(() => {
  const map: Record<string, string> = { '代买': '🛒', '代办': '📋', '代取': '📦', '代送': '🚀' }
  return map[item.value?.taskType || ''] || '📌'
})

const urgencyClass = computed(() => item.value?.urgency || 'low')

const isFav = computed(() => item.value ? favoriteStore.isFavorited(item.value.id, 'errand') : false)

function toggleFav() {
  if (item.value) {
    favoriteStore.toggleFavorite(item.value.id, 'errand', item.value.title)
  }
}
</script>

<template>
  <div class="detail-view">
    <div v-if="loading" class="loading-state">加载中…</div>

    <template v-else-if="item">
      <!-- 头部 -->
      <div class="header-area" :class="item.status">
        <button class="back-btn" @click="goBack">← 返回</button>
        <span class="header-icon">{{ taskIcon }}</span>
        <span class="header-type">{{ item.taskType }}</span>
        <span class="header-status">{{ errandStatusLabel(item.status) }}</span>
      </div>

      <!-- 基本信息 -->
      <div class="info-section card">
        <div class="title-row">
          <h1 class="title">{{ item.title }}</h1>
          <span class="urgency-badge" :class="urgencyClass">{{ urgencyLabel(item.urgency) }}</span>
        </div>

        <div class="reward-banner">
          <span class="reward-label">💰 委托报酬</span>
          <span class="reward-amount">¥{{ item.reward }}</span>
        </div>

        <!-- 路线 -->
        <div class="route-section">
          <div class="route-point from">
            <span class="route-dot start"></span>
            <div class="route-info">
              <span class="route-label">取件/出发</span>
              <span class="route-location">{{ item.from }}</span>
            </div>
          </div>
          <div class="route-line"></div>
          <div class="route-point to">
            <span class="route-dot end"></span>
            <div class="route-info">
              <span class="route-label">送达/目的地</span>
              <span class="route-location">{{ item.to }}</span>
            </div>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">📂 分类</span>
            <span class="meta-value">{{ item.category }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">⏰ 截止时间</span>
            <span class="meta-value" :class="{ expired: remaining.expired }">
              {{ formatDateTime(item.deadline) }}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">🕐 剩余</span>
            <span class="meta-value" :class="{ expired: remaining.expired }">
              {{ remaining.text }}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">📅 发布时间</span>
            <span class="meta-value">{{ formatTime(item.publishTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="item.tags.length > 0" class="tags-section card">
        <div class="tags-row">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- 任务描述 -->
      <div class="desc-section card">
        <h3>任务详情</h3>
        <p class="desc-text">{{ item.desc }}</p>
      </div>

      <!-- 发布者与接单信息 -->
      <div class="contact-section card">
        <h3>{{ item.status === 'open' ? '发布者信息' : '任务信息' }}</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">发布者</span>
            <span class="info-value">👤 {{ item.publisher }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系方式</span>
            <span class="info-value">📞 {{ item.contact }}</span>
          </div>
          <div v-if="item.acceptor" class="info-item">
            <span class="info-label">接单人</span>
            <span class="info-value acceptor">✅ {{ item.acceptor }}</span>
          </div>
          <div v-if="item.completedAt" class="info-item">
            <span class="info-label">完成时间</span>
            <span class="info-value">{{ formatDateTime(item.completedAt) }}</span>
          </div>
          <div v-if="!item.acceptor" class="info-item">
            <span class="info-label">状态</span>
            <span class="info-value pending">⏳ 等待接单</span>
          </div>
        </div>
      </div>

      <!-- 管理 -->
      <div class="manage-section card">
        <button class="btn-edit" @click="goEdit">✏️ 编辑任务</button>
        <button class="btn-delete" @click="showDeleteConfirm = true">🗑️ 取消任务</button>
      </div>

      <!-- 删除确认 -->
      <div v-if="showDeleteConfirm" class="confirm-overlay" @click.self="showDeleteConfirm = false">
        <div class="confirm-card">
          <p class="confirm-title">确认取消？</p>
          <p class="confirm-text">取消后该任务将不再展示。</p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="showDeleteConfirm = false">再想想</button>
            <button class="btn-danger" @click="handleDelete">确认取消</button>
          </div>
        </div>
      </div>

      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        <button class="btn-outline" :class="{ faved: isFav }" @click="toggleFav">
          {{ isFav ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
        <button v-if="item.status === 'open'" class="btn-primary">🤝 我要接单</button>
        <button v-else-if="item.status === 'in_progress'" class="btn-primary" style="background: #409eff">
          ✅ 标记完成
        </button>
        <button v-else class="btn-primary" disabled>已完成</button>
      </div>
    </template>

    <div v-else class="not-found">
      <p>任务不存在或已被取消</p>
      <button class="btn-primary" @click="router.push('/errand')">返回跑腿委托</button>
    </div>
  </div>
</template>

<style scoped>
.detail-view { padding-bottom: 80px; }
.loading-state { text-align: center; padding: 80px 0; color: var(--color-text-light); }

.header-area {
  height: 200px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  margin: -20px -16px 16px; color: #fff;
}
.header-area.open { background: linear-gradient(135deg, #e8f8ef 0%, #7ed6a0 100%); }
.header-area.in_progress { background: linear-gradient(135deg, #e8f0fe 0%, #90b8f8 100%); }
.header-area.done { background: linear-gradient(135deg, #f0f0f0 0%, #c0c4cc 100%); }
.header-icon { font-size: 48px; }
.header-type { font-size: var(--font-lg); font-weight: 600; margin-top: 8px; }
.header-status { font-size: var(--font-sm); opacity: 0.85; margin-top: 4px; }
.back-btn {
  position: absolute; top: 16px; left: 16px;
  background: rgba(255,255,255,0.85); border-radius: 20px; padding: 6px 14px;
  font-size: var(--font-sm); color: var(--color-text); cursor: pointer; border: none;
}

.card { margin-bottom: 12px; }

.title-row {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 10px; margin-bottom: 12px;
}
.title { font-size: var(--font-lg); font-weight: 600; flex: 1; line-height: 1.4; }
.urgency-badge {
  font-size: var(--font-xs); padding: 3px 10px; border-radius: 10px; font-weight: 500; white-space: nowrap;
}
.urgency-badge.low { background: #e8f8ef; color: #07c160; }
.urgency-badge.medium { background: #fef5e7; color: #e6a23c; }
.urgency-badge.high { background: #fde8ec; color: #f56c6c; }

/* 报酬 */
.reward-banner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; background: #fef5e7; border-radius: 8px; margin-bottom: 14px;
}
.reward-label { font-size: var(--font-sm); color: #b88230; }
.reward-amount { font-size: 24px; font-weight: 700; color: #e6a23c; }

/* 路线 */
.route-section { margin-bottom: 14px; }
.route-point { display: flex; align-items: flex-start; gap: 10px; }
.route-dot {
  width: 12px; height: 12px; border-radius: 50%; margin-top: 4px; flex-shrink: 0;
}
.route-dot.start { background: var(--color-primary); }
.route-dot.end { background: var(--color-danger); }
.route-line {
  width: 2px; height: 24px; background: #e4e7ed; margin-left: 5px;
}
.route-info { display: flex; flex-direction: column; gap: 1px; }
.route-label { font-size: var(--font-xs); color: var(--color-text-light); }
.route-location { font-size: var(--font-sm); font-weight: 500; color: var(--color-text); }

.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: var(--font-xs); color: var(--color-text-light); }
.meta-value { font-size: var(--font-sm); color: var(--color-text); }
.meta-value.expired { color: var(--color-danger); font-weight: 500; }

h3 { font-size: var(--font-md); font-weight: 600; margin-bottom: 10px; }

/* 标签 */
.tags-row { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  font-size: var(--font-xs); background: #fde8ec; color: #f56c6c;
  padding: 4px 12px; border-radius: 14px;
}

/* 描述 */
.desc-text { font-size: var(--font-sm); color: var(--color-text-secondary); line-height: 1.8; white-space: pre-wrap; }

/* 联系 */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: var(--font-xs); color: var(--color-text-light); }
.info-value { font-size: var(--font-sm); color: var(--color-text); }
.info-value.acceptor { color: var(--color-primary); font-weight: 500; }
.info-value.pending { color: #e6a23c; }

/* 管理 */
.manage-section { display: flex; gap: 10px; }
.btn-edit, .btn-delete {
  flex: 1; padding: 10px; border-radius: 8px; font-size: var(--font-sm);
  cursor: pointer; border: 1px solid var(--color-border); background: var(--color-card); text-align: center;
}
.btn-edit:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn-delete:hover { border-color: var(--color-danger); color: var(--color-danger); }

.confirm-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.confirm-card { background: #fff; border-radius: 12px; padding: 24px; width: 300px; text-align: center; }
.confirm-title { font-size: var(--font-lg); font-weight: 600; margin-bottom: 8px; }
.confirm-text { font-size: var(--font-sm); color: var(--color-text-secondary); margin-bottom: 20px; }
.confirm-actions { display: flex; gap: 10px; }
.btn-cancel { flex: 1; padding: 10px; border-radius: 8px; font-size: var(--font-sm); cursor: pointer; background: #f0f0f0; color: var(--color-text-secondary); border: none; }
.btn-danger { flex: 1; padding: 10px; border-radius: 8px; font-size: var(--font-sm); cursor: pointer; background: var(--color-danger); color: #fff; border: none; }

.bottom-spacer { height: 70px; }
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  max-width: var(--max-width); margin: 0 auto;
  display: flex; gap: 10px; padding: 12px 16px;
  background: var(--color-card); border-top: 1px solid var(--color-border); z-index: 100;
}
.btn-outline {
  flex: 1; padding: 12px; border-radius: 24px;
  font-size: var(--font-md); background: var(--color-card);
  border: 1px solid var(--color-primary); color: var(--color-primary); cursor: pointer;
  transition: all 0.2s;
}
.btn-outline.faved {
  background: #fff5f5;
  border-color: #f56c6c;
  color: #f56c6c;
}
.btn-primary {
  flex: 2; padding: 12px; border-radius: 24px;
  font-size: var(--font-md); background: var(--color-primary); color: #fff; cursor: pointer; border: none;
}
.btn-primary[disabled] { background: #c0c4cc; cursor: not-allowed; }

.not-found { text-align: center; padding: 80px 16px; color: var(--color-text-light); }
.not-found .btn-primary { margin-top: 16px; padding: 10px 32px; }
</style>

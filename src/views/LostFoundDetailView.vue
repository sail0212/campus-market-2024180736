<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLostFoundById, deleteLostFound, type LostFoundItem } from '@/api/lostFound'
import { useFavoriteStore } from '@/stores/favorite'
import { formatTime, formatDateTime, statusLabel } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()

const item = ref<LostFoundItem | null>(null)
const loading = ref(true)
const showDeleteConfirm = ref(false)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    const res = await getLostFoundById(id.value)
    item.value = res.data
  } catch (e) {
    console.error('获取失物招领详情失败', e)
  } finally {
    loading.value = false
  }
})

function goBack() { router.back() }

function goEdit() {
  if (item.value) {
    router.push({ path: '/publish', query: { type: 'lostFound', edit: String(item.value.id) } })
  }
}

async function handleDelete() {
  if (!item.value) return
  try {
    await deleteLostFound(item.value.id)
    router.push('/lost-found')
  } catch (e) {
    console.error('删除失败', e)
    alert('删除失败，请重试')
  }
}

const timeline = computed(() => {
  if (!item.value) return []
  const steps = [
    { label: '发布信息', time: item.value.publishTime, done: true },
  ]
  if (item.value.status === 'closed' || item.value.resolvedAt) {
    steps.push({ label: '已解决', time: item.value.resolvedAt!, done: true })
  }
  return steps
})

const isFav = computed(() => item.value ? favoriteStore.isFavorited(item.value.id, 'lostFound') : false)

function toggleFav() {
  if (item.value) {
    favoriteStore.toggleFavorite(item.value.id, 'lostFound', item.value.title)
  }
}
</script>

<template>
  <div class="detail-view">
    <div v-if="loading" class="loading-state">加载中…</div>

    <template v-else-if="item">
      <!-- 头部区域 -->
      <div class="header-area" :class="item.type">
        <button class="back-btn" @click="goBack">← 返回</button>
        <span class="header-icon">🔍</span>
        <span class="header-type">{{ item.type === 'lost' ? '寻物启事' : '招领启事' }}</span>
      </div>

      <!-- 基本信息 -->
      <div class="info-section card">
        <div class="title-row">
          <h1 class="title">{{ item.title }}</h1>
          <span class="status-badge" :class="item.status">{{ statusLabel(item.status) }}</span>
        </div>
        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">物品名称</span>
            <span class="meta-value">{{ item.itemName }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">分类</span>
            <span class="meta-value">{{ item.category }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">地点</span>
            <span class="meta-value">📍 {{ item.location }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">时间</span>
            <span class="meta-value">{{ formatDateTime(item.eventTime) }}</span>
          </div>
        </div>
        <div v-if="item.reward" class="reward-banner">
          💰 悬赏金：<strong>¥{{ item.reward }}</strong>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="item.tags.length > 0" class="tags-section card">
        <div class="tags-row">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- 物品描述 -->
      <div class="desc-section card">
        <h3>详细描述</h3>
        <p class="desc-text">{{ item.desc }}</p>
      </div>

      <!-- 联系/认领信息 -->
      <div class="contact-section card">
        <h3>{{ item.type === 'lost' ? '联系方式' : '认领信息' }}</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ item.type === 'lost' ? '联系人' : '拾到者' }}</span>
            <span class="info-value">{{ item.type === 'lost' ? item.contact : (item.finder || item.contact) }}</span>
          </div>
          <div class="info-item" v-if="item.contactPhone">
            <span class="info-label">联系电话</span>
            <span class="info-value">{{ item.contactPhone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ item.type === 'lost' ? '认领地点' : '存放地点' }}</span>
            <span class="info-value">{{ item.claimLocation }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发布时间</span>
            <span class="info-value">{{ formatTime(item.publishTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 状态时间线 -->
      <div v-if="timeline.length > 0" class="timeline-section card">
        <h3>处理进度</h3>
        <div class="timeline">
          <div v-for="(step, i) in timeline" :key="i" class="tl-step" :class="{ done: step.done }">
            <span class="tl-dot"></span>
            <div class="tl-content">
              <span class="tl-label">{{ step.label }}</span>
              <span class="tl-time">{{ formatDateTime(step.time) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 管理按钮 -->
      <div class="manage-section card">
        <button class="btn-edit" @click="goEdit">✏️ 编辑信息</button>
        <button class="btn-delete" @click="showDeleteConfirm = true">🗑️ 删除信息</button>
      </div>

      <!-- 删除确认 -->
      <div v-if="showDeleteConfirm" class="confirm-overlay" @click.self="showDeleteConfirm = false">
        <div class="confirm-card">
          <p class="confirm-title">确认删除？</p>
          <p class="confirm-text">删除后该信息将无法恢复。</p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="showDeleteConfirm = false">取消</button>
            <button class="btn-danger" @click="handleDelete">确认删除</button>
          </div>
        </div>
      </div>

      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        <button class="btn-outline" :class="{ faved: isFav }" @click="toggleFav">
          {{ isFav ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
        <button class="btn-primary">📞 联系TA</button>
      </div>
    </template>

    <div v-else class="not-found">
      <p>信息不存在或已被删除</p>
      <button class="btn-primary" @click="router.push('/lost-found')">返回失物招领</button>
    </div>
  </div>
</template>

<style scoped>
.detail-view { padding-bottom: 80px; }
.loading-state { text-align: center; padding: 80px 0; color: var(--color-text-light); }

.header-area {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  margin: -20px -16px 16px;
  color: #fff;
}
.header-area.lost { background: linear-gradient(135deg, #fde8ec 0%, #fab1b1 100%); }
.header-area.found { background: linear-gradient(135deg, #e8f8ef 0%, #a8e6c1 100%); }
.header-icon { font-size: 48px; }
.header-type { font-size: var(--font-lg); font-weight: 600; margin-top: 8px; }
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
.status-badge {
  font-size: var(--font-xs); padding: 3px 10px; border-radius: 10px; font-weight: 500; white-space: nowrap;
}
.status-badge.open { background: #e8f8ef; color: #07c160; }
.status-badge.closed { background: #f0f0f0; color: #909399; }

.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: var(--font-xs); color: var(--color-text-light); }
.meta-value { font-size: var(--font-sm); color: var(--color-text); }

.reward-banner {
  margin-top: 12px; padding: 10px 14px;
  background: #fef5e7; border-radius: 8px;
  font-size: var(--font-sm); color: #e6a23c;
}

h3 { font-size: var(--font-md); font-weight: 600; margin-bottom: 10px; }

/* 标签 */
.tags-row { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  font-size: var(--font-xs); background: #f0f0f0;
  color: var(--color-text-secondary); padding: 4px 12px; border-radius: 14px;
}

/* 描述 */
.desc-text {
  font-size: var(--font-sm); color: var(--color-text-secondary); line-height: 1.8; white-space: pre-wrap;
}

/* 联系信息 */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: var(--font-xs); color: var(--color-text-light); }
.info-value { font-size: var(--font-sm); color: var(--color-text); }

/* 时间线 */
.timeline { display: flex; flex-direction: column; gap: 0; }
.tl-step {
  display: flex; gap: 12px; padding: 10px 0; position: relative;
  border-left: 2px solid #e4e7ed; margin-left: 7px; padding-left: 20px;
}
.tl-step:last-child { border-left-color: transparent; }
.tl-dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: #e4e7ed; position: absolute; left: -7px; top: 14px;
}
.tl-step.done .tl-dot { background: var(--color-primary); }
.tl-content { display: flex; flex-direction: column; gap: 2px; }
.tl-label { font-size: var(--font-sm); font-weight: 500; }
.tl-time { font-size: var(--font-xs); color: var(--color-text-light); }

/* 管理 */
.manage-section { display: flex; gap: 10px; }
.btn-edit, .btn-delete {
  flex: 1; padding: 10px; border-radius: 8px; font-size: var(--font-sm);
  cursor: pointer; border: 1px solid var(--color-border); background: var(--color-card); text-align: center;
}
.btn-edit:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn-delete:hover { border-color: var(--color-danger); color: var(--color-danger); }

/* 确认弹窗 */
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

.not-found { text-align: center; padding: 80px 16px; color: var(--color-text-light); }
.not-found .btn-primary { margin-top: 16px; padding: 10px 32px; }
</style>

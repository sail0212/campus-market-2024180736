<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGroupBuyById, deleteGroupBuy, type GroupBuyItem } from '@/api/groupBuy'
import { formatTime, formatDateTime, statusLabel, deadlineRemaining } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const item = ref<GroupBuyItem | null>(null)
const loading = ref(true)
const showDeleteConfirm = ref(false)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    const res = await getGroupBuyById(id.value)
    item.value = res.data
  } catch (e) {
    console.error('获取拼单详情失败', e)
  } finally {
    loading.value = false
  }
})

function goBack() { router.back() }

function goEdit() {
  if (item.value) {
    router.push({ path: '/publish', query: { type: 'groupBuy', edit: String(item.value.id) } })
  }
}

async function handleDelete() {
  if (!item.value) return
  try {
    await deleteGroupBuy(item.value.id)
    router.push('/group-buy')
  } catch (e) {
    console.error('删除失败', e)
    alert('删除失败，请重试')
  }
}

const progress = computed(() => {
  if (!item.value) return 0
  return Math.round((item.value.currentCount / item.value.targetCount) * 100)
})

const remaining = computed(() => {
  if (!item.value) return { text: '', expired: false }
  return deadlineRemaining(item.value.deadline)
})

const typeIcon = computed(() => {
  const map: Record<string, string> = { ping: '🛒', dazi: '🤝', team: '👥' }
  return map[item.value?.type || ''] || '📌'
})

const typeName = computed(() => {
  const map: Record<string, string> = { ping: '拼单', dazi: '搭子', team: '组队' }
  return map[item.value?.type || ''] || '拼单'
})
</script>

<template>
  <div class="detail-view">
    <div v-if="loading" class="loading-state">加载中…</div>

    <template v-else-if="item">
      <!-- 头部 -->
      <div class="header-area" :class="item.type">
        <button class="back-btn" @click="goBack">← 返回</button>
        <span class="header-icon">{{ typeIcon }}</span>
        <span class="header-type">{{ typeName }}</span>
      </div>

      <!-- 基本信息 -->
      <div class="info-section card">
        <div class="title-row">
          <h1 class="title">{{ item.title }}</h1>
          <span class="status-badge" :class="item.status">{{ statusLabel(item.status) }}</span>
        </div>

        <!-- 进度条 -->
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-info">
            <span class="progress-text">{{ item.currentCount }}/{{ item.targetCount }} 人</span>
            <span class="progress-desc" v-if="item.status === 'open'">
              还差 {{ item.targetCount - item.currentCount }} 人
            </span>
            <span class="progress-desc closed" v-else>已结束</span>
          </div>
        </div>

        <!-- 小信息 -->
        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">💰 人均</span>
            <span class="meta-value price">{{ item.price === '0' ? '免费' : '¥' + item.price }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">📍 地点</span>
            <span class="meta-value">{{ item.location }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">⏰ 截止</span>
            <span class="meta-value" :class="{ expired: remaining.expired }">
              {{ remaining.text }}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">📅 发布</span>
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

      <!-- 活动描述 -->
      <div class="desc-section card">
        <h3>活动详情</h3>
        <p class="desc-text">{{ item.desc }}</p>
      </div>

      <!-- 加入要求 -->
      <div v-if="item.requirements" class="requirements-section card">
        <h3>加入要求</h3>
        <p class="req-text">{{ item.requirements }}</p>
      </div>

      <!-- 发起人&联系方式 -->
      <div class="contact-section card">
        <h3>发起信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">发起人</span>
            <span class="info-value">👤 {{ item.publisher }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系方式</span>
            <span class="info-value">📞 {{ item.contact }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发布时间</span>
            <span class="info-value">{{ formatDateTime(item.publishTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">更新时间</span>
            <span class="info-value">{{ formatDateTime(item.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 参与成员 -->
      <div v-if="item.participants.length > 0" class="participants-section card">
        <h3>参与成员 ({{ item.participants.length }})</h3>
        <div class="participant-list">
          <div v-for="p in item.participants" :key="p.name" class="participant-item">
            <span class="p-avatar">👤</span>
            <span class="p-name">{{ p.name }}</span>
            <span class="p-time">{{ formatTime(p.joinedAt) }}加入</span>
          </div>
        </div>
      </div>

      <!-- 管理 -->
      <div class="manage-section card">
        <button class="btn-edit" @click="goEdit">✏️ 编辑活动</button>
        <button class="btn-delete" @click="showDeleteConfirm = true">🗑️ 取消活动</button>
      </div>

      <!-- 删除确认 -->
      <div v-if="showDeleteConfirm" class="confirm-overlay" @click.self="showDeleteConfirm = false">
        <div class="confirm-card">
          <p class="confirm-title">确认取消？</p>
          <p class="confirm-text">取消后活动将不再展示，已有参与者将收到通知。</p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="showDeleteConfirm = false">再想想</button>
            <button class="btn-danger" @click="handleDelete">确认取消</button>
          </div>
        </div>
      </div>

      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        <button v-if="item.status === 'open'" class="btn-primary">🙋 我要加入</button>
        <button v-else class="btn-primary" disabled>已结束</button>
      </div>
    </template>

    <div v-else class="not-found">
      <p>活动不存在或已被取消</p>
      <button class="btn-primary" @click="router.push('/group-buy')">返回拼单搭子</button>
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
.header-area.ping { background: linear-gradient(135deg, #fef5e7 0%, #f5c842 100%); }
.header-area.dazi { background: linear-gradient(135deg, #e8f8ef 0%, #7ed6a0 100%); }
.header-area.team { background: linear-gradient(135deg, #e8f0fe 0%, #90b8f8 100%); }
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
  gap: 10px; margin-bottom: 16px;
}
.title { font-size: var(--font-lg); font-weight: 600; flex: 1; line-height: 1.4; }
.status-badge {
  font-size: var(--font-xs); padding: 3px 10px; border-radius: 10px; font-weight: 500; white-space: nowrap;
}
.status-badge.open { background: #e8f8ef; color: #07c160; }
.status-badge.closed { background: #f0f0f0; color: #909399; }

/* 进度条 */
.progress-section { margin-bottom: 14px; }
.progress-bar {
  height: 10px; background: #e4e7ed; border-radius: 5px; overflow: hidden; margin-bottom: 6px;
}
.progress-fill {
  height: 100%; background: var(--color-primary); border-radius: 5px; transition: width 0.3s;
  min-width: 8px;
}
.progress-info { display: flex; justify-content: space-between; }
.progress-text { font-size: var(--font-sm); font-weight: 600; color: var(--color-primary); }
.progress-desc { font-size: var(--font-xs); color: var(--color-text-light); }
.progress-desc.closed { color: #909399; }

.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: var(--font-xs); color: var(--color-text-light); }
.meta-value { font-size: var(--font-sm); color: var(--color-text); }
.meta-value.price { color: var(--color-danger); font-weight: 600; }
.meta-value.expired { color: var(--color-danger); font-weight: 500; }

h3 { font-size: var(--font-md); font-weight: 600; margin-bottom: 10px; }

/* 标签 */
.tags-row { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  font-size: var(--font-xs); background: #e8f0fe; color: #409eff;
  padding: 4px 12px; border-radius: 14px;
}

/* 描述 */
.desc-text { font-size: var(--font-sm); color: var(--color-text-secondary); line-height: 1.8; white-space: pre-wrap; }
.req-text { font-size: var(--font-sm); color: var(--color-text-secondary); line-height: 1.6; }

/* 联系 */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: var(--font-xs); color: var(--color-text-light); }
.info-value { font-size: var(--font-sm); color: var(--color-text); }

/* 参与者 */
.participant-list { display: flex; flex-direction: column; }
.participant-item {
  display: flex; align-items: center; gap: 10px; padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);
}
.participant-item:last-child { border-bottom: none; }
.p-avatar { font-size: 24px; }
.p-name { font-size: var(--font-sm); font-weight: 500; flex: 1; }
.p-time { font-size: var(--font-xs); color: var(--color-text-light); }

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
  display: flex; padding: 12px 16px;
  background: var(--color-card); border-top: 1px solid var(--color-border); z-index: 100;
}
.btn-primary {
  width: 100%; padding: 12px; border-radius: 24px;
  font-size: var(--font-md); background: var(--color-primary); color: #fff; cursor: pointer; border: none;
}
.btn-primary[disabled] { background: #c0c4cc; cursor: not-allowed; }

.not-found { text-align: center; padding: 80px 16px; color: var(--color-text-light); }
.not-found .btn-primary { margin-top: 16px; padding: 10px 32px; }
</style>

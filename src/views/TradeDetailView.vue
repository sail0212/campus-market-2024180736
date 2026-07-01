<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTradeById, deleteTrade, type TradeItem } from '@/api/trade'
import { useFavoriteStore } from '@/stores/favorite'
import { formatTime, formatDateTime, statusLabel } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()

const item = ref<TradeItem | null>(null)
const loading = ref(true)
const showDeleteConfirm = ref(false)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    const res = await getTradeById(id.value)
    item.value = res.data
  } catch (e) {
    console.error('获取交易详情失败', e)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

function goEdit() {
  if (item.value) {
    router.push({ path: '/publish', query: { type: 'trade', edit: String(item.value.id) } })
  }
}

async function handleDelete() {
  if (!item.value) return
  try {
    await deleteTrade(item.value.id)
    router.push('/trade')
  } catch (e) {
    console.error('删除失败', e)
    alert('删除失败，请重试')
  }
}

const specEntries = computed(() => {
  if (!item.value?.specs) return []
  return Object.entries(item.value.specs)
})

const isFav = computed(() => item.value ? favoriteStore.isFavorited(item.value.id, 'trade') : false)

function toggleFav() {
  if (item.value) {
    favoriteStore.toggleFavorite(item.value.id, 'trade', item.value.title)
  }
}
</script>

<template>
  <div class="detail-view">
    <div v-if="loading" class="loading-state">加载中…</div>

    <template v-else-if="item">
      <!-- 图片区域 -->
      <div class="image-area">
        <button class="back-btn" @click="goBack">← 返回</button>
        <span class="img-placeholder">
          {{ item.category === '教材' ? '📚' : item.category === '数码' ? '📱' : item.category === '衣物' ? '👗' : '🏠' }}
        </span>
        <span v-if="item.images.length > 0" class="img-count">{{ item.images.length }}张图片</span>
      </div>

      <!-- 价格与基本信息 -->
      <div class="price-section card">
        <div class="title-row">
          <h1 class="title">{{ item.title }}</h1>
          <span class="status-badge" :class="item.status">{{ statusLabel(item.status) }}</span>
        </div>
        <div class="price-row">
          <span class="price">¥{{ item.price }}</span>
          <span v-if="item.originalPrice" class="original">¥{{ item.originalPrice }}</span>
          <span class="savings" v-if="item.originalPrice">
            省{{ item.originalPrice - item.price }}元
          </span>
          <span class="condition-tag">{{ item.condition }}</span>
        </div>
        <div class="meta-row">
          <span>👀 {{ item.views }} 次浏览</span>
          <span>❤️ {{ item.favorited }} 人收藏</span>
          <span>🕐 {{ formatTime(item.publishTime) }}</span>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="item.tags.length > 0" class="tags-section card">
        <div class="tags-row">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- 规格参数 -->
      <div v-if="specEntries.length > 0" class="specs-section card">
        <h3>规格参数</h3>
        <div class="specs-table">
          <div v-for="[key, val] in specEntries" :key="key" class="spec-row">
            <span class="spec-key">{{ key }}</span>
            <span class="spec-val">{{ val }}</span>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="desc-section card">
        <h3>商品描述</h3>
        <p class="desc-text">{{ item.desc }}</p>
      </div>

      <!-- 交易信息 -->
      <div class="info-section card">
        <h3>交易信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">交易地点</span>
            <span class="info-value">{{ item.tradeLocation || item.location }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所在位置</span>
            <span class="info-value">{{ item.location }}</span>
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

      <!-- 卖家信息 -->
      <div class="seller-section card">
        <h3>卖家信息</h3>
        <div class="seller-info">
          <span class="avatar">👤</span>
          <div class="seller-meta">
            <span class="seller-name">{{ item.publisher }}</span>
            <span class="seller-contact">📞 {{ item.contact }}</span>
            <span class="seller-rate">回复率 98% · 好评率 100%</span>
          </div>
        </div>
      </div>

      <!-- 编辑/删除按钮 -->
      <div class="manage-section card">
        <button class="btn-edit" @click="goEdit">✏️ 编辑商品</button>
        <button class="btn-delete" @click="showDeleteConfirm = true">🗑️ 下架商品</button>
      </div>

      <!-- 删除确认 -->
      <div v-if="showDeleteConfirm" class="confirm-overlay" @click.self="showDeleteConfirm = false">
        <div class="confirm-card">
          <p class="confirm-title">确认下架？</p>
          <p class="confirm-text">下架后该商品将不再公开展示，此操作不可撤销。</p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="showDeleteConfirm = false">取消</button>
            <button class="btn-danger" @click="handleDelete">确认下架</button>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        <button class="btn-outline" :class="{ faved: isFav }" @click="toggleFav">
          {{ isFav ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
        <button class="btn-primary">💬 联系卖家</button>
      </div>
    </template>

    <div v-else class="not-found">
      <p>商品不存在或已被删除</p>
      <button class="btn-primary" @click="router.push('/trade')">返回二手交易</button>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  padding-bottom: 80px;
}

.loading-state {
  text-align: center;
  padding: 80px 0;
  color: var(--color-text-light);
}

.image-area {
  height: 260px;
  background: linear-gradient(135deg, #e8f8ef 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  margin: -20px -16px 16px;
}
.img-placeholder { font-size: 80px; }
.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255,255,255,0.85);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: var(--font-sm);
  color: var(--color-text);
  cursor: pointer;
  border: none;
}
.img-count {
  position: absolute;
  bottom: 12px;
  right: 16px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: var(--font-xs);
  padding: 2px 10px;
  border-radius: 10px;
}

.card { margin-bottom: 12px; }

/* 价格区 */
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}
.title {
  font-size: var(--font-lg);
  font-weight: 600;
  flex: 1;
  line-height: 1.4;
}
.status-badge {
  font-size: var(--font-xs);
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
}
.status-badge.open { background: #e8f8ef; color: #07c160; }
.status-badge.closed { background: #f0f0f0; color: #909399; }

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.price {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
}
.original {
  font-size: var(--font-sm);
  color: var(--color-text-light);
  text-decoration: line-through;
}
.savings {
  font-size: var(--font-xs);
  color: var(--color-danger);
  font-weight: 500;
}
.condition-tag {
  font-size: var(--font-xs);
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: auto;
}
.meta-row {
  display: flex;
  gap: 16px;
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

/* 标签 */
.tags-row { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  font-size: var(--font-xs);
  background: #f0faf4;
  color: var(--color-primary);
  padding: 4px 12px;
  border-radius: 14px;
}

/* 规格 */
h3 { font-size: var(--font-md); font-weight: 600; margin-bottom: 10px; }
.specs-table { display: flex; flex-direction: column; }
.spec-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);
  font-size: var(--font-sm);
}
.spec-row:last-child { border-bottom: none; }
.spec-key { color: var(--color-text-light); width: 80px; flex-shrink: 0; }
.spec-val { color: var(--color-text); }

/* 描述 */
.desc-text {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
  white-space: pre-wrap;
}

/* 交易信息 */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: var(--font-xs); color: var(--color-text-light); }
.info-value { font-size: var(--font-sm); color: var(--color-text); }

/* 卖家 */
.seller-info { display: flex; align-items: center; gap: 12px; }
.avatar { font-size: 44px; }
.seller-meta { display: flex; flex-direction: column; gap: 2px; }
.seller-name { font-weight: 500; font-size: var(--font-md); }
.seller-contact { font-size: var(--font-sm); color: var(--color-primary); }
.seller-rate { font-size: var(--font-xs); color: var(--color-text-light); }

/* 管理按钮 */
.manage-section { display: flex; gap: 10px; }
.btn-edit, .btn-delete {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: var(--font-sm);
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  text-align: center;
  transition: all 0.15s;
}
.btn-edit:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn-delete:hover { border-color: var(--color-danger); color: var(--color-danger); }

/* 确认弹窗 */
.confirm-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.confirm-card {
  background: #fff; border-radius: 12px; padding: 24px;
  width: 300px; text-align: center;
}
.confirm-title { font-size: var(--font-lg); font-weight: 600; margin-bottom: 8px; }
.confirm-text { font-size: var(--font-sm); color: var(--color-text-secondary); margin-bottom: 20px; }
.confirm-actions { display: flex; gap: 10px; }
.btn-cancel, .btn-danger {
  flex: 1; padding: 10px; border-radius: 8px; font-size: var(--font-sm); cursor: pointer; border: none;
}
.btn-cancel { background: #f0f0f0; color: var(--color-text-secondary); }
.btn-danger { background: var(--color-danger); color: #fff; }

/* 底部 */
.bottom-spacer { height: 70px; }
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  max-width: var(--max-width); margin: 0 auto;
  display: flex; gap: 10px; padding: 12px 16px;
  background: var(--color-card); border-top: 1px solid var(--color-border);
  z-index: 100;
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
  font-size: var(--font-md); background: var(--color-primary); color: #fff; cursor: pointer;
}

.not-found { text-align: center; padding: 80px 16px; color: var(--color-text-light); }
.not-found .btn-primary { margin-top: 16px; padding: 10px 32px; }
</style>

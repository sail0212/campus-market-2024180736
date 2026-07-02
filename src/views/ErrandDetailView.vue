<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getErrandById, deleteErrand, type ErrandItem } from '@/api/errand'
import { getComments, createComment, type CommentItem } from '@/api/comment'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'
import { formatTime, formatDateTime, errandStatusLabel, urgencyLabel, deadlineRemaining } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const item = ref<ErrandItem | null>(null)
const loading = ref(true)
const showDeleteConfirm = ref(false)
const showContact = ref(false)
const showAcceptToast = ref(false)
const currentImageIdx = ref(0)

// Comments
const comments = ref<CommentItem[]>([])
const newComment = ref('')
const submittingComment = ref(false)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    const [res, commentRes] = await Promise.all([
      getErrandById(id.value),
      getComments('errand', id.value),
    ])
    item.value = res.data
    comments.value = commentRes.data
  } catch (e) { console.error('获取跑腿详情失败', e) }
  finally { loading.value = false }
})

function prevImage() {
  if (!item.value || item.value.images.length === 0) return
  currentImageIdx.value = (currentImageIdx.value - 1 + item.value.images.length) % item.value.images.length
}
function nextImage() {
  if (!item.value || item.value.images.length === 0) return
  currentImageIdx.value = (currentImageIdx.value + 1) % item.value.images.length
}

async function submitComment() {
  if (!newComment.value.trim() || !item.value) return
  submittingComment.value = true
  try {
    const res = await createComment({
      itemType: 'errand', itemId: item.value.id,
      author: userStore.user.name || '匿名用户', content: newComment.value.trim(),
    })
    comments.value.push(res.data)
    newComment.value = ''
  } catch (e) { console.error('评论失败', e) }
  finally { submittingComment.value = false }
}

function goEdit() {
  if (item.value) router.push({ path: '/publish', query: { type: 'errand', edit: String(item.value.id) } })
}
async function handleDelete() {
  if (!item.value) return
  try { await deleteErrand(item.value.id); router.push('/errand') }
  catch (e) { console.error('删除失败', e); alert('删除失败，请重试') }
}

function handleAccept() {
  if (!item.value || item.value.status !== 'open') return
  item.value.status = 'in_progress'
  item.value.acceptor = userStore.user.name
  showAcceptToast.value = true
  setTimeout(() => { showAcceptToast.value = false }, 2000)
}

function handleComplete() {
  if (!item.value || item.value.status !== 'in_progress') return
  item.value.status = 'done'
  item.value.completedAt = new Date().toISOString()
}

const remaining = computed(() => {
  if (!item.value) return { text: '', expired: false }
  return deadlineRemaining(item.value.deadline)
})
const taskIcon = computed(() => ({ '代买': '🛒', '代办': '📋', '代取': '📦', '代送': '🚀' } as Record<string,string>)[item.value?.taskType || ''] || '📌')
const urgencyClass = computed(() => item.value?.urgency || 'low')
const isFav = computed(() => item.value ? favoriteStore.isFavorited(item.value.id, 'errand') : false)
function toggleFav() { if (item.value) favoriteStore.toggleFavorite(item.value.id, 'errand', item.value.title) }
const creditScore = computed(() => +(Math.min(5.0, (item.value?.publisher || '').length * 0.2 + 4.1)).toFixed(1))
</script>

<template>
  <div class="detail-view">
    <div v-if="loading" class="loading-state">加载中…</div>
    <template v-else-if="item">
      <!-- 头部/图片 -->
      <div class="header-area" :class="item.status">
        <button class="share-btn" title="分享">🔗</button>
        <template v-if="item.images.length > 0">
          <div class="carousel">
            <button v-if="item.images.length > 1" class="carousel-btn prev" @click.stop="prevImage">‹</button>
            <img :src="item.images[currentImageIdx]" :alt="item.title" class="carousel-img" />
            <button v-if="item.images.length > 1" class="carousel-btn next" @click.stop="nextImage">›</button>
          </div>
          <div class="carousel-dots" v-if="item.images.length > 1"><span v-for="(img,i) in item.images" :key="i" class="dot" :class="{active:i===currentImageIdx}" @click="currentImageIdx=i"></span></div>
          <span class="img-count">{{ currentImageIdx + 1 }}/{{ item.images.length }}</span>
        </template>
        <template v-else>
          <span class="header-icon">{{ taskIcon }}</span>
          <span class="header-type">{{ item.taskType }}</span>
          <span class="header-status">{{ errandStatusLabel(item.status) }}</span>
        </template>
      </div>

      <!-- 基本信息 -->
      <div class="info-section card">
        <div class="title-row"><h1 class="title">{{ item.title }}</h1><span class="urgency-badge" :class="urgencyClass">{{ urgencyLabel(item.urgency) }}</span></div>
        <div class="reward-banner"><span class="reward-label">💰 委托报酬</span><span class="reward-amount">¥{{ item.reward }}</span></div>
        <div class="route-section">
          <div class="route-point from"><span class="route-dot start"></span><div class="route-info"><span class="route-label">取件/出发</span><span class="route-location">{{ item.from }}</span></div></div>
          <div class="route-line"></div>
          <div class="route-point to"><span class="route-dot end"></span><div class="route-info"><span class="route-label">送达/目的地</span><span class="route-location">{{ item.to }}</span></div></div>
        </div>
        <div class="meta-grid">
          <div class="meta-item"><span class="meta-label">📂 分类</span><span class="meta-value">{{ item.category }}</span></div>
          <div class="meta-item"><span class="meta-label">⏰ 截止时间</span><span class="meta-value" :class="{ expired: remaining.expired }">{{ formatDateTime(item.deadline) }}</span></div>
          <div class="meta-item"><span class="meta-label">🕐 剩余</span><span class="meta-value" :class="{ expired: remaining.expired }">{{ remaining.text }}</span></div>
          <div class="meta-item"><span class="meta-label">📅 发布时间</span><span class="meta-value">{{ formatTime(item.publishTime) }}</span></div>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="item.tags.length > 0" class="tags-section card"><div class="tags-row"><span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span></div></div>

      <!-- 描述 -->
      <div class="desc-section card"><h3>任务详情</h3><p class="desc-text">{{ item.desc }}</p></div>

      <!-- 发布者/接单信息 -->
      <div class="seller-section card">
        <h3>发布者信息</h3>
        <div class="seller-info">
          <span class="avatar">👤</span>
          <div class="seller-meta">
            <div class="seller-name-row"><span class="seller-name">{{ item.publisher }}</span><span class="credit-badge">⭐ {{ creditScore }}</span></div>
            <span class="seller-contact">📞 {{ item.contact }}</span>
            <span class="seller-rate">{{ item.status === 'open' ? '⏳ 等待接单' : item.status === 'in_progress' ? '🏃 ' + (item.acceptor || '') + ' 已接单' : '✅ 已完成' }}</span>
          </div>
        </div>
        <div v-if="item.completedAt" class="completed-info"><span>完成时间：{{ formatDateTime(item.completedAt) }}</span></div>
      </div>

      <!-- 留言 -->
      <div class="comments-section card">
        <h3>任务讨论 ({{ comments.length }})</h3>
        <div v-if="comments.length > 0" class="comment-list">
          <div v-for="c in comments" :key="c.id" class="comment-item">
            <span class="comment-avatar">👤</span>
            <div class="comment-body"><div class="comment-top"><span class="comment-author">{{ c.author }}</span><span class="comment-time">{{ formatTime(c.time) }}</span></div><p class="comment-content">{{ c.content }}</p></div>
          </div>
        </div>
        <div v-else class="no-comments">暂无讨论</div>
        <div class="comment-form"><input v-model="newComment" placeholder="写下你的留言…" maxlength="200" @keyup.enter="submitComment" /><button class="comment-submit" :disabled="!newComment.trim() || submittingComment" @click="submitComment">{{ submittingComment ? '发送中' : '发送' }}</button></div>
      </div>

      <!-- 管理 -->
      <div class="manage-section card"><button class="btn-edit" @click="goEdit">✏️ 编辑任务</button><button class="btn-delete" @click="showDeleteConfirm = true">🗑️ 取消任务</button></div>
      <div class="report-section"><span class="report-link">⚠️ 举报此任务</span></div>

      <!-- 弹窗 -->
      <div v-if="showDeleteConfirm" class="confirm-overlay" @click.self="showDeleteConfirm = false"><div class="confirm-card"><p class="confirm-title">确认取消？</p><p class="confirm-text">取消后该任务将不再展示。</p><div class="confirm-actions"><button class="btn-cancel" @click="showDeleteConfirm = false">再想想</button><button class="btn-danger" @click="handleDelete">确认取消</button></div></div></div>
      <div v-if="showContact" class="confirm-overlay" @click.self="showContact = false"><div class="contact-modal"><p class="contact-modal-title">📞 联系发布者</p><div class="contact-info-card"><div class="contact-row"><span class="contact-label">发布者</span><span class="contact-value">{{ item.publisher }}</span></div><div class="contact-row"><span class="contact-label">联系方式</span><span class="contact-value contact-highlight">{{ item.contact }}</span></div></div><p class="contact-tip">💡 接单前建议先沟通清楚任务细节</p><button class="btn-primary" style="width:100%;margin-top:12px" @click="showContact = false">知道了</button></div></div>

      <div v-if="showAcceptToast" class="join-toast">✅ 接单成功！请及时完成任务</div>

      <!-- 底部 -->
      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        <button class="btn-outline" :class="{ faved: isFav }" @click="toggleFav">{{ isFav ? '❤️ 已收藏' : '🤍 收藏' }}</button>
        <button v-if="item.status === 'open'" class="btn-primary" @click="handleAccept">🤝 我要接单</button>
        <button v-else-if="item.status === 'in_progress'" class="btn-primary" style="background: #409eff" @click="handleComplete">✅ 标记完成</button>
        <button v-else class="btn-primary" disabled>已完成</button>
      </div>
    </template>
    <div v-else class="not-found"><p>任务不存在或已被取消</p><button class="btn-primary" @click="router.push('/errand')">返回跑腿委托</button></div>
  </div>
</template>

<style scoped>
.detail-view { padding-bottom: 80px; }
.loading-state { text-align: center; padding: 80px 0; color: var(--color-text-light); }

.header-area { height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; border-radius: 0 0 var(--radius-lg) var(--radius-lg); margin: -20px -16px 16px; color: #fff; overflow: hidden; }
.header-area.open { background: linear-gradient(135deg, #e8f8ef 0%, #7ed6a0 100%); }
.header-area.in_progress { background: linear-gradient(135deg, #e8f0fe 0%, #90b8f8 100%); }
.header-area.done { background: linear-gradient(135deg, #f0f0f0 0%, #c0c4cc 100%); }
.header-icon { font-size: 48px; } .header-type { font-size: var(--font-lg); font-weight: 600; margin-top: 8px; }
.header-status { font-size: var(--font-sm); opacity: 0.85; margin-top: 4px; }
.share-btn { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.85); border-radius: 20px; padding: 6px 10px; font-size: var(--font-sm); cursor: pointer; border: none; z-index: 2; }

.carousel { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
.carousel-img { width: 100%; height: 100%; object-fit: cover; }
.carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.7); border: none; font-size: 24px; color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; }
.carousel-btn.prev { left: 8px; } .carousel-btn.next { right: 8px; }
.carousel-dots { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; }
.dot.active { background: #fff; transform: scale(1.3); }
.img-count { position: absolute; bottom: 8px; right: 16px; background: rgba(0,0,0,0.5); color: #fff; font-size: var(--font-xs); padding: 2px 10px; border-radius: 10px; z-index: 2; }

.card { margin-bottom: 12px; } h3 { font-size: var(--font-md); font-weight: 600; margin-bottom: 10px; }
.title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
.title { font-size: var(--font-lg); font-weight: 600; flex: 1; line-height: 1.4; }
.urgency-badge { font-size: var(--font-xs); padding: 3px 10px; border-radius: 10px; font-weight: 500; white-space: nowrap; }
.urgency-badge.low { background: #e8f8ef; color: #07c160; } .urgency-badge.medium { background: #fef5e7; color: #e6a23c; } .urgency-badge.high { background: #fde8ec; color: #f56c6c; }

.reward-banner { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #fef5e7; border-radius: 8px; margin-bottom: 14px; }
.reward-label { font-size: var(--font-sm); color: #b88230; }
.reward-amount { font-size: 24px; font-weight: 700; color: #e6a23c; }

.route-section { margin-bottom: 14px; }
.route-point { display: flex; align-items: flex-start; gap: 10px; }
.route-dot { width: 12px; height: 12px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.route-dot.start { background: var(--color-primary); } .route-dot.end { background: var(--color-danger); }
.route-line { width: 2px; height: 24px; background: #e4e7ed; margin-left: 5px; }
.route-info { display: flex; flex-direction: column; gap: 1px; }
.route-label { font-size: var(--font-xs); color: var(--color-text-light); }
.route-location { font-size: var(--font-sm); font-weight: 500; color: var(--color-text); }

.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: var(--font-xs); color: var(--color-text-light); }
.meta-value { font-size: var(--font-sm); color: var(--color-text); }
.meta-value.expired { color: var(--color-danger); font-weight: 500; }

.tags-row { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { font-size: var(--font-xs); background: #fde8ec; color: #f56c6c; padding: 4px 12px; border-radius: 14px; }

.desc-text { font-size: var(--font-sm); color: var(--color-text-secondary); line-height: 1.8; white-space: pre-wrap; }

.seller-info { display: flex; align-items: center; gap: 12px; }
.avatar { font-size: 44px; } .seller-meta { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.seller-name-row { display: flex; align-items: center; gap: 8px; }
.seller-name { font-weight: 500; font-size: var(--font-md); }
.credit-badge { font-size: var(--font-xs); background: #fef5e7; color: #e6a23c; padding: 2px 8px; border-radius: 8px; }
.seller-contact { font-size: var(--font-sm); color: var(--color-primary); }
.seller-rate { font-size: var(--font-xs); color: var(--color-text-light); }
.completed-info { margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--color-border-light); font-size: var(--font-xs); color: var(--color-text-light); }

/* comments */
.comment-list { display: flex; flex-direction: column; }
.comment-item { display: flex; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--color-border-light); }
.comment-item:last-child { border-bottom: none; }
.comment-avatar { font-size: 28px; flex-shrink: 0; } .comment-body { flex: 1; min-width: 0; }
.comment-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
.comment-author { font-size: var(--font-sm); font-weight: 500; }
.comment-time { font-size: var(--font-xs); color: var(--color-text-light); }
.comment-content { font-size: var(--font-sm); color: var(--color-text-secondary); line-height: 1.5; }
.no-comments { text-align: center; padding: 16px; color: var(--color-text-light); font-size: var(--font-sm); }
.comment-form { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-border-light); }
.comment-form input { flex: 1; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: 20px; font-size: var(--font-sm); background: var(--color-bg); }
.comment-submit { padding: 10px 18px; border-radius: 20px; background: var(--color-primary); color: #fff; font-size: var(--font-sm); cursor: pointer; border: none; white-space: nowrap; }
.comment-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.manage-section { display: flex; gap: 10px; }
.btn-edit, .btn-delete { flex: 1; padding: 10px; border-radius: 8px; font-size: var(--font-sm); cursor: pointer; border: 1px solid var(--color-border); background: var(--color-card); text-align: center; }
.btn-edit:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn-delete:hover { border-color: var(--color-danger); color: var(--color-danger); }
.report-section { text-align: center; padding: 8px 0; }
.report-link { font-size: var(--font-xs); color: var(--color-text-light); cursor: pointer; }
.report-link:hover { color: var(--color-danger); }

.confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; }
.confirm-card { background: #fff; border-radius: 12px; padding: 24px; width: 300px; text-align: center; }
.confirm-title { font-size: var(--font-lg); font-weight: 600; margin-bottom: 8px; }
.confirm-text { font-size: var(--font-sm); color: var(--color-text-secondary); margin-bottom: 20px; }
.confirm-actions { display: flex; gap: 10px; }
.btn-cancel { flex: 1; padding: 10px; border-radius: 8px; background: #f0f0f0; color: var(--color-text-secondary); cursor: pointer; border: none; }
.btn-danger { flex: 1; padding: 10px; border-radius: 8px; background: var(--color-danger); color: #fff; cursor: pointer; border: none; }

.contact-modal { background: #fff; border-radius: 12px; padding: 24px; width: 340px; text-align: center; }
.contact-modal-title { font-size: var(--font-lg); font-weight: 600; margin-bottom: 16px; }
.contact-info-card { background: var(--color-bg); border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.contact-row { display: flex; justify-content: space-between; align-items: center; }
.contact-label { font-size: var(--font-sm); color: var(--color-text-light); }
.contact-value { font-size: var(--font-sm); color: var(--color-text); font-weight: 500; }
.contact-highlight { color: var(--color-primary); font-size: var(--font-md); }
.contact-tip { margin-top: 12px; font-size: var(--font-xs); color: var(--color-text-light); }

.join-toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #07c160; color: #fff; padding: 14px 28px; border-radius: 24px; font-size: var(--font-md); font-weight: 600; z-index: 300; box-shadow: 0 4px 20px rgba(7,193,96,0.4); }

.bottom-spacer { height: 70px; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; max-width: var(--max-width); margin: 0 auto; display: flex; gap: 10px; padding: 12px 16px; background: var(--color-card); border-top: 1px solid var(--color-border); z-index: 100; }
.btn-outline { flex: 1; padding: 12px; border-radius: 24px; font-size: var(--font-md); background: var(--color-card); border: 1px solid var(--color-primary); color: var(--color-primary); cursor: pointer; }
.btn-outline.faved { background: #fff5f5; border-color: #f56c6c; color: #f56c6c; }
.btn-primary { flex: 2; padding: 12px; border-radius: 24px; font-size: var(--font-md); background: var(--color-primary); color: #fff; cursor: pointer; border: none; }
.btn-primary[disabled] { background: #c0c4cc; cursor: not-allowed; }

.not-found { text-align: center; padding: 80px 16px; color: var(--color-text-light); }
.not-found .btn-primary { margin-top: 16px; padding: 10px 32px; }
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLostFoundById, deleteLostFound, type LostFoundItem } from '@/api/lostFound'
import { getComments, createComment, type CommentItem } from '@/api/comment'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'
import { formatTime, formatDateTime, statusLabel } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const item = ref<LostFoundItem | null>(null)
const loading = ref(true)
const showDeleteConfirm = ref(false)
const showContact = ref(false)
const currentImageIdx = ref(0)

// Comments
const comments = ref<CommentItem[]>([])
const newComment = ref('')
const submittingComment = ref(false)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    const [res, commentRes] = await Promise.all([
      getLostFoundById(id.value),
      getComments('lostFound', id.value),
    ])
    item.value = res.data
    comments.value = commentRes.data
  } catch (e) {
    console.error('获取失物招领详情失败', e)
  } finally {
    loading.value = false
  }
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
      itemType: 'lostFound', itemId: item.value.id,
      author: userStore.user.name || '匿名用户', content: newComment.value.trim(),
    })
    comments.value.push(res.data)
    newComment.value = ''
  } catch (e) { console.error('评论失败', e) }
  finally { submittingComment.value = false }
}

function goBack() { router.back() }
function goEdit() {
  if (item.value) router.push({ path: '/publish', query: { type: 'lostFound', edit: String(item.value.id) } })
}
async function handleDelete() {
  if (!item.value) return
  try { await deleteLostFound(item.value.id); router.push('/lost-found') }
  catch (e) { console.error('删除失败', e); alert('删除失败，请重试') }
}

const isFav = computed(() => item.value ? favoriteStore.isFavorited(item.value.id, 'lostFound') : false)
function toggleFav() {
  if (item.value) favoriteStore.toggleFavorite(item.value.id, 'lostFound', item.value.title)
}

const timeline = computed(() => {
  if (!item.value) return []
  const steps = [{ label: '发布信息', time: item.value.publishTime, done: true }]
  if (item.value.status === 'closed' || item.value.resolvedAt)
    steps.push({ label: '已解决', time: item.value.resolvedAt!, done: true })
  return steps
})

const creditScore = computed(() => +(Math.min(5.0, (item.value?.contact || '').length * 0.2 + 3.8)).toFixed(1))
</script>

<template>
  <div class="detail-view">
    <div v-if="loading" class="loading-state">加载中…</div>

    <template v-else-if="item">
      <!-- 图片轮播 / 头部 -->
      <div class="header-area" :class="item.type">
        <button class="back-btn" @click="goBack">← 返回</button>
        <button class="share-btn" title="分享">🔗</button>
        <template v-if="item.images.length > 0">
          <div class="carousel">
            <button v-if="item.images.length > 1" class="carousel-btn prev" @click.stop="prevImage">‹</button>
            <img :src="item.images[currentImageIdx]" :alt="item.title" class="carousel-img" />
            <button v-if="item.images.length > 1" class="carousel-btn next" @click.stop="nextImage">›</button>
          </div>
          <div class="carousel-dots" v-if="item.images.length > 1">
            <span v-for="(img, i) in item.images" :key="i" class="dot" :class="{ active: i === currentImageIdx }" @click="currentImageIdx = i"></span>
          </div>
          <span class="img-count">{{ currentImageIdx + 1 }}/{{ item.images.length }}</span>
        </template>
        <template v-else>
          <span class="header-icon">🔍</span>
          <span class="header-type">{{ item.type === 'lost' ? '寻物启事' : '招领启事' }}</span>
        </template>
      </div>

      <!-- 基本信息 -->
      <div class="info-section card">
        <div class="title-row">
          <h1 class="title">{{ item.title }}</h1>
          <span class="status-badge" :class="item.status">{{ statusLabel(item.status) }}</span>
        </div>
        <div class="meta-grid">
          <div class="meta-item"><span class="meta-label">物品名称</span><span class="meta-value">{{ item.itemName }}</span></div>
          <div class="meta-item"><span class="meta-label">分类</span><span class="meta-value">{{ item.category }}</span></div>
          <div class="meta-item"><span class="meta-label">地点</span><span class="meta-value">📍 {{ item.location }}</span></div>
          <div class="meta-item"><span class="meta-label">时间</span><span class="meta-value">{{ formatDateTime(item.eventTime) }}</span></div>
        </div>
        <div v-if="item.reward" class="reward-banner">💰 悬赏金：<strong>¥{{ item.reward }}</strong></div>
      </div>

      <!-- 标签 -->
      <div v-if="item.tags.length > 0" class="tags-section card">
        <div class="tags-row"><span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span></div>
      </div>

      <!-- 描述 -->
      <div class="desc-section card"><h3>详细描述</h3><p class="desc-text">{{ item.desc }}</p></div>

      <!-- 联系/认领信息 -->
      <div class="contact-section card">
        <h3>{{ item.type === 'lost' ? '联系方式' : '认领信息' }}</h3>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">{{ item.type === 'lost' ? '联系人' : '拾到者' }}</span><span class="info-value">{{ item.type === 'lost' ? item.contact : (item.finder || item.contact) }}</span></div>
          <div class="info-item" v-if="item.contactPhone"><span class="info-label">联系电话</span><span class="info-value">{{ item.contactPhone }}</span></div>
          <div class="info-item"><span class="info-label">{{ item.type === 'lost' ? '认领地点' : '存放地点' }}</span><span class="info-value">{{ item.claimLocation }}</span></div>
          <div class="info-item"><span class="info-label">发布时间</span><span class="info-value">{{ formatTime(item.publishTime) }}</span></div>
        </div>
      </div>

      <!-- 发布者信息 -->
      <div class="seller-section card">
        <h3>发布者</h3>
        <div class="seller-info">
          <span class="avatar">👤</span>
          <div class="seller-meta">
            <div class="seller-name-row"><span class="seller-name">{{ item.contact }}</span><span class="credit-badge">⭐ {{ creditScore }}</span></div>
            <span class="seller-contact">📞 {{ item.contactPhone || item.contact }}</span>
            <span class="seller-rate">{{ item.type === 'found' ? '拾金不昧 值得信赖' : '失主急寻 请多帮忙' }}</span>
          </div>
        </div>
      </div>

      <!-- 进度时间线 -->
      <div v-if="timeline.length > 0" class="timeline-section card">
        <h3>处理进度</h3>
        <div class="timeline">
          <div v-for="(step, i) in timeline" :key="i" class="tl-step" :class="{ done: step.done }">
            <span class="tl-dot"></span>
            <div class="tl-content"><span class="tl-label">{{ step.label }}</span><span class="tl-time">{{ formatDateTime(step.time) }}</span></div>
          </div>
        </div>
      </div>

      <!-- 留言 -->
      <div class="comments-section card">
        <h3>留言咨询 ({{ comments.length }})</h3>
        <div v-if="comments.length > 0" class="comment-list">
          <div v-for="c in comments" :key="c.id" class="comment-item">
            <span class="comment-avatar">👤</span>
            <div class="comment-body">
              <div class="comment-top"><span class="comment-author">{{ c.author }}</span><span class="comment-time">{{ formatTime(c.time) }}</span></div>
              <p class="comment-content">{{ c.content }}</p>
            </div>
          </div>
        </div>
        <div v-else class="no-comments">暂无留言</div>
        <div class="comment-form">
          <input v-model="newComment" placeholder="写下你的留言…" maxlength="200" @keyup.enter="submitComment" />
          <button class="comment-submit" :disabled="!newComment.trim() || submittingComment" @click="submitComment">{{ submittingComment ? '发送中' : '发送' }}</button>
        </div>
      </div>

      <!-- 管理 -->
      <div class="manage-section card">
        <button class="btn-edit" @click="goEdit">✏️ 编辑信息</button>
        <button class="btn-delete" @click="showDeleteConfirm = true">🗑️ 删除信息</button>
      </div>
      <div class="report-section"><span class="report-link">⚠️ 举报此信息</span></div>

      <!-- 删除确认 -->
      <div v-if="showDeleteConfirm" class="confirm-overlay" @click.self="showDeleteConfirm = false">
        <div class="confirm-card">
          <p class="confirm-title">确认删除？</p><p class="confirm-text">删除后该信息将无法恢复。</p>
          <div class="confirm-actions"><button class="btn-cancel" @click="showDeleteConfirm = false">取消</button><button class="btn-danger" @click="handleDelete">确认删除</button></div>
        </div>
      </div>

      <!-- 联系弹窗 -->
      <div v-if="showContact" class="confirm-overlay" @click.self="showContact = false">
        <div class="contact-modal">
          <p class="contact-modal-title">📞 联系TA</p>
          <div class="contact-info-card">
            <div class="contact-row"><span class="contact-label">联系人</span><span class="contact-value">{{ item.contact }}</span></div>
            <div class="contact-row" v-if="item.contactPhone"><span class="contact-label">电话</span><span class="contact-value contact-highlight">{{ item.contactPhone }}</span></div>
          </div>
          <p class="contact-tip">💡 请当面核实身份，注意人身安全</p>
          <button class="btn-primary" style="width:100%;margin-top:12px" @click="showContact = false">知道了</button>
        </div>
      </div>

      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        <button class="btn-outline" :class="{ faved: isFav }" @click="toggleFav">{{ isFav ? '❤️ 已收藏' : '🤍 收藏' }}</button>
        <button class="btn-primary" @click="showContact = true">📞 联系TA</button>
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
  height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  margin: -20px -16px 16px; color: #fff; overflow: hidden;
}
.header-area.lost { background: linear-gradient(135deg, #fde8ec 0%, #fab1b1 100%); }
.header-area.found { background: linear-gradient(135deg, #e8f8ef 0%, #a8e6c1 100%); }
.header-icon { font-size: 48px; }
.header-type { font-size: var(--font-lg); font-weight: 600; margin-top: 8px; }
.back-btn { position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.85); border-radius: 20px; padding: 6px 14px; font-size: var(--font-sm); color: var(--color-text); cursor: pointer; border: none; z-index: 2; }
.share-btn { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.85); border-radius: 20px; padding: 6px 10px; font-size: var(--font-sm); cursor: pointer; border: none; z-index: 2; }

.carousel { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
.carousel-img { width: 100%; height: 100%; object-fit: cover; }
.carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.7); border: none; font-size: 24px; color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; }
.carousel-btn.prev { left: 8px; } .carousel-btn.next { right: 8px; }
.carousel-dots { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; }
.dot.active { background: #fff; transform: scale(1.3); }
.img-count { position: absolute; bottom: 8px; right: 16px; background: rgba(0,0,0,0.5); color: #fff; font-size: var(--font-xs); padding: 2px 10px; border-radius: 10px; z-index: 2; }

.card { margin-bottom: 12px; }
h3 { font-size: var(--font-md); font-weight: 600; margin-bottom: 10px; }

.title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
.title { font-size: var(--font-lg); font-weight: 600; flex: 1; line-height: 1.4; }
.status-badge { font-size: var(--font-xs); padding: 3px 10px; border-radius: 10px; font-weight: 500; white-space: nowrap; }
.status-badge.open { background: #e8f8ef; color: #07c160; }
.status-badge.closed { background: #f0f0f0; color: #909399; }

.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: var(--font-xs); color: var(--color-text-light); }
.meta-value { font-size: var(--font-sm); color: var(--color-text); }
.reward-banner { margin-top: 12px; padding: 10px 14px; background: #fef5e7; border-radius: 8px; font-size: var(--font-sm); color: #e6a23c; }

.tags-row { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { font-size: var(--font-xs); background: #f0f0f0; color: var(--color-text-secondary); padding: 4px 12px; border-radius: 14px; }

.desc-text { font-size: var(--font-sm); color: var(--color-text-secondary); line-height: 1.8; white-space: pre-wrap; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: var(--font-xs); color: var(--color-text-light); }
.info-value { font-size: var(--font-sm); color: var(--color-text); }

/* 发布者 */
.seller-info { display: flex; align-items: center; gap: 12px; }
.avatar { font-size: 44px; }
.seller-meta { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.seller-name-row { display: flex; align-items: center; gap: 8px; }
.seller-name { font-weight: 500; font-size: var(--font-md); }
.credit-badge { font-size: var(--font-xs); background: #fef5e7; color: #e6a23c; padding: 2px 8px; border-radius: 8px; }
.seller-contact { font-size: var(--font-sm); color: var(--color-primary); }
.seller-rate { font-size: var(--font-xs); color: var(--color-text-light); }

/* 时间线 */
.timeline { display: flex; flex-direction: column; }
.tl-step { display: flex; gap: 12px; padding: 10px 0; border-left: 2px solid #e4e7ed; margin-left: 7px; padding-left: 20px; }
.tl-step:last-child { border-left-color: transparent; }
.tl-dot { width: 12px; height: 12px; border-radius: 50%; background: #e4e7ed; position: absolute; left: -7px; top: 14px; }
.tl-step.done .tl-dot { background: var(--color-primary); }
.tl-content { display: flex; flex-direction: column; gap: 2px; }
.tl-label { font-size: var(--font-sm); font-weight: 500; }
.tl-time { font-size: var(--font-xs); color: var(--color-text-light); }

/* 留言 */
.comment-list { display: flex; flex-direction: column; }
.comment-item { display: flex; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--color-border-light); }
.comment-item:last-child { border-bottom: none; }
.comment-avatar { font-size: 28px; flex-shrink: 0; }
.comment-body { flex: 1; min-width: 0; }
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

.bottom-spacer { height: 70px; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; max-width: var(--max-width); margin: 0 auto; display: flex; gap: 10px; padding: 12px 16px; background: var(--color-card); border-top: 1px solid var(--color-border); z-index: 100; }
.btn-outline { flex: 1; padding: 12px; border-radius: 24px; font-size: var(--font-md); background: var(--color-card); border: 1px solid var(--color-primary); color: var(--color-primary); cursor: pointer; }
.btn-outline.faved { background: #fff5f5; border-color: #f56c6c; color: #f56c6c; }
.btn-primary { flex: 2; padding: 12px; border-radius: 24px; font-size: var(--font-md); background: var(--color-primary); color: #fff; cursor: pointer; border: none; }

.not-found { text-align: center; padding: 80px 16px; color: var(--color-text-light); }
.not-found .btn-primary { margin-top: 16px; padding: 10px 32px; }
</style>

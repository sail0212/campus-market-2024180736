<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { PublishType } from '@/types'
import { PUBLISH_TYPE_ROUTES } from '@/types'
import { createTrade, updateTrade, getTradeById, type TradeFormData } from '@/api/trade'
import { createLostFound, updateLostFound, getLostFoundById, type LostFoundFormData } from '@/api/lostFound'
import { createGroupBuy, updateGroupBuy, getGroupBuyById, type GroupBuyFormData } from '@/api/groupBuy'
import { createErrand, updateErrand, getErrandById, type ErrandFormData } from '@/api/errand'
import FormField from '@/components/FormField.vue'
import { useUserStore } from '@/stores/user'

// 校园常用地点快捷选择
const CAMPUS_LOCATIONS = [
  '北区食堂门口', '南区食堂门口', '东区食堂门口', '图书馆一楼大厅',
  '教学楼A栋', '教学楼B栋', '体育馆门口', '操场入口',
  '北区宿舍楼下', '南区宿舍楼下', '东区宿舍楼下', '西区宿舍楼下',
  '快递驿站', '校门口', '大学生活动中心',
]

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// ===== 类型选择 =====
const TYPES: { key: PublishType; label: string; icon: string }[] = [
  { key: 'trade', label: '二手交易', icon: '🔄' },
  { key: 'lostFound', label: '失物招领', icon: '🔍' },
  { key: 'groupBuy', label: '拼单搭子', icon: '👥' },
  { key: 'errand', label: '跑腿委托', icon: '🏃' },
]

const activeType = ref<PublishType>((route.query.type as PublishType) || 'trade')
const isEdit = computed(() => !!route.query.edit)
const editId = computed(() => Number(route.query.edit) || 0)
const isSubmitting = ref(false)
const showPreview = ref(false)
const successMsg = ref('')

// ===== 通用字段 =====
const title = ref('')
const desc = ref('')
const contact = ref('')
const tagsStr = ref('')
const imagePreviews = ref<string[]>([])

// ===== 二手交易字段 =====
const tradePrice = ref('')
const tradeOriginalPrice = ref('')
const tradeCategory = ref('')
const tradeCondition = ref('九成新')
const tradeLocation = ref('')
const tradeSpecsStr = ref('')

// ===== 失物招领字段 =====
const lfType = ref<'lost' | 'found'>('lost')
const lfItemName = ref('')
const lfCategory = ref('')
const lfLocation = ref('')
const lfEventTime = ref('')
const lfContactPhone = ref('')
const lfReward = ref('')
const lfClaimLocation = ref('')

// ===== 拼单搭子字段 =====
const gbType = ref<'ping' | 'dazi' | 'team'>('ping')
const gbCategory = ref('')
const gbTargetCount = ref('')
const gbDeadline = ref('')
const gbLocation = ref('')
const gbPrice = ref('')
const gbRequirements = ref('')

// ===== 跑腿委托字段 =====
const erTaskType = ref('')
const erCategory = ref('')
const erReward = ref('')
const erFrom = ref('')
const erTo = ref('')
const erDeadline = ref('')
const erUrgency = ref<'low' | 'medium' | 'high'>('medium')

// ===== 表单校验错误 =====
const errors = ref<Record<string, string>>({})

// ===== 分类选项 =====
const tradeCategories = ['教材', '数码', '衣物', '生活']
const lfCategories = ['贵重物品', '电子设备', '生活用品', '证件', '文书', '其他']
const gbCategories = ['餐饮', '学习', '运动', '娱乐', '购物', '出行', '竞赛', '兼职', '文印', '其他']
const erCategories = ['餐饮', '饮品', '事务', '快递', '文件', '购物', '医疗', '文印', '搬运', '其他']
const erTaskTypes = ['代买', '代办', '代取', '代送']
const conditions = ['九九新', '九成新', '八成新', '七成新', '六成新']

// ===== 图片上传 =====
function handleImageUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  for (const file of input.files) {
    if (imagePreviews.value.length >= 9) break
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        imagePreviews.value.push(ev.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
  input.value = ''
}
function removeImage(idx: number) {
  imagePreviews.value.splice(idx, 1)
}

// ===== 校验 =====
function validate(): boolean {
  errors.value = {}
  const e: Record<string, string> = {}

  if (!title.value.trim()) e.title = '请输入标题'
  if (!desc.value.trim()) e.desc = '请输入描述'
  if (!contact.value.trim()) e.contact = '请输入联系方式'

  if (activeType.value === 'trade') {
    if (!tradeCategory.value) e.tradeCategory = '请选择分类'
    if (!tradePrice.value || Number(tradePrice.value) <= 0) e.tradePrice = '价格必须大于 0'
    if (!tradeLocation.value.trim()) e.tradeLocation = '请输入交易地点'
  } else if (activeType.value === 'lostFound') {
    if (!lfCategory.value) e.lfCategory = '请选择分类'
    if (!lfItemName.value.trim()) e.lfItemName = '请输入物品名称'
    if (!lfLocation.value.trim()) e.lfLocation = '请输入地点'
    if (!lfEventTime.value) e.lfEventTime = '请选择时间'
  } else if (activeType.value === 'groupBuy') {
    if (!gbCategory.value) e.gbCategory = '请选择分类'
    if (!gbTargetCount.value || Number(gbTargetCount.value) < 2) e.gbTargetCount = '目标人数至少2人'
    if (!gbDeadline.value) e.gbDeadline = '请选择截止时间'
    else if (new Date(gbDeadline.value) <= new Date()) e.gbDeadline = '截止时间必须在未来'
    if (!gbLocation.value.trim()) e.gbLocation = '请输入地点'
    if (gbPrice.value === '') e.gbPrice = '请输入价格（免费填0）'
  } else if (activeType.value === 'errand') {
    if (!erTaskType.value) e.erTaskType = '请选择任务类型'
    if (!erCategory.value) e.erCategory = '请选择分类'
    if (erReward.value === '' || Number(erReward.value) < 0) e.erReward = '报酬不能为负数'
    if (!erFrom.value.trim()) e.erFrom = '请输入出发地'
    if (!erTo.value.trim()) e.erTo = '请输入目的地'
    if (!erDeadline.value) e.erDeadline = '请选择截止时间'
    else if (new Date(erDeadline.value) <= new Date()) e.erDeadline = '截止时间必须在未来'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

// ===== 提交 =====
async function submit() {
  if (!validate()) return
  isSubmitting.value = true

  try {
    const tags = tagsStr.value
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)

    const now = new Date().toISOString()

    if (activeType.value === 'trade') {
      const data: TradeFormData = {
        title: title.value,
        price: Number(tradePrice.value),
        originalPrice: tradeOriginalPrice.value ? Number(tradeOriginalPrice.value) : undefined,
        category: tradeCategory.value,
        condition: tradeCondition.value,
        publisher: userStore.user.name,
        location: tradeLocation.value,
        image: '',
        images: imagePreviews.value,
        desc: desc.value,
        status: 'open',
        contact: contact.value,
        tags,
        specs: parseSpecs(tradeSpecsStr.value),
        tradeLocation: tradeLocation.value,
      }
      if (isEdit.value) {
        await updateTrade(editId.value, data)
      } else {
        await createTrade(data)
      }
      successMsg.value = isEdit.value ? '编辑成功！' : '发布成功！'
      userStore.incrementPublished()
      setTimeout(() => router.push(PUBLISH_TYPE_ROUTES.trade), 1200)
    } else if (activeType.value === 'lostFound') {
      const data: LostFoundFormData = {
        title: title.value,
        type: lfType.value,
        itemName: lfItemName.value,
        category: lfCategory.value,
        location: lfLocation.value,
        eventTime: lfEventTime.value || now,
        contact: contact.value,
        contactPhone: lfContactPhone.value,
        desc: desc.value,
        status: 'open',
        images: imagePreviews.value,
        reward: lfReward.value ? Number(lfReward.value) : undefined,
        claimLocation: lfClaimLocation.value || lfLocation.value,
        finder: lfType.value === 'found' ? userStore.user.name : undefined,
        tags,
      }
      if (isEdit.value) {
        await updateLostFound(editId.value, data)
      } else {
        await createLostFound(data)
      }
      successMsg.value = isEdit.value ? '编辑成功！' : '发布成功！'
      userStore.incrementPublished()
      setTimeout(() => router.push(PUBLISH_TYPE_ROUTES.lostFound), 1200)
    } else if (activeType.value === 'groupBuy') {
      const data: GroupBuyFormData = {
        title: title.value,
        type: gbType.value,
        category: gbCategory.value,
        targetCount: Number(gbTargetCount.value),
        deadline: gbDeadline.value || now,
        location: gbLocation.value,
        publisher: userStore.user.name,
        price: gbPrice.value || '0',
        desc: desc.value,
        status: 'open',
        images: imagePreviews.value,
        contact: contact.value,
        requirements: gbRequirements.value,
        tags,
      }
      if (isEdit.value) {
        await updateGroupBuy(editId.value, data)
      } else {
        await createGroupBuy(data)
      }
      successMsg.value = isEdit.value ? '编辑成功！' : '发布成功！'
      userStore.incrementPublished()
      setTimeout(() => router.push(PUBLISH_TYPE_ROUTES.groupBuy), 1200)
    } else if (activeType.value === 'errand') {
      const data: ErrandFormData = {
        title: title.value,
        taskType: erTaskType.value,
        category: erCategory.value,
        reward: Number(erReward.value),
        from: erFrom.value,
        to: erTo.value,
        deadline: erDeadline.value || now,
        publisher: userStore.user.name,
        desc: desc.value,
        status: 'open',
        images: imagePreviews.value,
        contact: contact.value,
        urgency: erUrgency.value,
        tags,
      }
      if (isEdit.value) {
        await updateErrand(editId.value, data)
      } else {
        await createErrand(data)
      }
      successMsg.value = isEdit.value ? '编辑成功！' : '发布成功！'
      userStore.incrementPublished()
      setTimeout(() => router.push(PUBLISH_TYPE_ROUTES.errand), 1200)
    }

    clearDraft()
  } catch (err) {
    console.error('发布失败', err)
    alert('发布失败！请确保 JSON Server 已启动（在新终端运行 npm run mock），然后重试。')
  } finally {
    isSubmitting.value = false
  }
}

function parseSpecs(str: string): Record<string, string> {
  const specs: Record<string, string> = {}
  if (!str.trim()) return specs
  str.split(/[,，\n]/).forEach((line) => {
    const parts = line.split(/[:：]/)
    if (parts.length === 2) {
      const key = parts[0]!.trim()
      const val = parts[1]!.trim()
      if (key && val) specs[key] = val
    }
  })
  return specs
}

// ===== 草稿功能 =====
const draftKey = computed(() => `draft_${activeType.value}${isEdit.value ? '_edit_' + editId.value : ''}`)

function saveDraft() {
  if (isEdit.value) return // 编辑模式不自动保存草稿
  const draft = getFormData()
  localStorage.setItem(draftKey.value, JSON.stringify(draft))
}

function loadDraft(): Record<string, any> | null {
  const raw = localStorage.getItem(draftKey.value)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function clearDraft() {
  localStorage.removeItem(draftKey.value)
}

function getFormData(): Record<string, any> {
  return {
    title: title.value,
    desc: desc.value,
    contact: contact.value,
    tagsStr: tagsStr.value,
    imagePreviews: imagePreviews.value,
    tradePrice: tradePrice.value,
    tradeOriginalPrice: tradeOriginalPrice.value,
    tradeCategory: tradeCategory.value,
    tradeCondition: tradeCondition.value,
    tradeLocation: tradeLocation.value,
    tradeSpecsStr: tradeSpecsStr.value,
    lfType: lfType.value,
    lfItemName: lfItemName.value,
    lfCategory: lfCategory.value,
    lfLocation: lfLocation.value,
    lfEventTime: lfEventTime.value,
    lfContactPhone: lfContactPhone.value,
    lfReward: lfReward.value,
    lfClaimLocation: lfClaimLocation.value,
    gbType: gbType.value,
    gbCategory: gbCategory.value,
    gbTargetCount: gbTargetCount.value,
    gbDeadline: gbDeadline.value,
    gbLocation: gbLocation.value,
    gbPrice: gbPrice.value,
    gbRequirements: gbRequirements.value,
    erTaskType: erTaskType.value,
    erCategory: erCategory.value,
    erReward: erReward.value,
    erFrom: erFrom.value,
    erTo: erTo.value,
    erDeadline: erDeadline.value,
    erUrgency: erUrgency.value,
  }
}

function restoreDraft(draft: Record<string, any>) {
  title.value = draft.title || ''
  desc.value = draft.desc || ''
  contact.value = draft.contact || ''
  tagsStr.value = draft.tagsStr || ''
  imagePreviews.value = draft.imagePreviews || []
  tradePrice.value = draft.tradePrice || ''
  tradeOriginalPrice.value = draft.tradeOriginalPrice || ''
  tradeCategory.value = draft.tradeCategory || ''
  tradeCondition.value = draft.tradeCondition || '九成新'
  tradeLocation.value = draft.tradeLocation || ''
  tradeSpecsStr.value = draft.tradeSpecsStr || ''
  lfType.value = draft.lfType || 'lost'
  lfItemName.value = draft.lfItemName || ''
  lfCategory.value = draft.lfCategory || ''
  lfLocation.value = draft.lfLocation || ''
  lfEventTime.value = draft.lfEventTime || ''
  lfContactPhone.value = draft.lfContactPhone || ''
  lfReward.value = draft.lfReward || ''
  lfClaimLocation.value = draft.lfClaimLocation || ''
  gbType.value = draft.gbType || 'ping'
  gbCategory.value = draft.gbCategory || ''
  gbTargetCount.value = draft.gbTargetCount || ''
  gbDeadline.value = draft.gbDeadline || ''
  gbLocation.value = draft.gbLocation || ''
  gbPrice.value = draft.gbPrice || ''
  gbRequirements.value = draft.gbRequirements || ''
  erTaskType.value = draft.erTaskType || ''
  erCategory.value = draft.erCategory || ''
  erReward.value = draft.erReward || ''
  erFrom.value = draft.erFrom || ''
  erTo.value = draft.erTo || ''
  erDeadline.value = draft.erDeadline || ''
  erUrgency.value = draft.erUrgency || 'medium'
}

// watch 草稿自动保存（去抖 2s）
let draftTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => [activeType.value, title.value, desc.value, tradePrice.value, erReward.value, gbTargetCount.value],
  () => {
    if (draftTimer) clearTimeout(draftTimer)
    draftTimer = setTimeout(saveDraft, 2000)
  },
  { deep: true }
)

// ===== 切换类型时恢复草稿 =====
function switchType(type: PublishType) {
  if (type === activeType.value) return
  // 先保存当前类型的草稿
  saveDraft()
  activeType.value = type
  errors.value = {}
  // 清空当前表单
  resetForm()
  // 尝试恢复新类型的草稿
  const draft = loadDraft()
  if (draft) {
    restoreDraft(draft)
  }
}

function quickFillLocation(target: 'trade' | 'lf' | 'lfClaim' | 'gb' | 'erFrom' | 'erTo', location: string) {
  if (target === 'trade') tradeLocation.value = location
  else if (target === 'lf') lfLocation.value = location
  else if (target === 'lfClaim') lfClaimLocation.value = location
  else if (target === 'gb') gbLocation.value = location
  else if (target === 'erFrom') erFrom.value = location
  else if (target === 'erTo') erTo.value = location
}

function resetForm() {
  title.value = ''
  desc.value = ''
  contact.value = ''
  tagsStr.value = ''
  imagePreviews.value = []
  tradePrice.value = ''
  tradeOriginalPrice.value = ''
  tradeCategory.value = ''
  tradeCondition.value = '九成新'
  tradeLocation.value = ''
  tradeSpecsStr.value = ''
  lfType.value = 'lost'
  lfItemName.value = ''
  lfCategory.value = ''
  lfLocation.value = ''
  lfEventTime.value = ''
  lfContactPhone.value = ''
  lfReward.value = ''
  lfClaimLocation.value = ''
  gbType.value = 'ping'
  gbCategory.value = ''
  gbTargetCount.value = ''
  gbDeadline.value = ''
  gbLocation.value = ''
  gbPrice.value = ''
  gbRequirements.value = ''
  erTaskType.value = ''
  erCategory.value = ''
  erReward.value = ''
  erFrom.value = ''
  erTo.value = ''
  erDeadline.value = ''
  erUrgency.value = 'medium'
}

// ===== 初始化 =====
onMounted(async () => {
  if (isEdit.value) {
    await loadEditData()
  } else {
    const draft = loadDraft()
    if (draft) restoreDraft(draft)
  }
})

async function loadEditData() {
  try {
    if (activeType.value === 'trade') {
      const res = await getTradeById(editId.value)
      const d = res.data
      title.value = d.title
      desc.value = d.desc
      contact.value = d.contact
      tagsStr.value = d.tags.join(', ')
      imagePreviews.value = d.images || []
      tradePrice.value = String(d.price)
      tradeOriginalPrice.value = d.originalPrice ? String(d.originalPrice) : ''
      tradeCategory.value = d.category
      tradeCondition.value = d.condition
      tradeLocation.value = d.location
    } else if (activeType.value === 'lostFound') {
      const res = await getLostFoundById(editId.value)
      const d = res.data
      title.value = d.title
      desc.value = d.desc
      contact.value = d.contact
      tagsStr.value = d.tags.join(', ')
      imagePreviews.value = d.images || []
      lfType.value = d.type
      lfItemName.value = d.itemName
      lfCategory.value = d.category
      lfLocation.value = d.location
      lfEventTime.value = d.eventTime
      lfContactPhone.value = d.contactPhone
      lfReward.value = d.reward ? String(d.reward) : ''
      lfClaimLocation.value = d.claimLocation
    } else if (activeType.value === 'groupBuy') {
      const res = await getGroupBuyById(editId.value)
      const d = res.data
      title.value = d.title
      desc.value = d.desc
      contact.value = d.contact
      tagsStr.value = d.tags.join(', ')
      imagePreviews.value = d.images || []
      gbType.value = d.type
      gbCategory.value = d.category
      gbTargetCount.value = String(d.targetCount)
      gbDeadline.value = d.deadline
      gbLocation.value = d.location
      gbPrice.value = d.price
      gbRequirements.value = d.requirements
    } else if (activeType.value === 'errand') {
      const res = await getErrandById(editId.value)
      const d = res.data
      title.value = d.title
      desc.value = d.desc
      contact.value = d.contact
      tagsStr.value = d.tags.join(', ')
      imagePreviews.value = d.images || []
      erTaskType.value = d.taskType
      erCategory.value = d.category
      erReward.value = String(d.reward)
      erFrom.value = d.from
      erTo.value = d.to
      erDeadline.value = d.deadline
      erUrgency.value = d.urgency
    }
  } catch {
    alert('加载编辑数据失败')
    router.back()
  }
}
</script>

<template>
  <div class="publish-view">
    <h2 class="page-title">{{ isEdit ? '编辑信息' : '发布信息' }}</h2>

    <!-- 成功提示 -->
    <div v-if="successMsg" class="success-card card">
      <p class="success-icon">✅</p>
      <p class="success-text">{{ successMsg }}</p>
      <p class="success-sub">正在跳转…</p>
    </div>

    <template v-else>
      <!-- 类型选择 -->
      <div class="type-tabs">
        <button
          v-for="t in TYPES"
          :key="t.key"
          class="type-tab"
          :class="{ active: activeType === t.key }"
          :disabled="isEdit"
          @click="switchType(t.key)"
        >
          <span class="tab-icon">{{ t.icon }}</span>
          <span class="tab-label">{{ t.label }}</span>
        </button>
      </div>

      <form class="publish-form" @submit.prevent="submit">
        <!-- === 通用字段 === -->
        <FormField label="标题" required :error="errors.title">
          <input v-model="title" placeholder="请输入标题" maxlength="50" />
        </FormField>

        <!-- === 二手交易专属 === -->
        <template v-if="activeType === 'trade'">
          <FormField label="分类" required :error="errors.tradeCategory">
            <div class="cat-options">
              <label v-for="cat in tradeCategories" :key="cat" class="cat-radio">
                <input type="radio" v-model="tradeCategory" :value="cat" />
                <span>{{ cat }}</span>
              </label>
            </div>
          </FormField>
          <div class="form-row">
            <FormField label="售价 (¥)" required :error="errors.tradePrice" class="flex-2">
              <input v-model="tradePrice" type="number" placeholder="0" min="0" step="0.01" />
            </FormField>
            <FormField label="原价 (¥)" class="flex-1">
              <input v-model="tradeOriginalPrice" type="number" placeholder="选填" min="0" step="0.01" />
            </FormField>
          </div>
          <div class="form-row">
            <FormField label="成色" class="flex-1">
              <select v-model="tradeCondition">
                <option v-for="c in conditions" :key="c">{{ c }}</option>
              </select>
            </FormField>
            <FormField label="交易地点" required :error="errors.tradeLocation" class="flex-2">
              <input v-model="tradeLocation" placeholder="如：北区食堂门口" list="loc-list-trade" />
              <datalist id="loc-list-trade">
                <option v-for="loc in CAMPUS_LOCATIONS" :key="loc" :value="loc" />
              </datalist>
            </FormField>
          </div>
          <div class="location-chips">
            <span class="chips-label">快捷填入：</span>
            <button type="button" v-for="loc in CAMPUS_LOCATIONS.slice(0, 6)" :key="loc" class="loc-chip" @click="quickFillLocation('trade', loc)">{{ loc }}</button>
          </div>
          <FormField label="规格参数" hint="用逗号或换行分隔，格式为 键:值">
            <textarea v-model="tradeSpecsStr" rows="3" placeholder="每行一个参数，格式：品牌:Apple&#10;型号:iPhone 15&#10;颜色:黑色" />
          </FormField>
        </template>

        <!-- === 失物招领专属 === -->
        <template v-if="activeType === 'lostFound'">
          <div class="form-group">
            <label>类型 <span class="required">*</span></label>
            <div class="type-toggle">
              <button type="button" class="toggle-btn" :class="{ active: lfType === 'lost' }" @click="lfType = 'lost'">
                🔍 寻物
              </button>
              <button type="button" class="toggle-btn" :class="{ active: lfType === 'found' }" @click="lfType = 'found'">
                ✅ 招领
              </button>
            </div>
          </div>
          <div class="form-row">
            <FormField label="物品名称" required :error="errors.lfItemName" class="flex-1">
              <input v-model="lfItemName" placeholder="如：钱包" />
            </FormField>
            <FormField label="分类" required :error="errors.lfCategory" class="flex-1">
              <select v-model="lfCategory">
                <option value="">请选择</option>
                <option v-for="c in lfCategories" :key="c" :value="c">{{ c }}</option>
              </select>
            </FormField>
          </div>
          <div class="form-row">
            <FormField label="地点" required :error="errors.lfLocation" class="flex-1">
              <input v-model="lfLocation" placeholder="如：图书馆二楼" />
            </FormField>
            <FormField label="时间" required :error="errors.lfEventTime" class="flex-1">
              <input v-model="lfEventTime" type="datetime-local" />
            </FormField>
          </div>
          <div class="form-row">
            <FormField label="联系电话" class="flex-1">
              <input v-model="lfContactPhone" placeholder="选填" />
            </FormField>
            <FormField label="悬赏金额 (¥)" class="flex-1">
              <input v-model="lfReward" type="number" placeholder="选填" min="0" />
            </FormField>
          </div>
          <FormField label="认领/存放地点">
            <input v-model="lfClaimLocation" placeholder="如：图书馆服务台" />
          </FormField>
        </template>

        <!-- === 拼单搭子专属 === -->
        <template v-if="activeType === 'groupBuy'">
          <div class="form-group">
            <label>类型 <span class="required">*</span></label>
            <div class="type-toggle three">
              <button type="button" class="toggle-btn" :class="{ active: gbType === 'ping' }" @click="gbType = 'ping'">🛒 拼单</button>
              <button type="button" class="toggle-btn" :class="{ active: gbType === 'dazi' }" @click="gbType = 'dazi'">🤝 搭子</button>
              <button type="button" class="toggle-btn" :class="{ active: gbType === 'team' }" @click="gbType = 'team'">👥 组队</button>
            </div>
          </div>
          <div class="form-row">
            <FormField label="分类" required :error="errors.gbCategory" class="flex-1">
              <select v-model="gbCategory">
                <option value="">请选择</option>
                <option v-for="c in gbCategories" :key="c" :value="c">{{ c }}</option>
              </select>
            </FormField>
            <FormField label="人均价格 (¥)" required :error="errors.gbPrice" class="flex-1">
              <input v-model="gbPrice" type="number" placeholder="免费填0" min="0" step="0.01" />
            </FormField>
          </div>
          <div class="form-row">
            <FormField label="目标人数" required :error="errors.gbTargetCount" class="flex-1">
              <input v-model="gbTargetCount" type="number" placeholder="至少2人" min="2" />
            </FormField>
            <FormField label="截止时间" required :error="errors.gbDeadline" class="flex-1">
              <input v-model="gbDeadline" type="datetime-local" />
            </FormField>
          </div>
          <FormField label="地点" required :error="errors.gbLocation">
            <input v-model="gbLocation" placeholder="如：校门口集合" />
          </FormField>
          <FormField label="加入要求">
            <textarea v-model="gbRequirements" rows="2" placeholder="说明加入条件或要求（选填）" maxlength="300" />
          </FormField>
        </template>

        <!-- === 跑腿委托专属 === -->
        <template v-if="activeType === 'errand'">
          <div class="form-row">
            <FormField label="任务类型" required :error="errors.erTaskType" class="flex-1">
              <select v-model="erTaskType">
                <option value="">请选择</option>
                <option v-for="t in erTaskTypes" :key="t" :value="t">{{ t }}</option>
              </select>
            </FormField>
            <FormField label="分类" required :error="errors.erCategory" class="flex-1">
              <select v-model="erCategory">
                <option value="">请选择</option>
                <option v-for="c in erCategories" :key="c" :value="c">{{ c }}</option>
              </select>
            </FormField>
          </div>
          <div class="form-row">
            <FormField label="报酬 (¥)" required :error="errors.erReward" class="flex-1">
              <input v-model="erReward" type="number" placeholder="0" min="0" step="0.01" />
            </FormField>
            <FormField label="紧急程度" class="flex-1">
              <select v-model="erUrgency">
                <option value="low">不急</option>
                <option value="medium">一般</option>
                <option value="high">紧急</option>
              </select>
            </FormField>
          </div>
          <div class="form-row">
            <FormField label="出发地" required :error="errors.erFrom" class="flex-1">
              <input v-model="erFrom" placeholder="如：北区食堂" />
            </FormField>
            <FormField label="目的地" required :error="errors.erTo" class="flex-1">
              <input v-model="erTo" placeholder="如：南区宿舍3号楼" />
            </FormField>
          </div>
          <FormField label="截止时间" required :error="errors.erDeadline">
            <input v-model="erDeadline" type="datetime-local" />
          </FormField>
        </template>

        <!-- === 通用字段继续 === -->
        <FormField label="描述" required :error="errors.desc" :hint="desc.length + '/500'">
          <textarea v-model="desc" rows="4" placeholder="详细描述内容…" maxlength="500" />
        </FormField>

        <FormField label="联系方式" required :error="errors.contact">
          <input v-model="contact" placeholder="微信/QQ号等" maxlength="50" />
        </FormField>

        <FormField label="标签">
          <input v-model="tagsStr" placeholder="用逗号分隔，如：考研, 数学, 教材" maxlength="100" />
        </FormField>

        <!-- 图片上传 -->
        <FormField label="图片（最多9张）" hint="建议至少上传1张图片，第一张将作为封面展示">
          <div class="image-upload-section">
            <div v-for="(img, idx) in imagePreviews" :key="idx" class="preview-thumb">
              <img :src="img" alt="预览" />
              <button type="button" class="remove-btn" @click="removeImage(idx)">×</button>
            </div>
            <label v-if="imagePreviews.length < 9" class="upload-area">
              <input type="file" accept="image/*" multiple hidden @change="handleImageUpload" />
              <span class="upload-icon">📷</span>
              <span class="upload-text">点击上传</span>
            </label>
          </div>
        </FormField>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button type="button" class="btn-preview" @click="showPreview = true">👁️ 预览</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? '发布中…' : (isEdit ? '保存修改' : '立即发布') }}
          </button>
        </div>
        <button v-if="!isEdit" type="button" class="btn-draft-clear" @click="clearDraft(); resetForm()">
          🗑️ 清除草稿
        </button>
      </form>

      <!-- 预览弹窗 -->
      <div v-if="showPreview" class="preview-overlay" @click.self="showPreview = false">
        <div class="preview-modal">
          <div class="preview-header">
            <h3>📋 发布预览</h3>
            <button class="close-btn" @click="showPreview = false">×</button>
          </div>
          <div class="preview-body">
            <div class="preview-item card">
              <h4>{{ title || '(未填写标题)' }}</h4>
              <div class="preview-meta">
                <span v-if="activeType === 'trade'">💰 ¥{{ tradePrice || '0' }}</span>
                <span v-if="activeType === 'lostFound'">{{ lfType === 'lost' ? '🔍 寻物' : '✅ 招领' }}</span>
                <span v-if="activeType === 'groupBuy'">👥 {{ gbTargetCount || '?' }}人</span>
                <span v-if="activeType === 'errand'">🏃 ¥{{ erReward || '0' }}</span>
                <span>📞 {{ contact || '(未填写)' }}</span>
              </div>
              <p class="preview-desc">{{ desc || '(未填写描述)' }}</p>
              <div v-if="imagePreviews.length > 0" class="preview-images">
                <img v-for="(img, i) in imagePreviews.slice(0, 3)" :key="i" :src="img" class="preview-img" />
              </div>
              <div v-if="tagsStr" class="preview-tags">
                <span v-for="tag in tagsStr.split(/[,，]/).filter(Boolean)" :key="tag" class="preview-tag">{{ tag.trim() }}</span>
              </div>
            </div>
          </div>
          <div class="preview-footer">
            <button class="btn-submit" @click="showPreview = false; submit()">确认发布</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-title {
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: 16px;
}

.success-card {
  text-align: center;
  padding: 60px 20px;
}
.success-icon { font-size: 48px; }
.success-text {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 12px 0 4px;
}
.success-sub { font-size: var(--font-sm); color: var(--color-text-light); }

/* 类型标签 */
.type-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}
.type-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
  background: var(--color-card);
  cursor: pointer;
  transition: all 0.2s;
  font-size: var(--font-xs);
}
.type-tab.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: 600;
}
.type-tab:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.tab-icon { font-size: 22px; }
.tab-label { color: var(--color-text); }

/* 表单 */
.publish-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-group label {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}
.required { color: var(--color-danger); }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-md);
  background: var(--color-card);
  transition: border-color 0.2s;
  width: 100%;
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--color-primary);
}
.char-count {
  text-align: right;
  font-size: var(--font-xs);
  color: var(--color-text-light);
}
.field-error {
  font-size: var(--font-xs);
  color: var(--color-danger);
  margin-top: 2px;
}

.form-row {
  display: flex;
  gap: 12px;
}
.flex-2 { flex: 2; }
.flex-1 { flex: 1; }

.cat-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.cat-radio {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: var(--font-sm);
}

/* 类型切换按钮 */
.type-toggle {
  display: flex;
  gap: 8px;
}
.type-toggle.three .toggle-btn { flex: 1; }
.toggle-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all 0.15s;
}
.toggle-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

/* 图片上传 */
.image-upload-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.preview-thumb {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--color-border);
}
.preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.remove-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 22px;
  height: 22px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border-radius: 0 8px 0 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.upload-area {
  width: 80px;
  height: 80px;
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 4px;
  transition: border-color 0.2s;
}
.upload-area:hover { border-color: var(--color-primary); }
.upload-icon { font-size: 22px; }
.upload-text { font-size: 11px; color: var(--color-text-light); }

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.btn-preview {
  flex: 1;
  padding: 14px;
  border-radius: 24px;
  background: var(--color-card);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-size: var(--font-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-preview:hover {
  background: var(--color-primary-light);
}
.btn-submit {
  flex: 2;
  padding: 14px;
  border-radius: 24px;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-lg);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-submit:hover { opacity: 0.9; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-draft-clear {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background: transparent;
  border: 1px dashed var(--color-border);
  color: var(--color-text-light);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all 0.15s;
}
.btn-draft-clear:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

/* 地点快捷选择 */
.location-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: -8px;
  margin-bottom: 6px;
}
.chips-label {
  font-size: var(--font-xs);
  color: var(--color-text-light);
  white-space: nowrap;
}
.loc-chip {
  font-size: var(--font-xs);
  padding: 3px 10px;
  border-radius: 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.loc-chip:hover {
  background: var(--color-primary);
  color: #fff;
}

/* 预览弹窗 */
.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 20px;
}
.preview-modal {
  background: #fff;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}
.preview-header h3 { font-size: var(--font-lg); }
.close-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  font-size: 20px;
  cursor: pointer;
  border: none;
}
.preview-body { padding: 16px; }
.preview-item { margin-bottom: 0; }
.preview-item h4 {
  font-size: var(--font-md);
  font-weight: 600;
  margin-bottom: 8px;
}
.preview-meta {
  display: flex;
  gap: 12px;
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.preview-desc {
  font-size: var(--font-sm);
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 8px;
}
.preview-images {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}
.preview-img {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}
.preview-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.preview-tag {
  font-size: 11px;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}
.preview-footer { padding: 12px 16px; border-top: 1px solid var(--color-border); }
.preview-footer .btn-submit { width: 100%; }
</style>

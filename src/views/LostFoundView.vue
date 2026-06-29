<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const items = ref<LostFoundItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getLostFounds()
    items.value = res.data
  } catch (e) {
    console.error('获取失物招领列表失败', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="lost-found-view">
    <h2 class="page-title">🔍 失物招领</h2>
    <p class="page-desc">捡到失物请发布招领信息，丢失物品请发布寻物启事</p>

    <div v-if="loading" class="loading">加载中…</div>

    <EmptyState
      v-else-if="items.length === 0"
      icon="🔍"
      text="暂无失物招领信息"
    />

    <div v-else class="item-list">
      <div v-for="item in items" :key="item.id">
        <ItemCard
          :title="item.title"
          :subtitle="item.desc"
          :tags="[item.category, '📍 ' + item.location]"
          :status="item.type"
          :footer="item.contact + ' · ' + formatTime(item.publishTime)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return '刚刚'
  if (hours < 24) return hours + '小时前'
  return Math.floor(hours / 24) + '天前'
}
</script>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 4px;
}
.page-desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 16px;
}
.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.loading {
  text-align: center;
  padding: 60px;
  color: #909399;
  font-size: 14px;
}
</style>

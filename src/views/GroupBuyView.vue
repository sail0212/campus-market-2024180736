<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { formatTime } from '@/utils/format'

const router = useRouter()
const items = ref<GroupBuyItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getGroupBuys()
    items.value = res.data
  } catch (e) {
    console.error('获取拼单搭子列表失败', e)
  } finally {
    loading.value = false
  }
})

function goDetail(id: number) {
  router.push(`/group-buy/${id}`)
}

function progressText(item: GroupBuyItem): string {
  return `${item.currentCount}/${item.targetCount}人`
}
</script>

<template>
  <div class="group-buy-view">
    <h2 class="page-title">👥 拼单搭子</h2>
    <p class="page-desc">找人一起拼、一起学、一起玩，让校园生活更精彩</p>

    <div v-if="loading" class="loading">加载中…</div>

    <EmptyState
      v-else-if="items.length === 0"
      icon="👥"
      text="暂无拼单搭子信息"
    />

    <div v-else class="item-list">
      <div v-for="item in items" :key="item.id" @click="goDetail(item.id)">
        <ItemCard
          :title="item.title"
          :subtitle="item.desc"
          :tags="[item.category, '📍 ' + item.location]"
          :status="item.type"
          :highlight="item.price === '0' ? '免费' : '¥' + item.price + '/人'"
          :footer="item.publisher + ' · ' + progressText(item) + ' · ' + formatTime(item.publishTime)"
        />
      </div>
    </div>
  </div>
</template>

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

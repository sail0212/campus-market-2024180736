<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getErrands, type ErrandItem } from '@/api/errand'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const items = ref<ErrandItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getErrands()
    items.value = res.data
  } catch (e) {
    console.error('获取跑腿委托列表失败', e)
  } finally {
    loading.value = false
  }
})

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    open: '待接单',
    in_progress: '进行中',
    done: '已完成',
  }
  return map[status] || status
}
</script>

<template>
  <div class="errand-view">
    <h2 class="page-title">🏃 跑腿委托</h2>
    <p class="page-desc">代买、代办、代取、代送，你的校园跑腿助手</p>

    <div v-if="loading" class="loading">加载中…</div>

    <EmptyState
      v-else-if="items.length === 0"
      icon="🏃"
      text="暂无跑腿委托信息"
    />

    <div v-else class="item-list">
      <div v-for="item in items" :key="item.id">
        <ItemCard
          :title="item.title"
          :subtitle="item.desc"
          :tags="[item.taskType, item.from + ' → ' + item.to]"
          :status="item.status"
          :highlight="'¥' + item.reward"
          :footer="item.publisher + ' · ' + statusLabel(item.status)"
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

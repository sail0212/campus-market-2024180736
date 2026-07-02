<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getTrades, type TradeItem } from '@/api/trade'
import { useFavoriteStore } from '@/stores/favorite'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { formatTime } from '@/utils/format'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const trades = ref<TradeItem[]>([])
const loading = ref(true)
const error = ref(false)
const searchKeyword = ref('')

async function fetchTrades() {
  loading.value = true
  error.value = false
  try {
    const res = await getTrades()
    trades.value = res.data
  } catch (e) {
    console.error('获取二手交易列表失败', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchTrades)

const filteredItems = computed(() => {
  const kw = searchKeyword.value.toLowerCase()
  if (!kw) return trades.value
  return trades.value.filter((item) =>
    item.title.toLowerCase().includes(kw) ||
    item.desc.toLowerCase().includes(kw) ||
    item.category.toLowerCase().includes(kw) ||
    item.location.toLowerCase().includes(kw)
  )
})

function goDetail(id: number) {
  router.push(`/trade/${id}`)
}

function toggleFav(id: number, title: string) {
  favoriteStore.toggleFavorite(id, 'trade', title)
}
</script>

<template>
  <div class="trade-view">
    <h2 class="page-title">🔄 二手交易</h2>
    <p class="page-desc">校园闲置物品交易，让每一件物品都找到新主人</p>

    <SearchBar v-if="!loading && !error && trades.length > 0" placeholder="搜索标题、分类、地点…" @search="(kw) => searchKeyword = kw" />

    <LoadingState v-if="loading" />

    <ErrorState v-else-if="error" show-retry @retry="fetchTrades" />

    <EmptyState
      v-else-if="filteredItems.length === 0 && searchKeyword"
      icon="🔍"
      text="未找到匹配结果"
      :hint="'没有找到包含「' + searchKeyword + '」的商品'"
    />

    <EmptyState
      v-else-if="filteredItems.length === 0"
      icon="📦"
      text="暂无二手交易信息"
    />

    <div v-else class="item-list">
      <div v-for="item in filteredItems" :key="item.id" @click="goDetail(item.id)">
        <ItemCard
          :title="item.title"
          :subtitle="item.desc"
          :tags="[item.category, item.condition]"
          :status="item.status"
          :highlight="'¥' + item.price"
          :footer="item.publisher + ' · ' + formatTime(item.publishTime)"
          :favorited="favoriteStore.isFavorited(item.id, 'trade')"
        >
          <template #actions>
            <button
              class="fav-btn"
              :class="{ active: favoriteStore.isFavorited(item.id, 'trade') }"
              @click.stop="toggleFav(item.id, item.title)"
            >
              {{ favoriteStore.isFavorited(item.id, 'trade') ? '❤️ 已收藏' : '🤍 收藏' }}
            </button>
          </template>
        </ItemCard>
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

.fav-btn {
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 16px;
  background: #f5f6fa;
  color: #909399;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.fav-btn:hover {
  border-color: #f56c6c;
  color: #f56c6c;
  background: #fff5f5;
}
.fav-btn.active {
  background: #fff5f5;
  color: #f56c6c;
  border-color: #f56c6c;
  font-weight: 500;
}
</style>

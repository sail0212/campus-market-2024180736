<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import { useFavoriteStore } from '@/stores/favorite'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { formatTime } from '@/utils/format'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const items = ref<LostFoundItem[]>([])
const loading = ref(true)
const error = ref(false)
const searchKeyword = ref('')

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    const res = await getLostFounds()
    items.value = res.data
  } catch (e) {
    console.error('获取失物招领列表失败', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const filteredItems = computed(() => {
  const kw = searchKeyword.value.toLowerCase()
  if (!kw) return items.value
  return items.value.filter((item) =>
    item.title.toLowerCase().includes(kw) ||
    item.itemName.toLowerCase().includes(kw) ||
    item.desc.toLowerCase().includes(kw) ||
    item.location.toLowerCase().includes(kw)
  )
})

function goDetail(id: number) {
  router.push(`/lost-found/${id}`)
}

function toggleFav(id: number, title: string) {
  favoriteStore.toggleFavorite(id, 'lostFound', title)
}
</script>

<template>
  <div class="lost-found-view">
    <h2 class="page-title">🔍 失物招领</h2>
    <p class="page-desc">捡到失物请发布招领信息，丢失物品请发布寻物启事</p>

    <SearchBar v-if="!loading && !error && items.length > 0" placeholder="搜索标题、物品名称、地点…" @search="(kw) => searchKeyword = kw" />

    <LoadingState v-if="loading" />

    <ErrorState v-else-if="error" show-retry @retry="fetchData" />

    <EmptyState
      v-else-if="filteredItems.length === 0 && searchKeyword"
      icon="🔍"
      text="未找到匹配结果"
    />

    <EmptyState
      v-else-if="filteredItems.length === 0"
      icon="🔍"
      text="暂无失物招领信息"
    />

    <div v-else class="item-list">
      <div v-for="item in filteredItems" :key="item.id" @click="goDetail(item.id)">
        <ItemCard
          :title="item.title"
          :subtitle="item.desc"
          :tags="[item.category, '📍 ' + item.location]"
          :status="item.type"
          :footer="item.contact + ' · ' + formatTime(item.publishTime)"
          :favorited="favoriteStore.isFavorited(item.id, 'lostFound')"
        >
          <template #actions>
            <button
              class="fav-btn"
              :class="{ active: favoriteStore.isFavorited(item.id, 'lostFound') }"
              @click.stop="toggleFav(item.id, item.title)"
            >
              {{ favoriteStore.isFavorited(item.id, 'lostFound') ? '❤️ 已收藏' : '🤍 收藏' }}
            </button>
          </template>
        </ItemCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: 22px; font-weight: 600; margin-bottom: 4px; }
.page-desc { font-size: 14px; color: #909399; margin-bottom: 16px; }
.item-list { display: flex; flex-direction: column; gap: 10px; }
.fav-btn {
  font-size: 13px; padding: 4px 12px; border-radius: 16px;
  background: #f5f6fa; color: #909399; cursor: pointer;
  transition: all 0.2s; border: 1px solid transparent;
}
.fav-btn:hover { border-color: #f56c6c; color: #f56c6c; background: #fff5f5; }
.fav-btn.active { background: #fff5f5; color: #f56c6c; border-color: #f56c6c; font-weight: 500; }
</style>

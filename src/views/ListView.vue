<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import ProductCard from '@/components/ProductCard.vue'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

const tabs = ['全部', '教材', '数码', '衣物', '生活']
const activeTab = ref('全部')

const filteredProducts = computed(() => {
  if (activeTab.value === '全部') return store.products
  return store.products.filter((p) => p.category === activeTab.value)
})

function goToDetail(id: number) {
  router.push(`/detail/${id}`)
}
</script>

<template>
  <div class="list-view">
    <!-- 分类 Tab -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-item"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 商品网格 -->
    <div class="product-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        @click="goToDetail(product.id)"
      >
        <ProductCard :product="product" />
      </div>
    </div>

    <p v-if="filteredProducts.length === 0" class="empty">暂无商品</p>
  </div>
</template>

<style scoped>
.list-view {
  padding-bottom: 16px;
}

.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.tab-item {
  padding: 8px 18px;
  border-radius: 20px;
  font-size: var(--font-sm);
  background: var(--color-card);
  color: var(--color-text-secondary);
  white-space: nowrap;
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}
.tab-item.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.product-grid > * {
  cursor: pointer;
}

.empty {
  text-align: center;
  color: var(--color-text-light);
  padding: 60px 0;
  font-size: var(--font-md);
}
</style>

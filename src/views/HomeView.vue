<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ProductCard from '@/components/ProductCard.vue'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

const categories = [
  { label: '教材', icon: '📚', color: '#e8f8ef' },
  { label: '数码', icon: '📱', color: '#e8f0fe' },
  { label: '衣物', icon: '👗', color: '#fde8ec' },
  { label: '生活', icon: '🏠', color: '#fef5e7' },
]

const latestProducts = store.products.slice(0, 4)

function goToList() {
  router.push('/list')
}
function goToDetail(id: number) {
  router.push(`/detail/${id}`)
}
</script>

<template>
  <div class="home-view">
    <!-- 搜索栏 -->
    <div class="search-bar" @click="goToList">
      <span class="search-icon">🔍</span>
      <span class="search-placeholder">搜索你想要的好物…</span>
    </div>

    <!-- 分类入口 -->
    <section class="section">
      <h2 class="section-title">分类浏览</h2>
      <div class="category-grid">
        <div
          v-for="cat in categories"
          :key="cat.label"
          class="category-item"
          :style="{ background: cat.color }"
          @click="goToList"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-label">{{ cat.label }}</span>
        </div>
      </div>
    </section>

    <!-- 最新发布 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">最新发布</h2>
        <span class="section-more" @click="goToList">更多 ›</span>
      </div>
      <div class="product-list">
        <div
          v-for="product in latestProducts"
          :key="product.id"
          @click="goToDetail(product.id)"
        >
          <ProductCard :product="product" />
        </div>
      </div>
    </section>

    <p class="bottom-tip">— 校园轻集市 · 让闲置流转起来 —</p>
  </div>
</template>

<style scoped>
.home-view {
  padding-bottom: 32px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-card);
  border-radius: 24px;
  padding: 12px 20px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}
.search-icon {
  font-size: 18px;
}
.search-placeholder {
  color: var(--color-text-light);
  font-size: var(--font-md);
}

/* 分类 */
.section {
  margin-bottom: 24px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.section-title {
  font-size: var(--font-lg);
  font-weight: 600;
}
.section-more {
  font-size: var(--font-sm);
  color: var(--color-primary);
  cursor: pointer;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.category-item {
  border-radius: var(--radius-md);
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}
.category-item:hover {
  transform: scale(1.05);
}
.cat-icon {
  font-size: 32px;
}
.cat-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* 商品列表 */
.product-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.product-list > * {
  cursor: pointer;
}

.bottom-tip {
  text-align: center;
  color: var(--color-text-light);
  font-size: var(--font-xs);
  margin-top: 16px;
}
</style>

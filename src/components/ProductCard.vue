<script setup lang="ts">
import type { Product } from '@/stores/app'

defineProps<{
  product: Product
}>()
</script>

<template>
  <div class="product-card">
    <div class="card-img">
      <span class="img-placeholder">{{ product.category === '教材' ? '📚' : product.category === '数码' ? '📱' : product.category === '衣物' ? '👗' : '🏠' }}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ product.title }}</h3>
      <div class="card-price">
        <span class="price-current">¥{{ product.price }}</span>
        <span v-if="product.originalPrice" class="price-original">¥{{ product.originalPrice }}</span>
      </div>
      <div class="card-meta">
        <span>{{ product.seller }}</span>
        <span>{{ product.publishTime }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--color-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.card-img {
  height: 140px;
  background: linear-gradient(135deg, #e8f8ef, #d4edda);
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-placeholder {
  font-size: 48px;
}
.card-body {
  padding: 12px;
}
.card-title {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}
.card-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}
.price-current {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}
.price-original {
  font-size: var(--font-xs);
  color: var(--color-text-light);
  text-decoration: line-through;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-xs);
  color: var(--color-text-light);
}
</style>

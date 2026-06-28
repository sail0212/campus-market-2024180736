<script setup lang="ts">
// 二手交易页 - 展示二手商品列表
import { useAppStore } from '@/stores/app'
import ProductCard from '@/components/ProductCard.vue'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

function goToDetail(id: number) {
  router.push(`/detail/${id}`)
}
</script>

<template>
  <div class="trade-view">
    <h2 class="page-title">二手交易</h2>
    <p class="page-desc">校园闲置物品交易，让每一件物品都找到新主人</p>

    <div class="product-grid">
      <div
        v-for="product in store.products"
        :key="product.id"
        @click="goToDetail(product.id)"
      >
        <ProductCard :product="product" />
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
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.product-grid > * {
  cursor: pointer;
}
</style>

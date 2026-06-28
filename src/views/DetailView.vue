<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const productId = computed(() => Number(route.params.id) || 1)
const product = computed(() => store.getProductById(productId.value))

function goBack() {
  router.back()
}
</script>

<template>
  <div class="detail-view">
    <template v-if="product">
      <!-- 图片区 -->
      <div class="image-area">
        <button class="back-btn" @click="goBack">← 返回</button>
        <span class="img-placeholder">
          {{ product.category === '教材' ? '📚' : product.category === '数码' ? '📱' : product.category === '衣物' ? '👗' : '🏠' }}
        </span>
      </div>

      <!-- 价格区 -->
      <div class="price-section card">
        <h1 class="title">{{ product.title }}</h1>
        <div class="price-row">
          <span class="price">¥{{ product.price }}</span>
          <span v-if="product.originalPrice" class="original">¥{{ product.originalPrice }}</span>
          <span class="tag">{{ product.condition }}</span>
        </div>
        <div class="meta-row">
          <span>👀 {{ product.viewCount }} 次浏览</span>
          <span>🕐 {{ product.publishTime }}</span>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="desc-section card">
        <h3>商品描述</h3>
        <p>{{ product.desc }}</p>
      </div>

      <!-- 卖家信息 -->
      <div class="seller-section card">
        <h3>卖家信息</h3>
        <div class="seller-info">
          <span class="avatar">👤</span>
          <div class="seller-meta">
            <span class="seller-name">{{ product.seller }}</span>
            <span class="seller-rate">回复率 98% · 好评率 100%</span>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="bottom-bar">
        <button class="btn-outline">💬 联系卖家</button>
        <button class="btn-primary">🛒 加入购物车</button>
      </div>
    </template>

    <div v-else class="not-found">
      <p>商品不存在</p>
      <button class="btn-primary" @click="router.push('/list')">去逛逛</button>
    </div>
  </div>
</template>

<style scoped>
.image-area {
  height: 260px;
  background: linear-gradient(135deg, #e8f8ef 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  margin: -20px -16px 16px;
}
.img-placeholder {
  font-size: 80px;
}
.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255,255,255,0.85);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: var(--font-sm);
  color: var(--color-text);
}

.card {
  margin-bottom: 12px;
}
.title {
  font-size: var(--font-lg);
  font-weight: 600;
  margin-bottom: 8px;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}
.price {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-primary);
}
.original {
  font-size: var(--font-sm);
  color: var(--color-text-light);
  text-decoration: line-through;
}
.tag {
  font-size: var(--font-xs);
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 4px;
}
.meta-row {
  display: flex;
  gap: 16px;
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

.desc-section h3,
.seller-section h3 {
  font-size: var(--font-md);
  margin-bottom: 8px;
}
.desc-section p {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  font-size: 40px;
}
.seller-meta {
  display: flex;
  flex-direction: column;
}
.seller-name {
  font-weight: 500;
  font-size: var(--font-md);
}
.seller-rate {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: var(--color-card);
  border-top: 1px solid var(--color-border);
}
.btn-outline {
  flex: 1;
  padding: 12px;
  border-radius: 24px;
  font-size: var(--font-md);
  background: var(--color-card);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}
.btn-primary {
  flex: 2;
  padding: 12px;
  border-radius: 24px;
  font-size: var(--font-md);
  background: var(--color-primary);
  color: #fff;
}

.not-found {
  text-align: center;
  padding: 80px 16px;
  color: var(--color-text-light);
}
.not-found .btn-primary {
  margin-top: 16px;
  padding: 10px 32px;
}
</style>

<script setup lang="ts">
// 旧版通用详情页 — 重定向到新的模块化详情页
// 所有内容现在通过 /trade/:id, /lost-found/:id, /group-buy/:id, /errand/:id 访问
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const id = route.params.id || '1'
  router.replace(`/trade/${id}`)
})
</script>

<template>
  <div class="redirect-view">
    <p>正在跳转…</p>
  </div>
</template>

<style scoped>
.redirect-view {
  text-align: center;
  padding: 80px 16px;
  color: var(--color-text-light);
  font-size: var(--font-sm);
}
</style>

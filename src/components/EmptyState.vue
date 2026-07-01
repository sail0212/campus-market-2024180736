<script setup lang="ts">
defineProps<{
  text: string
  icon?: string
  hint?: string
}>()
</script>

<template>
  <div class="empty-state">
    <span v-if="icon" class="empty-icon">{{ icon }}</span>
    <p>{{ text }}</p>
    <p v-if="hint" class="empty-hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 48px 16px;
  text-align: center;
  color: #909399;
  background: #fff;
  border-radius: 12px;
  border: 1px dashed #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.empty-icon {
  font-size: 48px;
  opacity: 0.6;
}
.empty-state p {
  font-size: 14px;
}
.empty-hint {
  font-size: 12px !important;
  color: #b0b3bb;
}
</style>

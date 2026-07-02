<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  search: [keyword: string]
}>()

const keyword = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

function onInput() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    emit('search', keyword.value.trim())
  }, 300)
}

function onClear() {
  keyword.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="search-bar">
    <span class="search-icon">🔍</span>
    <input
      v-model="keyword"
      type="text"
      :placeholder="placeholder || '搜索…'"
      class="search-input"
      @input="onInput"
    />
    <button v-if="keyword" class="clear-btn" @click="onClear">×</button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  margin-bottom: 14px;
  transition: border-color 0.2s;
}
.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(7, 193, 96, 0.1);
}
.search-icon {
  font-size: 16px;
  flex-shrink: 0;
  opacity: 0.6;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: var(--font-sm);
  background: transparent;
  color: var(--color-text);
}
.search-input::placeholder {
  color: var(--color-text-light);
}
.clear-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e4e7ed;
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  flex-shrink: 0;
}
.clear-btn:hover {
  background: #c0c4cc;
  color: #606266;
}
</style>

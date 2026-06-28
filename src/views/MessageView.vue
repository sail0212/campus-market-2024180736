<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const messages = store.messages
</script>

<template>
  <div class="message-view">
    <h2 class="page-title">消息</h2>

    <div v-if="messages.length > 0" class="msg-list">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="msg-item"
      >
        <span class="msg-avatar">👤</span>
        <div class="msg-body">
          <div class="msg-top">
            <span class="msg-name">{{ msg.from }}</span>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
          <div class="msg-bottom">
            <span class="msg-preview">{{ msg.lastMsg }}</span>
            <span v-if="msg.unread > 0" class="msg-badge">{{ msg.unread }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <p class="empty-icon">📭</p>
      <p>暂无消息</p>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: 16px;
}

.msg-list {
  display: flex;
  flex-direction: column;
}
.msg-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
}
.msg-avatar {
  font-size: 40px;
  flex-shrink: 0;
}
.msg-body {
  flex: 1;
  min-width: 0;
}
.msg-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.msg-name {
  font-size: var(--font-md);
  font-weight: 500;
}
.msg-time {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}
.msg-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.msg-preview {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.msg-badge {
  background: var(--color-danger);
  color: #fff;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.empty {
  text-align: center;
  padding: 80px 0;
  color: var(--color-text-light);
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
</style>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const messages = store.messages
</script>

<template>
  <div class="message-view">
    <div class="page-header">
      <h2 class="page-title">消息中心</h2>
      <p class="page-desc">查看系统通知、收藏提醒和互动消息</p>
    </div>

    <!-- 系统通知区域 -->
    <div class="notice-section">
      <h3 class="section-title">📢 系统通知</h3>
      <div class="notice-card card">
        <article class="notice-item">
          <h4>欢迎使用校园轻集市</h4>
          <p>你可以在这里发布二手商品、失物招领、拼单搭子和跑腿委托。</p>
          <span class="notice-time">刚刚</span>
        </article>
        <article class="notice-item">
          <h4>功能提示</h4>
          <p>收藏的信息可以在个人中心中查看，记得常来看看哦～</p>
          <span class="notice-time">1天前</span>
        </article>
        <article class="notice-item">
          <h4>安全提醒</h4>
          <p>线下交易请注意人身和财产安全，建议选择校内公共场所进行当面交易。</p>
          <span class="notice-time">3天前</span>
        </article>
      </div>
    </div>

    <!-- 互动消息 -->
    <div class="chat-section">
      <h3 class="section-title">💬 互动消息</h3>

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
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 20px;
}
.page-title {
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: 4px;
}
.page-desc {
  font-size: var(--font-sm);
  color: var(--color-text-light);
}

.section-title {
  font-size: var(--font-md);
  font-weight: 600;
  margin-bottom: 10px;
}

/* ===== 系统通知 ===== */
.notice-section {
  margin-bottom: 24px;
}
.notice-card {
  display: flex;
  flex-direction: column;
}
.notice-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-light);
  position: relative;
}
.notice-item:last-child {
  border-bottom: none;
}
.notice-item h4 {
  font-size: var(--font-sm);
  font-weight: 600;
  margin-bottom: 2px;
}
.notice-item p {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.notice-time {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

/* ===== 互动消息 ===== */
.chat-section {
  margin-bottom: 24px;
}
.msg-list {
  display: flex;
  flex-direction: column;
}
.msg-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  margin-bottom: 2px;
  cursor: pointer;
  transition: background 0.15s;
}
.msg-item:hover {
  background: #fafafa;
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
  padding: 60px 0;
  color: var(--color-text-light);
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
</style>

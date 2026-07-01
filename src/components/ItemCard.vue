<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  tags?: string[]
  status?: string
  highlight?: string
  footer?: string
  favorited?: boolean
}>()
</script>

<template>
  <div class="item-card">
    <div class="card-body">
      <div class="card-top">
        <h3 class="card-title">{{ title }}</h3>
        <span v-if="status" class="card-status" :class="status">{{ statusLabel }}</span>
      </div>
      <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      <div v-if="tags && tags.length" class="card-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="card-bottom">
        <span v-if="highlight" class="card-highlight">{{ highlight }}</span>
        <span v-if="footer" class="card-footer">{{ footer }}</span>
      </div>
      <!-- 操作按钮插槽（收藏等） -->
      <div v-if="favorited !== undefined || $slots.actions" class="card-actions">
        <span v-if="favorited !== undefined" class="fav-indicator" :class="{ active: favorited }">
          {{ favorited ? '❤️' : '🤍' }}
        </span>
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 状态标签映射
const statusLabels: Record<string, string> = {
  open: '进行中',
  closed: '已关闭',
  done: '已完成',
  in_progress: '进行中',
  lost: '失物',
  found: '招领',
  ping: '拼单',
  dazi: '搭子',
  team: '组队',
}

export default {
  computed: {
    statusLabel(): string {
      return statusLabels[(this as any).status as string || ''] || (this as any).status as string || ''
    },
  },
}
</script>

<style scoped>
.item-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.item-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  flex: 1;
}
.card-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  font-weight: 500;
}
.card-status.open,
.card-status.in_progress {
  background: #e8f8ef;
  color: #07c160;
}
.card-status.closed,
.card-status.done {
  background: #f0f0f0;
  color: #909399;
}
.card-status.lost {
  background: #fde8ec;
  color: #f56c6c;
}
.card-status.found {
  background: #e8f8ef;
  color: #07c160;
}
.card-status.ping {
  background: #fef5e7;
  color: #e6a23c;
}
.card-status.dazi {
  background: #e8f8ef;
  color: #07c160;
}
.card-status.team {
  background: #e8f0fe;
  color: #409eff;
}

.card-subtitle {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.tag {
  font-size: 11px;
  background: #f5f6fa;
  color: #606266;
  padding: 2px 8px;
  border-radius: 4px;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
.card-highlight {
  font-size: 18px;
  font-weight: 700;
  color: #07c160;
}
.card-footer {
  font-size: 12px;
  color: #909399;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
}
.fav-indicator {
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.15s;
  user-select: none;
}
.fav-indicator:hover {
  transform: scale(1.2);
}
.fav-indicator.active {
  filter: none;
}
</style>

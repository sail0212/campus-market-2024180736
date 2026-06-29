/**
 * 格式化时间为相对时间描述
 */
export function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) {
    const minutes = Math.floor(diff / 60000)
    return minutes < 1 ? '刚刚' : minutes + '分钟前'
  }
  if (hours < 24) return hours + '小时前'
  const days = Math.floor(hours / 24)
  if (days < 30) return days + '天前'
  return d.toLocaleDateString('zh-CN')
}

/**
 * 格式化完整日期时间
 */
export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 状态标签映射（通用）
 */
export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    open: '进行中',
    closed: '已关闭',
    done: '已完成',
    in_progress: '进行中',
    lost: '失物',
    found: '招领',
    ping: '拼单',
    dazi: '搭子',
    team: '组队',
    pending: '待审核',
  }
  return map[status] || status
}

/**
 * 跑腿状态中文
 */
export function errandStatusLabel(status: string): string {
  const map: Record<string, string> = {
    open: '待接单',
    in_progress: '进行中',
    done: '已完成',
  }
  return map[status] || status
}

/**
 * 紧急程度标签
 */
export function urgencyLabel(urgency: string): string {
  const map: Record<string, string> = {
    low: '不急',
    medium: '一般',
    high: '紧急',
  }
  return map[urgency] || urgency
}

/**
 * 任务类型标签
 */
export function taskTypeLabel(type: string): string {
  const map: Record<string, string> = {
    '代买': '🛒 代买',
    '代办': '📋 代办',
    '代取': '📦 代取',
    '代送': '🚀 代送',
  }
  return map[type] || type
}

/**
 * 计算截止日期剩余时间
 */
export function deadlineRemaining(deadline: string): { text: string; expired: boolean } {
  const now = new Date().getTime()
  const end = new Date(deadline).getTime()
  const diff = end - now
  if (diff <= 0) return { text: '已截止', expired: true }
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) {
    const mins = Math.floor(diff / 60000)
    return { text: `剩余${mins}分钟`, expired: false }
  }
  if (hours < 24) return { text: `剩余${hours}小时`, expired: false }
  const days = Math.floor(hours / 24)
  return { text: `剩余${days}天`, expired: false }
}

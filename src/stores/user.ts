import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 用户状态 Store
 * 管理当前登录用户的基本信息（Day5 使用模拟数据，不接入真实登录）
 */
export interface UserProfile {
  name: string
  avatar: string
  school: string
  department: string
  grade: string
  published: number
  sold: number
  bought: number
}

export const useUserStore = defineStore('user', () => {
  // ===== 模拟用户数据 =====
  const user = ref<UserProfile>({
    name: '小明',
    avatar: '',
    school: '某某大学',
    department: '计算机科学与技术学院',
    grade: '2024级',
    published: 16,
    sold: 8,
    bought: 5,
  })

  const isLoggedIn = ref(true) // Day5 阶段固定为已登录

  // ===== Getters =====
  const displayName = computed(() => user.value.name)
  const userStats = computed(() => ({
    published: user.value.published,
    sold: user.value.sold,
    bought: user.value.bought,
  }))

  // ===== Actions =====
  function setUser(profile: Partial<UserProfile>) {
    Object.assign(user.value, profile)
  }

  function incrementPublished() {
    user.value.published++
  }

  /** 退出登录（Day5 仅置空用户信息） */
  function logout() {
    user.value = {
      name: '',
      avatar: '',
      school: '',
      department: '',
      grade: '',
      published: 0,
      sold: 0,
      bought: 0,
    }
    isLoggedIn.value = false
  }

  return {
    user,
    isLoggedIn,
    displayName,
    userStats,
    setUser,
    incrementPublished,
    logout,
  }
})

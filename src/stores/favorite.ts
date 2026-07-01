import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 收藏项类型
 * type: 对应业务类型 'trade' | 'lostFound' | 'groupBuy' | 'errand'
 */
export interface FavoriteItem {
  id: number
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  title: string
  addedAt: string
}

/**
 * 收藏状态 Store
 * 管理用户收藏的商品/信息列表（仅前端内存，刷新后丢失）
 */
export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref<FavoriteItem[]>([])

  // ===== Getters =====
  const favoriteCount = computed(() => favorites.value.length)

  /** 按业务类型过滤收藏 */
  function favoritesByType(type: FavoriteItem['type']) {
    return computed(() => favorites.value.filter((f) => f.type === type))
  }

  /** 判断某条信息是否已收藏 */
  function isFavorited(id: number, type: FavoriteItem['type']): boolean {
    return favorites.value.some((f) => f.id === id && f.type === type)
  }

  // ===== Actions =====
  function addFavorite(id: number, type: FavoriteItem['type'], title: string) {
    if (isFavorited(id, type)) return
    favorites.value.push({
      id,
      type,
      title,
      addedAt: new Date().toISOString(),
    })
  }

  function removeFavorite(id: number, type: FavoriteItem['type']) {
    const idx = favorites.value.findIndex((f) => f.id === id && f.type === type)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    }
  }

  /** 切换收藏状态 */
  function toggleFavorite(id: number, type: FavoriteItem['type'], title: string) {
    if (isFavorited(id, type)) {
      removeFavorite(id, type)
    } else {
      addFavorite(id, type, title)
    }
  }

  return {
    favorites,
    favoriteCount,
    favoritesByType,
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
})

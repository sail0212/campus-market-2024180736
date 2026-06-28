<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  title: '',
  category: '',
  price: '',
  desc: '',
  condition: '九成新',
})

const submitted = ref(false)

function submit() {
  if (!form.value.title || !form.value.category || !form.value.price) {
    alert('请填写标题、分类和价格')
    return
  }
  submitted.value = true
  setTimeout(() => {
    router.push('/list')
  }, 1500)
}
</script>

<template>
  <div class="publish-view">
    <h2 class="page-title">发布商品</h2>

    <div v-if="submitted" class="success-card card">
      <p class="success-icon">✅</p>
      <p class="success-text">发布成功！</p>
      <p class="success-sub">正在跳转到列表页…</p>
    </div>

    <form v-else class="publish-form" @submit.prevent="submit">
      <!-- 标题 -->
      <div class="form-group">
        <label>商品标题 <span class="required">*</span></label>
        <input v-model="form.title" placeholder="例如：高等数学第七版" maxlength="50" />
      </div>

      <!-- 分类 -->
      <div class="form-group">
        <label>分类 <span class="required">*</span></label>
        <div class="cat-options">
          <label v-for="cat in ['教材', '数码', '衣物', '生活']" :key="cat" class="cat-radio">
            <input type="radio" v-model="form.category" :value="cat" />
            <span>{{ cat }}</span>
          </label>
        </div>
      </div>

      <!-- 价格 -->
      <div class="form-row">
        <div class="form-group flex-2">
          <label>价格 (¥) <span class="required">*</span></label>
          <input v-model="form.price" type="number" placeholder="0" min="0" />
        </div>
        <div class="form-group flex-1">
          <label>成色</label>
          <select v-model="form.condition">
            <option>九九新</option>
            <option>九成新</option>
            <option>八成新</option>
            <option>七成新</option>
            <option>六成新</option>
          </select>
        </div>
      </div>

      <!-- 描述 -->
      <div class="form-group">
        <label>商品描述</label>
        <textarea v-model="form.desc" rows="5" placeholder="说说商品的具体情况，更容易卖出去哦~" maxlength="500"></textarea>
        <span class="char-count">{{ form.desc.length }}/500</span>
      </div>

      <!-- 图片占位 -->
      <div class="form-group">
        <label>商品图片</label>
        <div class="upload-area">
          <span class="upload-icon">📷</span>
          <span class="upload-text">点击上传图片</span>
          <span class="upload-hint">最多 9 张（暂为演示占位）</span>
        </div>
      </div>

      <button type="submit" class="submit-btn">立即发布</button>
    </form>
  </div>
</template>

<style scoped>
.page-title {
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: 20px;
}

.success-card {
  text-align: center;
  padding: 60px 20px;
}
.success-icon {
  font-size: 48px;
}
.success-text {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 12px 0 4px;
}
.success-sub {
  font-size: var(--font-sm);
  color: var(--color-text-light);
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}
.required {
  color: var(--color-danger);
}
.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-md);
  background: var(--color-card);
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-primary);
}
.char-count {
  text-align: right;
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

.form-row {
  display: flex;
  gap: 12px;
}
.flex-2 { flex: 2; }
.flex-1 { flex: 1; }

.cat-options {
  display: flex;
  gap: 10px;
}
.cat-radio {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: var(--font-sm);
}

.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.upload-icon {
  font-size: 32px;
}
.upload-text {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.upload-hint {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

.submit-btn {
  margin-top: 8px;
  padding: 14px;
  border-radius: 24px;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-lg);
  font-weight: 600;
  transition: opacity 0.2s;
}
.submit-btn:hover {
  opacity: 0.9;
}
</style>

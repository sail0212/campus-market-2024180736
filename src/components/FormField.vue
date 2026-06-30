<template>
  <div class="form-group">
    <label v-if="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <slot />
    <span v-if="error" class="field-error">{{ error }}</span>
    <span v-else-if="hint" class="char-count">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * FormField - 基础表单项容器组件
 * 统一表单项的标题、必填标识和错误提示
 *
 * 使用方式：
 * <FormField label="标题" required :error="errors.title">
 *   <input v-model="title" placeholder="请输入标题" />
 * </FormField>
 */
defineProps<{
  /** 字段标签 */
  label?: string
  /** 是否必填（显示红色 *） */
  required?: boolean
  /** 校验错误信息 */
  error?: string
  /** 提示文本（无错误时显示） */
  hint?: string
}>()
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-group label {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}
.required {
  color: var(--color-danger);
}
.field-error {
  font-size: var(--font-xs);
  color: var(--color-danger);
  margin-top: 2px;
}
.char-count {
  text-align: right;
  font-size: var(--font-xs);
  color: var(--color-text-light);
}
</style>

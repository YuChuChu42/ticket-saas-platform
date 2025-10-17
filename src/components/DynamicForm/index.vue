<template>
  <el-form
    ref="formRef"
    :model="modelValue"
    :rules="formRules"
    label-width="120px"
    label-position="right"
  >
    <el-row :gutter="20">
      <el-col
        v-for="field in visibleFields"
        :key="field.key"
        :span="field.span || 12"
      >
        <el-form-item :label="field.label" :prop="field.key">
          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input'"
            v-model="modelValue[field.key]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            clearable
            v-bind="field.props"
          />

          <!-- 文本域 -->
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="modelValue[field.key]"
            type="textarea"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            v-bind="field.props"
          />

          <!-- 下拉选择 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="modelValue[field.key]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            clearable
            style="width: 100%"
            v-bind="field.props"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>

          <!-- 日期选择 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="modelValue[field.key]"
            type="date"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            style="width: 100%"
            v-bind="field.props"
          />

          <!-- 数字输入 -->
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="modelValue[field.key]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            style="width: 100%"
            v-bind="field.props"
          />

          <!-- 单选框 -->
          <el-radio-group
            v-else-if="field.type === 'radio'"
            v-model="modelValue[field.key]"
            :disabled="field.disabled"
            v-bind="field.props"
          >
            <el-radio
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>

          <!-- 复选框 -->
          <el-checkbox-group
            v-else-if="field.type === 'checkbox'"
            v-model="modelValue[field.key]"
            :disabled="field.disabled"
            v-bind="field.props"
          >
            <el-checkbox
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- 文件上传 -->
          <FileUpload
            v-else-if="field.type === 'upload'"
            v-model="modelValue[field.key]"
            v-bind="field.props"
          />

          <!-- 级联选择 -->
          <el-cascader
            v-else-if="field.type === 'cascader'"
            v-model="modelValue[field.key]"
            :options="field.options"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            style="width: 100%"
            v-bind="field.props"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FormSchema, FormField } from '@/types'
import FileUpload from './FileUpload.vue'

interface Props {
  schema: FormSchema
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref<FormInstance>()

// 表单规则
const formRules = computed(() => {
  const rules: Record<string, any> = {}
  props.schema.fields.forEach((field) => {
    if (field.rules) {
      rules[field.key] = field.rules
    }
  })
  return rules
})

// 可见字段（根据依赖条件过滤）
const visibleFields = computed(() => {
  return props.schema.fields.filter((field) => {
    if (field.hidden) return false
    
    // 检查字段依赖
    if (field.dependencies && field.dependencies.length > 0) {
      return field.dependencies.every((dep) => {
        const value = props.modelValue[dep.field]
        const conditionMet = checkCondition(value, dep.condition, dep.value)
        
        // 根据 action 决定是否显示
        if (dep.action === 'show') {
          return conditionMet
        } else if (dep.action === 'hide') {
          return !conditionMet
        }
        
        return true
      })
    }
    
    return true
  })
})

// 检查条件
function checkCondition(value: any, condition: string, targetValue: any): boolean {
  switch (condition) {
    case 'eq':
      return value === targetValue
    case 'neq':
      return value !== targetValue
    case 'gt':
      return value > targetValue
    case 'lt':
      return value < targetValue
    case 'in':
      return Array.isArray(targetValue) && targetValue.includes(value)
    default:
      return true
  }
}

// 表单验证
async function validate() {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 重置表单
function reset() {
  formRef.value?.resetFields()
}

// 清空验证
function clearValidate() {
  formRef.value?.clearValidate()
}

defineExpose({
  validate,
  reset,
  clearValidate,
})

// 监听字段依赖变化，动态调整字段状态
watch(
  () => props.modelValue,
  () => {
    props.schema.fields.forEach((field) => {
      if (field.dependencies && field.dependencies.length > 0) {
        field.dependencies.forEach((dep) => {
          const value = props.modelValue[dep.field]
          const conditionMet = checkCondition(value, dep.condition, dep.value)
          
          // 根据 action 执行操作
          if (dep.action === 'enable' || dep.action === 'disable') {
            field.disabled = dep.action === 'disable' ? conditionMet : !conditionMet
          } else if (dep.action === 'required') {
            field.required = conditionMet
          }
        })
      }
    })
  },
  { deep: true }
)
</script>


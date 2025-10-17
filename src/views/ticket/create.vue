<template>
  <div class="ticket-create-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建工单</span>
          <el-button text @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>
      </template>

      <!-- 使用动态表单引擎 -->
      <DynamicForm
        ref="dynamicFormRef"
        :schema="formSchema"
        v-model="formData"
        @submit="handleSubmit"
      />

      <div class="form-actions">
        <el-button @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          提交工单
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DynamicForm from '@/components/DynamicForm/index.vue'
import { draftDB } from '@/utils/indexedDB'
import type { FormSchema } from '@/types'

const router = useRouter()
const dynamicFormRef = ref()
const submitting = ref(false)

const formData = reactive<any>({})

// 表单配置
const formSchema = ref<FormSchema>({
  id: 'ticket-create-form',
  name: '创建工单表单',
  fields: [
    {
      key: 'title',
      label: '工单标题',
      type: 'input',
      required: true,
      placeholder: '请输入工单标题',
      span: 24,
      rules: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
    },
    {
      key: 'type',
      label: '工单类型',
      type: 'select',
      required: true,
      options: [
        { label: '故障', value: 'bug' },
        { label: '需求', value: 'feature' },
        { label: '支持', value: 'support' },
        { label: '咨询', value: 'inquiry' },
        { label: '其他', value: 'other' },
      ],
      span: 12,
      rules: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
    },
    {
      key: 'priority',
      label: '优先级',
      type: 'select',
      required: true,
      options: [
        { label: '低', value: 'low' },
        { label: '中', value: 'medium' },
        { label: '高', value: 'high' },
        { label: '紧急', value: 'urgent' },
      ],
      span: 12,
      rules: [{ required: true, message: '请选择优先级', trigger: 'change' }],
    },
    {
      key: 'description',
      label: '工单描述',
      type: 'textarea',
      required: true,
      placeholder: '请详细描述问题或需求',
      span: 24,
      props: { rows: 6 },
      rules: [{ required: true, message: '请输入工单描述', trigger: 'blur' }],
    },
    {
      key: 'assigneeId',
      label: '负责人',
      type: 'select',
      placeholder: '请选择负责人',
      options: [],
      span: 12,
    },
    {
      key: 'deadline',
      label: '截止时间',
      type: 'date',
      placeholder: '请选择截止时间',
      span: 12,
    },
    {
      key: 'attachments',
      label: '附件',
      type: 'upload',
      span: 24,
      props: {
        action: '/api/upload',
        multiple: true,
        limit: 5,
      },
    },
    {
      key: 'tags',
      label: '标签',
      type: 'select',
      placeholder: '请选择标签',
      span: 24,
      props: {
        multiple: true,
      },
      options: [
        { label: '紧急', value: '紧急' },
        { label: '重要', value: '重要' },
        { label: '普通', value: '普通' },
      ],
    },
  ],
})

onMounted(async () => {
  // 尝试从草稿箱恢复
  const draft = await draftDB.get('ticket-create')
  if (draft) {
    Object.assign(formData, draft)
    ElMessage.info('已从草稿箱恢复')
  }
})

// 保存草稿
async function handleSaveDraft() {
  await draftDB.save('ticket-create', formData)
  ElMessage.success('草稿保存成功')
}

// 提交表单
async function handleSubmit() {
  try {
    const valid = await dynamicFormRef.value.validate()
    if (!valid) return

    submitting.value = true

    // 提交到后端
    // await request.post('/tickets', formData)
    
    // 提交成功后删除草稿
    await draftDB.delete('ticket-create')

    ElMessage.success('工单创建成功')
    router.push('/ticket/list')
  } catch (error: any) {
    ElMessage.error(error.message || '创建失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.ticket-create-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>


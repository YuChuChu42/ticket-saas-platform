<template>
  <div class="ticket-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>工单详情</span>
          <el-button text @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="工单编号">{{ ticket.ticketNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(ticket.status)">{{ getStatusLabel(ticket.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="标题" :span="2">{{ ticket.title }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ ticket.description }}</el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(ticket.priority)">{{ getPriorityLabel(ticket.priority) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="类型">{{ ticket.type }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ ticket.creatorName }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ ticket.assigneeName || '未分配' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ ticket.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ ticket.updatedAt }}</el-descriptions-item>
      </el-descriptions>

      <div class="actions" v-perm="'ticket:manage'">
        <el-button type="primary" @click="handleAssign">分配</el-button>
        <el-button type="success" @click="handleResolve">解决</el-button>
        <el-button type="warning" @click="handleTransfer">转派</el-button>
        <el-button type="danger" @click="handleClose">关闭</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Ticket } from '@/types'

const route = useRoute()
const loading = ref(false)
const ticket = ref<Partial<Ticket>>({})

onMounted(() => {
  loadTicket()
})

async function loadTicket() {
  const id = route.params.id
  // 模拟数据
  ticket.value = {
    id: Number(id),
    ticketNo: `TK202401${String(id).padStart(4, '0')}`,
    title: '测试工单标题',
    description: '这是一个测试工单描述',
    type: 'bug',
    priority: 'high',
    status: 'pending',
    creatorId: 1,
    creatorName: '张三',
    assigneeId: 2,
    assigneeName: '李四',
    departmentId: 1,
    departmentName: '技术部',
    createdAt: '2024-01-15 14:30',
    updatedAt: '2024-01-15 14:30',
  }
}

function getPriorityType(priority: any) {
  const map: Record<string, any> = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger',
  }
  return map[priority]
}

function getPriorityLabel(priority: any) {
  const map: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急',
  }
  return map[priority]
}

function getStatusType(status: any) {
  const map: Record<string, any> = {
    pending: 'warning',
    processing: '',
    resolved: 'success',
    closed: 'info',
  }
  return map[status]
}

function getStatusLabel(status: any) {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭',
  }
  return map[status]
}

function handleAssign() {
  console.log('分配')
}

function handleResolve() {
  console.log('解决')
}

function handleTransfer() {
  console.log('转派')
}

function handleClose() {
  console.log('关闭')
}
</script>

<style lang="scss" scoped>
.ticket-detail-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>


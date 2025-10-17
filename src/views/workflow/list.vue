<template>
  <div class="workflow-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>流程列表</span>
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            创建流程
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" stripe>
        <el-table-column prop="name" label="流程名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleDesign(row)">
              设计
            </el-button>
            <el-button link type="warning" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tableData = ref<any[]>([])

onMounted(() => {
  loadData()
})

function loadData() {
  tableData.value = [
    {
      id: 1,
      name: '工单审批流程',
      description: '用于工单的审批流程',
      status: 'active',
      createdAt: '2024-01-15 14:30',
    },
    {
      id: 2,
      name: '采购审批流程',
      description: '用于采购订单的审批流程',
      status: 'active',
      createdAt: '2024-01-15 14:30',
    },
  ]
}

function handleCreate() {
  router.push('/workflow/design')
}

function handleDesign(row: any) {
  router.push(`/workflow/design/${row.id}`)
}

function handleEdit(row: any) {
  console.log('编辑', row)
}

function handleDelete(row: any) {
  console.log('删除', row)
}
</script>

<style lang="scss" scoped>
.workflow-list-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>


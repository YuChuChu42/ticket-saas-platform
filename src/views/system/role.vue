<template>
  <div class="role-management-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" :icon="Plus">新增角色</el-button>
        </div>
      </template>

      <el-table :data="tableData" stripe>
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色编码" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="warning" size="small">权限</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tableData = ref<any[]>([])

onMounted(() => {
  tableData.value = [
    {
      id: 1,
      name: '超级管理员',
      code: 'super_admin',
      description: '拥有所有权限',
      status: 1,
      createdAt: '2024-01-01 00:00:00',
    },
    {
      id: 2,
      name: '运营人员',
      code: 'operator',
      description: '运营相关权限',
      status: 1,
      createdAt: '2024-01-01 00:00:00',
    },
  ]
})
</script>

<style lang="scss" scoped>
.role-management-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>


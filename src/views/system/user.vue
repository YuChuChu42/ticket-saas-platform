<template>
  <div class="user-management-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" :icon="Plus">新增用户</el-button>
        </div>
      </template>

      <el-table :data="tableData" stripe>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="roleName" label="角色" width="120" />
        <el-table-column prop="departmentName" label="部门" width="120" />
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
            <el-button link type="danger" size="small">删除</el-button>
            <el-button link type="warning" size="small">重置密码</el-button>
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
      username: 'admin',
      realName: '管理员',
      email: 'admin@example.com',
      roleName: '超级管理员',
      departmentName: '管理部',
      status: 1,
      createdAt: '2024-01-01 00:00:00',
    },
  ]
})
</script>

<style lang="scss" scoped>
.user-management-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>


<template>
  <div class="inventory-list-container">
    <el-card>
      <template #header>
        <span>库存列表</span>
      </template>

      <el-table :data="tableData" stripe border>
        <el-table-column prop="productName" label="产品名称" min-width="150" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="quantity" label="库存数量" width="100" align="right" />
        <el-table-column prop="safetyStock" label="安全库存" width="100" align="right" />
        <el-table-column prop="warehouseName" label="仓库" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
})

const tableData = ref<any[]>([])

onMounted(() => {
  loadData()
})

function loadData() {
  // 模拟数据
  const mockData = []
  for (let i = 1; i <= 50; i++) {
    mockData.push({
      id: i,
      productName: `产品${i}`,
      sku: `SKU-${String(i).padStart(5, '0')}`,
      quantity: Math.floor(Math.random() * 1000),
      safetyStock: 100,
      warehouseName: '主仓库',
      status: ['normal', 'warning', 'critical'][Math.floor(Math.random() * 3)],
    })
  }
  tableData.value = mockData
  pagination.total = mockData.length
}

function getStatusType(status: string) {
  const map: Record<string, any> = {
    normal: 'success',
    warning: 'warning',
    critical: 'danger',
  }
  return map[status]
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    normal: '正常',
    warning: '预警',
    critical: '紧急',
  }
  return map[status]
}

function handleEdit(row: any) {
  console.log('编辑', row)
}

function handleDelete(row: any) {
  console.log('删除', row)
}
</script>

<style lang="scss" scoped>
.inventory-list-container {
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>


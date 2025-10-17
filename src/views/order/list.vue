<template>
  <div class="order-list-container">
    <el-card>
      <template #header>
        <span>订单列表</span>
      </template>

      <el-table :data="tableData" stripe border>
        <el-table-column prop="orderNo" label="订单编号" width="150" />
        <el-table-column prop="customerName" label="客户" width="120" />
        <el-table-column prop="orderType" label="订单类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ getOrderTypeLabel(row.orderType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.totalAmount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  const mockData = []
  for (let i = 1; i <= 30; i++) {
    mockData.push({
      id: i,
      orderNo: `OR202401${String(i).padStart(4, '0')}`,
      customerName: `客户${i}`,
      orderType: ['purchase', 'sale', 'return'][Math.floor(Math.random() * 3)],
      totalAmount: Math.floor(Math.random() * 100000) + 1000,
      status: ['pending', 'confirmed', 'shipped', 'completed'][Math.floor(Math.random() * 4)],
      createdAt: '2024-01-15 14:30',
    })
  }
  tableData.value = mockData
  pagination.total = mockData.length
}

function getOrderTypeLabel(type: string) {
  const map: Record<string, string> = {
    purchase: '采购',
    sale: '销售',
    return: '退货',
  }
  return map[type]
}

function getStatusType(status: string) {
  const map: Record<string, any> = {
    pending: 'warning',
    confirmed: '',
    shipped: 'success',
    completed: 'success',
  }
  return map[status]
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    shipped: '已发货',
    completed: '已完成',
  }
  return map[status]
}

function handleView(row: any) {
  router.push(`/order/detail/${row.id}`)
}
</script>

<style lang="scss" scoped>
.order-list-container {
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>


<template>
  <div class="order-detail-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单详情</span>
          <el-button text @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{ order.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag>{{ order.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户">{{ order.customerName }}</el-descriptions-item>
        <el-descriptions-item label="订单类型">{{ order.orderType }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ order.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ order.createdAt }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const order = ref<any>({})

onMounted(() => {
  const id = route.params.id
  order.value = {
    id,
    orderNo: `OR202401${String(id).padStart(4, '0')}`,
    customerName: '客户名称',
    orderType: '销售',
    totalAmount: 12345,
    status: '已确认',
    createdAt: '2024-01-15 14:30',
  }
})
</script>

<style lang="scss" scoped>
.order-detail-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>


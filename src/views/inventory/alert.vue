<template>
  <div class="inventory-alert-container">
    <el-card>
      <template #header>
        <span>库存告警</span>
      </template>

      <el-alert
        title="您有 15 个库存告警需要处理"
        type="warning"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      />

      <el-table :data="alertData" stripe>
        <el-table-column prop="productName" label="产品名称" min-width="150" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="quantity" label="当前库存" width="100" align="right">
          <template #default="{ row }">
            <span style="color: #f56c6c">{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="safetyStock" label="安全库存" width="100" align="right" />
        <el-table-column prop="warehouseName" label="仓库" width="120" />
        <el-table-column prop="alertLevel" label="告警级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getAlertType(row.alertLevel)">{{ row.alertLevel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handlePurchase(row)">
              采购补货
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const alertData = ref<any[]>([])

onMounted(() => {
  loadAlertData()
})

function loadAlertData() {
  // 模拟告警数据
  const mockData = []
  for (let i = 1; i <= 15; i++) {
    mockData.push({
      id: i,
      productName: `产品${i}`,
      sku: `SKU-${String(i).padStart(5, '0')}`,
      quantity: Math.floor(Math.random() * 50),
      safetyStock: 100,
      warehouseName: '主仓库',
      alertLevel: Math.random() > 0.5 ? '预警' : '紧急',
    })
  }
  alertData.value = mockData
}

function getAlertType(level: string) {
  return level === '紧急' ? 'danger' : 'warning'
}

function handlePurchase(row: any) {
  console.log('采购补货', row)
}
</script>

<style lang="scss" scoped>
.inventory-alert-container {
  //
}
</style>


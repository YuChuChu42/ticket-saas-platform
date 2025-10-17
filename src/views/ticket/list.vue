<template>
  <div class="ticket-list-container">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="工单编号">
          <el-input v-model="searchForm.ticketNo" placeholder="请输入工单编号" clearable />
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="searchForm.priority" placeholder="请选择优先级" clearable>
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>工单列表</span>
          <div>
            <el-button
              v-perm="'ticket:create'"
              type="primary"
              :icon="Plus"
              @click="$router.push('/ticket/create')"
            >
              创建工单
            </el-button>
            <el-button :icon="Download" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <!-- 使用虚拟滚动列表 -->
      <VirtualList
        ref="virtualListRef"
        :data="tableData"
        :item-height="60"
        :height="600"
      >
        <template #default="{ item }">
          <div class="ticket-item" @click="handleView(item)">
            <div class="ticket-header">
              <div class="ticket-no">{{ item.ticketNo }}</div>
              <el-tag :type="getPriorityType(item.priority)" size="small">
                {{ getPriorityLabel(item.priority) }}
              </el-tag>
              <el-tag :type="getStatusType(item.status)" size="small">
                {{ getStatusLabel(item.status) }}
              </el-tag>
            </div>
            <div class="ticket-title">{{ item.title }}</div>
            <div class="ticket-footer">
              <span>创建人: {{ item.creatorName }}</span>
              <span>负责人: {{ item.assigneeName || '未分配' }}</span>
              <span>{{ item.createdAt }}</span>
            </div>
          </div>
        </template>
      </VirtualList>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Ticket } from '@/types'
import VirtualList from '@/components/VirtualList/index.vue'

const router = useRouter()

const searchForm = reactive({
  ticketNo: '',
  status: '',
  priority: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
})

const tableData = ref<Ticket[]>([])
const virtualListRef = ref()

onMounted(() => {
  loadData()
})

// 加载数据
async function loadData() {
  // 模拟数据
  const mockData: Ticket[] = []
  for (let i = 1; i <= 100; i++) {
    mockData.push({
      id: i,
      ticketNo: `TK202401${String(i).padStart(4, '0')}`,
      title: `测试工单标题 ${i}`,
      description: '这是一个测试工单描述',
      type: 'bug',
      priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as any,
      status: ['pending', 'processing', 'resolved', 'closed'][Math.floor(Math.random() * 4)] as any,
      creatorId: 1,
      creatorName: '张三',
      assigneeId: 2,
      assigneeName: '李四',
      departmentId: 1,
      departmentName: '技术部',
      createdAt: '2024-01-15 14:30',
      updatedAt: '2024-01-15 14:30',
    })
  }
  
  tableData.value = mockData
  pagination.total = mockData.length
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function handleReset() {
  searchForm.ticketNo = ''
  searchForm.status = ''
  searchForm.priority = ''
  handleSearch()
}

function handleView(row: Ticket) {
  router.push(`/ticket/detail/${row.id}`)
}

function handleExport() {
  console.log('导出数据')
}

function handleSizeChange() {
  loadData()
}

function handleCurrentChange() {
  loadData()
}

function getPriorityType(priority: string) {
  const map: Record<string, any> = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger',
  }
  return map[priority]
}

function getPriorityLabel(priority: string) {
  const map: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急',
  }
  return map[priority]
}

function getStatusType(status: string) {
  const map: Record<string, any> = {
    pending: 'warning',
    processing: '',
    resolved: 'success',
    closed: 'info',
  }
  return map[status]
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭',
  }
  return map[status]
}
</script>

<style lang="scss" scoped>
.ticket-list-container {
  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ticket-item {
      padding: 15px;
      border-bottom: 1px solid #ebeef5;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      .ticket-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;

        .ticket-no {
          font-weight: 500;
          color: #409eff;
        }
      }

      .ticket-title {
        font-size: 14px;
        color: #303133;
        margin-bottom: 8px;
      }

      .ticket-footer {
        display: flex;
        gap: 20px;
        font-size: 12px;
        color: #909399;
      }
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>


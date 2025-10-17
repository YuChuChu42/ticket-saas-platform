<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <el-icon :size="32"><Tickets /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-title">工单总数</div>
            <div class="stat-value">{{ stats.ticketStats.total }}</div>
            <div class="stat-footer">
              <span class="stat-label">待处理</span>
              <span class="stat-number">{{ stats.ticketStats.pending }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <el-icon :size="32"><Box /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-title">库存总数</div>
            <div class="stat-value">{{ stats.inventoryStats.total }}</div>
            <div class="stat-footer">
              <span class="stat-label">预警</span>
              <span class="stat-number critical">{{ stats.inventoryStats.critical }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-title">订单总数</div>
            <div class="stat-value">{{ stats.orderStats.total }}</div>
            <div class="stat-footer">
              <span class="stat-label">今日</span>
              <span class="stat-number">{{ stats.orderStats.todayOrders }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <el-icon :size="32"><Money /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-title">今日金额</div>
            <div class="stat-value">¥{{ formatNumber(stats.orderStats.todayAmount) }}</div>
            <div class="stat-footer">
              <span class="stat-label">总金额</span>
              <span class="stat-number">¥{{ formatNumber(stats.orderStats.totalAmount) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :sm="24" :md="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>工单趋势</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
                <el-radio-button label="year">近1年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <v-chart class="chart" :option="ticketTrendOption" autoresize />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="chart-card">
          <template #header>
            <span>工单状态分布</span>
          </template>
          <v-chart class="chart" :option="ticketStatusOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <span>库存告警情况</span>
          </template>
          <v-chart class="chart" :option="inventoryAlertOption" autoresize />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <span>订单金额趋势</span>
          </template>
          <v-chart class="chart" :option="orderTrendOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作和最新动态 -->
    <el-row :gutter="20" class="bottom-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="action-card">
          <template #header>
            <span>快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" :icon="Plus" @click="$router.push('/ticket/create')">
              创建工单
            </el-button>
            <el-button type="success" :icon="View" @click="$router.push('/ticket/list')">
              查看工单
            </el-button>
            <el-button type="warning" :icon="BellFilled" @click="$router.push('/inventory/alert')">
              库存告警
            </el-button>
            <el-button type="info" :icon="Setting" @click="$router.push('/workflow/list')">
              流程配置
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="activity-card">
          <template #header>
            <span>最新动态</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              :timestamp="activity.timestamp"
              placement="top"
            >
              <div class="activity-content">
                <span class="activity-user">{{ activity.user }}</span>
                <span class="activity-action">{{ activity.action }}</span>
                <span class="activity-target">{{ activity.target }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { StatisticsData } from '@/types'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const trendPeriod = ref('week')

// 统计数据（实际应从API获取）
const stats = ref<StatisticsData>({
  ticketStats: {
    total: 1256,
    pending: 89,
    processing: 234,
    resolved: 876,
    avgProcessTime: 4.5,
  },
  inventoryStats: {
    total: 3580,
    normal: 3120,
    warning: 386,
    critical: 74,
  },
  orderStats: {
    total: 8945,
    totalAmount: 2456789,
    todayOrders: 156,
    todayAmount: 45678,
  },
})

// 工单趋势图配置
const ticketTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['新增工单', '已解决'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '新增工单',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
      smooth: true,
      itemStyle: { color: '#409eff' },
    },
    {
      name: '已解决',
      type: 'line',
      data: [85, 95, 89, 98, 78, 165, 158],
      smooth: true,
      itemStyle: { color: '#67c23a' },
    },
  ],
}))

// 工单状态分布
const ticketStatusOption = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '工单状态',
      type: 'pie',
      radius: '70%',
      data: [
        { value: 89, name: '待处理', itemStyle: { color: '#e6a23c' } },
        { value: 234, name: '处理中', itemStyle: { color: '#409eff' } },
        { value: 876, name: '已解决', itemStyle: { color: '#67c23a' } },
        { value: 57, name: '已关闭', itemStyle: { color: '#909399' } },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}))

// 库存告警情况
const inventoryAlertOption = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      name: '库存状态',
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 3120, name: '正常', itemStyle: { color: '#67c23a' } },
        { value: 386, name: '预警', itemStyle: { color: '#e6a23c' } },
        { value: 74, name: '紧急', itemStyle: { color: '#f56c6c' } },
      ],
    },
  ],
}))

// 订单金额趋势
const orderTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '订单金额',
      type: 'bar',
      data: [320000, 432000, 301000, 534000, 490000, 430000],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#4facfe' },
            { offset: 1, color: '#00f2fe' },
          ],
        },
      },
    },
  ],
}))

// 最新动态
const recentActivities = ref([
  {
    user: '张三',
    action: '创建了工单',
    target: '#TK20240115001',
    timestamp: '2024-01-15 14:30',
  },
  {
    user: '李四',
    action: '完成了工单',
    target: '#TK20240115002',
    timestamp: '2024-01-15 14:15',
  },
  {
    user: '王五',
    action: '更新了库存',
    target: 'SKU-12345',
    timestamp: '2024-01-15 14:00',
  },
  {
    user: '赵六',
    action: '创建了订单',
    target: '#OR20240115001',
    timestamp: '2024-01-15 13:45',
  },
])

// 格式化数字
function formatNumber(num: number) {
  return num.toLocaleString('zh-CN')
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  .stats-row {
    margin-bottom: 20px;
  }

  .stat-card {
    :deep(.el-card__body) {
      display: flex;
      align-items: center;
      padding: 20px;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 12px;
      color: #fff;
      margin-right: 20px;
    }

    .stat-content {
      flex: 1;
    }

    .stat-title {
      font-size: 14px;
      color: #909399;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 8px;
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;

      .stat-label {
        color: #909399;
      }

      .stat-number {
        color: #409eff;
        font-weight: 500;

        &.critical {
          color: #f56c6c;
        }
      }
    }
  }

  .charts-row {
    margin-bottom: 20px;
  }

  .chart-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chart {
      height: 300px;
    }
  }

  .bottom-row {
    .action-card {
      .quick-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
    }

    .activity-card {
      .activity-content {
        .activity-user {
          font-weight: 500;
          color: #303133;
          margin-right: 4px;
        }

        .activity-action {
          color: #606266;
          margin-right: 4px;
        }

        .activity-target {
          color: #409eff;
        }
      }
    }
  }
}
</style>


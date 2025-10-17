<template>
  <div class="workflow-design-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>流程设计</span>
          <div>
            <el-button @click="$router.back()">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </div>
      </template>

      <div class="workflow-canvas">
        <div class="toolbar">
          <el-button-group>
            <el-button :icon="Plus" @click="addNode('start')">开始</el-button>
            <el-button :icon="Check" @click="addNode('approval')">审批</el-button>
            <el-button :icon="Setting" @click="addNode('process')">处理</el-button>
            <el-button :icon="Finished" @click="addNode('end')">结束</el-button>
          </el-button-group>
        </div>

        <div class="canvas" ref="canvasRef">
          <div
            v-for="node in nodes"
            :key="node.id"
            class="flow-node"
            :class="`node-${node.type}`"
            :style="{
              left: `${node.x}px`,
              top: `${node.y}px`,
            }"
            @mousedown="handleNodeMouseDown($event, node)"
          >
            <div class="node-icon">
              <el-icon v-if="node.type === 'start'"><VideoPlay /></el-icon>
              <el-icon v-else-if="node.type === 'approval'"><Check /></el-icon>
              <el-icon v-else-if="node.type === 'process'"><Setting /></el-icon>
              <el-icon v-else-if="node.type === 'end'"><Finished /></el-icon>
            </div>
            <div class="node-name">{{ node.name }}</div>
            <div class="node-actions">
              <el-icon class="action-icon" @click="editNode(node)"><Edit /></el-icon>
              <el-icon class="action-icon" @click="deleteNode(node)"><Delete /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 节点配置弹窗 -->
    <el-dialog v-model="dialogVisible" title="节点配置" width="600px">
      <el-form :model="currentNode" label-width="100px">
        <el-form-item label="节点名称">
          <el-input v-model="currentNode.name" />
        </el-form-item>
        <el-form-item label="节点类型">
          <el-select v-model="currentNode.type" disabled>
            <el-option label="开始" value="start" />
            <el-option label="审批" value="approval" />
            <el-option label="处理" value="process" />
            <el-option label="结束" value="end" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentNode.type === 'approval'" label="审批人">
          <el-select v-model="currentNode.approvers" multiple placeholder="请选择审批人">
            <el-option label="张三" :value="1" />
            <el-option label="李四" :value="2" />
            <el-option label="王五" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentNode.type === 'approval'" label="审批方式">
          <el-radio-group v-model="currentNode.approvalType">
            <el-radio label="any">任一审批</el-radio>
            <el-radio label="all">全部审批</el-radio>
            <el-radio label="sequential">依次审批</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNode">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FlowNode } from '@/types'

const router = useRouter()
const route = useRoute()

const canvasRef = ref<HTMLElement>()
const dialogVisible = ref(false)
const nodes = ref<FlowNode[]>([])
const currentNode = reactive<Partial<FlowNode>>({})

let dragNode: FlowNode | null = null
let startX = 0
let startY = 0

onMounted(() => {
  const id = route.params.id
  if (id) {
    loadWorkflow(id as string)
  } else {
    // 默认添加开始节点
    addNode('start')
  }
})

function loadWorkflow(id: string) {
  // 加载流程数据
  console.log('加载流程', id)
}

function addNode(type: string) {
  const node: FlowNode = {
    id: `node-${Date.now()}`,
    name: getNodeName(type),
    type: type as any,
    x: 100,
    y: 100,
    approvers: [],
    approvalType: 'any',
    conditions: [],
    actions: [],
    next: [],
  }
  nodes.value.push(node)
}

function getNodeName(type: string) {
  const map: Record<string, string> = {
    start: '开始',
    approval: '审批节点',
    process: '处理节点',
    condition: '条件节点',
    end: '结束',
  }
  return map[type] || '未知节点'
}

function handleNodeMouseDown(event: MouseEvent, node: FlowNode) {
  dragNode = node
  startX = event.clientX - node.x
  startY = event.clientY - node.y

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(event: MouseEvent) {
  if (dragNode) {
    dragNode.x = event.clientX - startX
    dragNode.y = event.clientY - startY
  }
}

function handleMouseUp() {
  dragNode = null
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

function editNode(node: FlowNode) {
  Object.assign(currentNode, node)
  dialogVisible.value = true
}

function deleteNode(node: FlowNode) {
  const index = nodes.value.findIndex((n) => n.id === node.id)
  if (index > -1) {
    nodes.value.splice(index, 1)
  }
}

function saveNode() {
  const index = nodes.value.findIndex((n) => n.id === currentNode.id)
  if (index > -1) {
    Object.assign(nodes.value[index], currentNode)
  }
  dialogVisible.value = false
}

function handleSave() {
  // 保存流程
  console.log('保存流程', nodes.value)
  ElMessage.success('保存成功')
  router.back()
}
</script>

<style lang="scss" scoped>
.workflow-design-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .workflow-canvas {
    .toolbar {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ebeef5;
    }

    .canvas {
      position: relative;
      width: 100%;
      height: 600px;
      background-color: #f5f7fa;
      background-image: linear-gradient(#e5e7eb 1px, transparent 1px),
        linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
      background-size: 20px 20px;
      overflow: hidden;
    }

    .flow-node {
      position: absolute;
      width: 120px;
      padding: 15px;
      background: #fff;
      border: 2px solid #409eff;
      border-radius: 8px;
      text-align: center;
      cursor: move;
      user-select: none;
      transition: box-shadow 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.node-start {
        border-color: #67c23a;
      }

      &.node-approval {
        border-color: #409eff;
      }

      &.node-process {
        border-color: #e6a23c;
      }

      &.node-end {
        border-color: #f56c6c;
      }

      .node-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }

      .node-name {
        font-size: 14px;
        color: #303133;
        margin-bottom: 8px;
      }

      .node-actions {
        display: flex;
        justify-content: center;
        gap: 10px;

        .action-icon {
          cursor: pointer;
          font-size: 16px;
          color: #909399;
          transition: color 0.3s;

          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>


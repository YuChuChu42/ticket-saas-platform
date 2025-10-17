<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-scrollbar">
      <div class="tags-wrapper">
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path"
          :to="{ path: tag.path, query: tag.query }"
          class="tag-item"
          :class="{ active: isActive(tag.path) }"
        >
          <span>{{ tag.title }}</span>
          <el-icon
            v-if="!isAffix(tag.path)"
            class="close-icon"
            @click.prevent.stop="closeTag(tag.path)"
          >
            <Close />
          </el-icon>
        </router-link>
      </div>
    </el-scrollbar>

    <el-dropdown class="more-actions" @command="handleCommand">
      <el-icon class="action-icon">
        <MoreFilled />
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOthers">
            <el-icon><CircleClose /></el-icon>
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="closeAll">
            <el-icon><CircleCloseFilled /></el-icon>
            关闭所有
          </el-dropdown-item>
          <el-dropdown-item divided command="refresh">
            <el-icon><Refresh /></el-icon>
            刷新页面
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const visitedViews = computed(() => appStore.visitedViews)

// 判断是否激活
function isActive(path: string) {
  return route.path === path
}

// 判断是否固定标签（首页固定）
function isAffix(path: string) {
  return path === '/dashboard'
}

// 关闭标签
function closeTag(path: string) {
  appStore.removeVisitedView(path)
  
  // 如果关闭的是当前标签，跳转到最后一个标签
  if (isActive(path)) {
    const views = visitedViews.value
    const lastView = views[views.length - 1]
    if (lastView) {
      router.push(lastView.path)
    } else {
      router.push('/dashboard')
    }
  }
}

// 处理下拉菜单命令
function handleCommand(command: string) {
  switch (command) {
    case 'closeOthers':
      appStore.closeOtherViews(route.path)
      break
    case 'closeAll':
      appStore.closeAllViews()
      router.push('/dashboard')
      break
    case 'refresh':
      window.location.reload()
      break
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 10px;

  .tags-scrollbar {
    flex: 1;
    overflow: hidden;
  }

  .tags-wrapper {
    display: flex;
    gap: 6px;
    padding: 4px 0;
  }

  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 12px;
    font-size: 13px;
    color: #606266;
    background-color: #f4f4f5;
    border: 1px solid #e4e7ed;
    border-radius: 3px;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: #409eff;
      background-color: #ecf5ff;
      border-color: #b3d8ff;
    }

    &.active {
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;

      .close-icon {
        color: #fff;

        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .close-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      font-size: 12px;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }

  .more-actions {
    margin-left: 10px;
    cursor: pointer;

    .action-icon {
      font-size: 18px;
      color: #909399;
      transition: color 0.3s;

      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>


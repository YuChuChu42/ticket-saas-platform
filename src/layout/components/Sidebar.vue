<template>
  <aside class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <div class="logo">
      <img v-if="!appStore.sidebarCollapsed" src="@/assets/logo.svg" alt="Logo" />
      <span v-if="!appStore.sidebarCollapsed" class="logo-title">智链工单</span>
      <img v-else src="@/assets/logo-mini.svg" alt="Logo" />
    </div>

    <el-scrollbar class="menu-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :unique-opened="true"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <SidebarItem
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { hasPermission } from '@/utils/permission'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 当前激活菜单
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 根据权限过滤路由
const permissionRoutes = computed(() => {
  return router.getRoutes().filter((route) => {
    // 过滤隐藏的路由
    if (route.meta?.hidden) return false
    
    // 检查权限
    const permissions = route.meta?.permissions as string[] | undefined
    if (permissions && permissions.length > 0) {
      return hasPermission(permissions)
    }
    
    return true
  })
})
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  background-color: #304156;
  transition: width 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);

  &.collapsed {
    width: 64px;

    .logo {
      padding: 0;
      justify-content: center;
    }
  }
}

.logo {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #2b3a4a;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;

  img {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }

  .logo-title {
    font-size: 16px;
  }
}

.menu-scrollbar {
  height: calc(100% - 60px);
}

:deep(.el-menu) {
  border: none;
}
</style>


<template>
  <header class="app-header">
    <div class="left">
      <el-icon class="hamburger" @click="toggleSidebar">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="index"
          :to="item.path"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="right">
      <!-- 搜索 -->
      <el-tooltip content="搜索" placement="bottom">
        <el-icon class="action-icon">
          <Search />
        </el-icon>
      </el-tooltip>

      <!-- 全屏 -->
      <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
        <el-icon class="action-icon" @click="toggleFullscreen">
          <FullScreen />
        </el-icon>
      </el-tooltip>

      <!-- 主题切换 -->
      <el-tooltip :content="appStore.theme === 'dark' ? '浅色模式' : '深色模式'" placement="bottom">
        <el-icon class="action-icon" @click="appStore.toggleTheme()">
          <Moon v-if="appStore.theme === 'light'" />
          <Sunny v-else />
        </el-icon>
      </el-tooltip>

      <!-- 语言切换 -->
      <el-dropdown class="language-dropdown" @command="handleLanguageChange">
        <el-icon class="action-icon">
          <img :src="currentLanguageFlag" alt="language" class="language-flag" />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
            <el-dropdown-item command="en-US">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 通知 -->
      <el-badge :value="5" class="notification-badge">
        <el-icon class="action-icon">
          <BellFilled />
        </el-icon>
      </el-badge>

      <!-- 用户信息 -->
      <el-dropdown class="user-dropdown" @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userStore.user?.avatar">
            {{ userStore.user?.realName?.charAt(0) }}
          </el-avatar>
          <span class="username">{{ userStore.user?.realName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { i18n } from '@/i18n'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const isFullscreen = ref(false)

// 面包屑
const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({
    path: item.path,
    title: item.meta?.title as string,
  }))
})

// 当前语言标识
const currentLanguageFlag = computed(() => {
  return appStore.locale === 'zh-CN' ? '/flags/cn.svg' : '/flags/us.svg'
})

// 切换侧边栏
function toggleSidebar() {
  appStore.toggleSidebar()
}

// 切换全屏
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 切换语言
function handleLanguageChange(lang: string) {
  i18n.global.locale.value = lang
  appStore.setLocale(lang as 'zh-CN' | 'en-US')
}

// 用户下拉菜单操作
async function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await userStore.logout()
        router.push('/login')
      })
      break
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 999;

  .left {
    display: flex;
    align-items: center;
    gap: 20px;

    .hamburger {
      font-size: 20px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #409eff;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 20px;

    .action-icon {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #409eff;
      }
    }

    .language-flag {
      width: 20px;
      height: 20px;
    }

    .notification-badge {
      cursor: pointer;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      .username {
        font-size: 14px;
        color: #303133;
      }
    }
  }
}
</style>


import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    // 侧边栏折叠状态
    const sidebarCollapsed = ref(false)

    // 设备类型
    const device = ref<'desktop' | 'tablet' | 'mobile'>('desktop')

    // 缓存的视图（用于 keep-alive）
    const cachedViews = ref<string[]>([])

    // 标签页列表
    const visitedViews = ref<
      Array<{
        name: string
        path: string
        title: string
        query?: any
      }>
    >([])

    // 主题模式
    const theme = ref<'light' | 'dark'>('light')

    // 语言
    const locale = ref<'zh-CN' | 'en-US'>('zh-CN')

    // 切换侧边栏
    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // 设置设备类型
    function setDevice(type: 'desktop' | 'tablet' | 'mobile') {
      device.value = type
    }

    // 添加缓存视图
    function addCachedView(name: string) {
      if (!cachedViews.value.includes(name)) {
        cachedViews.value.push(name)
      }
    }

    // 删除缓存视图
    function removeCachedView(name: string) {
      const index = cachedViews.value.indexOf(name)
      if (index > -1) {
        cachedViews.value.splice(index, 1)
      }
    }

    // 添加访问视图
    function addVisitedView(view: {
      name: string
      path: string
      title: string
      query?: any
    }) {
      const exists = visitedViews.value.some((v) => v.path === view.path)
      if (!exists) {
        visitedViews.value.push(view)
      }

      // 同时添加到缓存
      addCachedView(view.name)
    }

    // 删除访问视图
    function removeVisitedView(path: string) {
      const index = visitedViews.value.findIndex((v) => v.path === path)
      if (index > -1) {
        const view = visitedViews.value[index]
        visitedViews.value.splice(index, 1)
        removeCachedView(view.name)
      }
    }

    // 关闭其他标签
    function closeOtherViews(path: string) {
      const view = visitedViews.value.find((v) => v.path === path)
      visitedViews.value = view ? [view] : []
      cachedViews.value = view ? [view.name] : []
    }

    // 关闭所有标签
    function closeAllViews() {
      visitedViews.value = []
      cachedViews.value = []
    }

    // 切换主题
    function toggleTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
      
      // 应用主题
      if (theme.value === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // 设置语言
    function setLocale(lang: 'zh-CN' | 'en-US') {
      locale.value = lang
    }

    return {
      sidebarCollapsed,
      device,
      cachedViews,
      visitedViews,
      theme,
      locale,
      toggleSidebar,
      setDevice,
      addCachedView,
      removeCachedView,
      addVisitedView,
      removeVisitedView,
      closeOtherViews,
      closeAllViews,
      toggleTheme,
      setLocale,
    }
  },
  {
    persist: {
      paths: ['sidebarCollapsed', 'theme', 'locale'],
    },
  }
)


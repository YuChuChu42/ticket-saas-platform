import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { setupSentry } from './utils/sentry'
import { permissionDirective } from './directives/permission'
import { registerSW } from './utils/registerServiceWorker'

// 引入全局样式
import './assets/styles/index.scss'

const app = createApp(App)

// 配置 Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// 配置路由
app.use(router)

// 配置国际化
app.use(i18n)

// 配置 Element Plus
app.use(ElementPlus, {
  locale: zhCn,
})

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册自定义指令
app.directive('perm', permissionDirective)

// 配置 Sentry 错误监控
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  setupSentry(app)
}

// 注册 Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerSW()
}

// 移除加载骨架屏
app.mount('#app')
const loadingScreen = document.getElementById('loading-screen')
if (loadingScreen) {
  loadingScreen.style.display = 'none'
}


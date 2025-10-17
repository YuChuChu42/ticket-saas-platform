import { Workbox } from 'workbox-window'
import { ElNotification } from 'element-plus'

export function registerSW() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js')

    // 监听 Service Worker 更新
    wb.addEventListener('waiting', () => {
      ElNotification({
        title: '发现新版本',
        message: '检测到新版本可用，点击刷新以更新',
        type: 'info',
        duration: 0,
        onClick: () => {
          wb.messageSkipWaiting()
          window.location.reload()
        },
      })
    })

    // 监听 Service Worker 控制变化
    wb.addEventListener('controlling', () => {
      window.location.reload()
    })

    // 注册 Service Worker
    wb.register()
      .then(() => {
        console.log('[SW] Service Worker registered')
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error)
      })
  }
}


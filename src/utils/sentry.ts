import * as Sentry from '@sentry/vue'
import type { App } from 'vue'
import router from '@/router'

export function setupSentry(app: App) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // 性能监控采样率
    tracesSampleRate: 0.5,
    // 会话回放采样率
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // 环境信息
    environment: import.meta.env.MODE,
    // 过滤错误
    beforeSend(event, hint) {
      const error = hint.originalException
      
      // 过滤掉一些已知的、可忽略的错误
      if (error instanceof Error) {
        const message = error.message
        
        // 忽略网络相关的常见错误
        if (
          message.includes('Network Error') ||
          message.includes('timeout') ||
          message.includes('请求过于频繁')
        ) {
          return null
        }
        
        // 忽略取消的请求
        if (message.includes('Cancel')) {
          return null
        }
      }
      
      return event
    },
    // 忽略的错误类型
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
  })
}

// 手动捕获异常
export function captureException(error: Error, context?: Record<string, any>) {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: context?.tags,
      extra: context?.extra,
      level: context?.level || 'error',
    })
  } else {
    console.error('[Sentry]', error, context)
  }
}

// 手动捕获消息
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureMessage(message, level)
  } else {
    console.log('[Sentry]', message, level)
  }
}

// 设置用户信息
export function setUser(user: { id: number; username: string; email: string }) {
  Sentry.setUser({
    id: user.id.toString(),
    username: user.username,
    email: user.email,
  })
}

// 清除用户信息
export function clearUser() {
  Sentry.setUser(null)
}


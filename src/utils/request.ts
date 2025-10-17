import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { ApiResponse } from '@/types'
import { captureException } from './sentry'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求队列和节流控制
const requestQueue = new Map<string, number>()
const THROTTLE_TIME = 1000 // 1秒内相同请求只发送一次

// 生成请求唯一标识
function getRequestKey(config: AxiosRequestConfig): string {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}

// 请求节流检查
function checkThrottle(key: string): boolean {
  const now = Date.now()
  const lastTime = requestQueue.get(key)

  if (lastTime && now - lastTime < THROTTLE_TIME) {
    return false // 节流中
  }

  requestQueue.set(key, now)
  return true
}

// 请求重试配置
const retryConfig = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error: AxiosError) => {
    // 仅在网络错误或 5xx 错误时重试
    return !error.response || (error.response.status >= 500 && error.response.status < 600)
  },
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 节流检查（跳过 GET 请求）
    if (config.method !== 'get') {
      const requestKey = getRequestKey(config)
      if (!checkThrottle(requestKey)) {
        return Promise.reject(new Error('请求过于频繁，请稍后再试'))
      }
    }

    // 注入 Token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // 注入租户 ID（多租户支持）
    if (userStore.tenantId) {
      config.headers['X-Tenant-Id'] = userStore.tenantId
    }

    // 请求日志
    if (import.meta.env.DEV) {
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`, config)
    }

    return config
  },
  (error: AxiosError) => {
    console.error('[Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data

    // 响应日志
    if (import.meta.env.DEV) {
      console.log(`[Response] ${response.config.url}`, response.data)
    }

    // 业务成功
    if (code === 200 || code === 0) {
      return data
    }

    // 业务失败
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message || '请求失败'))
  },
  async (error: AxiosError<ApiResponse>) => {
    const { response, config } = error

    // 网络错误
    if (!response) {
      ElMessage.error('网络连接失败，请检查您的网络')
      captureException(error)
      return Promise.reject(error)
    }

    const { status, data } = response
    const userStore = useUserStore()

    // 处理各种 HTTP 状态码
    switch (status) {
      case 401:
        // Token 过期或无效，尝试刷新 Token
        if (!config._retry) {
          config._retry = true

          try {
            // 刷新 Token
            const newToken = await userStore.refreshToken()
            if (newToken && config.headers) {
              config.headers.Authorization = `Bearer ${newToken}`
              return service(config)
            }
          } catch (refreshError) {
            // 刷新失败，跳转登录页
            ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              userStore.logout()
              window.location.href = '/login'
            })
            return Promise.reject(refreshError)
          }
        }
        break

      case 403:
        ElMessage.error('没有权限访问该资源')
        break

      case 404:
        ElMessage.error('请求的资源不存在')
        break

      case 429:
        ElMessage.error('请求过于频繁，请稍后再试')
        break

      case 500:
      case 502:
      case 503:
      case 504: {
        // 服务器错误，尝试重试
        const retries = (config as unknown as { __retryCount?: number }).__retryCount || 0

        if (retries < retryConfig.retries && retryConfig.retryCondition(error)) {
          ;(config as unknown as { __retryCount?: number }).__retryCount = retries + 1

          // 延迟重试
          await new Promise((resolve) =>
            setTimeout(resolve, retryConfig.retryDelay * Math.pow(2, retries))
          )

          ElMessage.warning(`请求失败，正在重试 (${retries + 1}/${retryConfig.retries})`)
          return service(config)
        }

        ElMessage.error(data?.message || '服务器错误，请稍后再试')
        break
      }

      default:
        ElMessage.error(data?.message || '请求失败')
    }

    // 错误上报到 Sentry
    if (import.meta.env.PROD) {
      captureException(error, {
        tags: {
          api: config.url,
          status: status,
        },
        extra: {
          request: config,
          response: data,
        },
      })
    }

    return Promise.reject(error)
  }
)

// 请求方法封装
export const request = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config })
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config })
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },

  // 上传文件
  upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  },

  // 下载文件
  download(url: string, params?: any, filename?: string): Promise<void> {
    return service
      .get(url, {
        params,
        responseType: 'blob',
      })
      .then((blob: any) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename || 'download')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
  },
}

export default service

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
    __retryCount?: number
  }
}

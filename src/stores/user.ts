import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { request } from '@/utils/request'
import { setToken, setRefreshToken, setTokenExpires, clearAuth } from '@/utils/auth'
import { setUser as setSentryUser, clearUser as clearSentryUser } from '@/utils/sentry'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string>('')
    const refreshTokenValue = ref<string>('')
    const permissions = ref<string[]>([])
    const tenantId = ref<string>('')

    // 登录
    async function login(username: string, password: string, roleType?: string) {
      try {
        const data = await request.post<{
          user: User
          token: string
          refreshToken: string
          expiresIn: number
          permissions: string[]
        }>('/auth/login', {
          username,
          password,
          roleType,
        })

        user.value = data.user
        token.value = data.token
        refreshTokenValue.value = data.refreshToken
        permissions.value = data.permissions

        // 保存 Token
        setToken(data.token)
        setRefreshToken(data.refreshToken)
        setTokenExpires(Date.now() + data.expiresIn * 1000)

        // 设置 Sentry 用户信息
        setSentryUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        })

        return data
      } catch (error) {
        throw error
      }
    }

    // 获取用户信息
    async function getUserInfo() {
      try {
        const data = await request.get<{
          user: User
          permissions: string[]
        }>('/auth/user-info')

        user.value = data.user
        permissions.value = data.permissions

        return data
      } catch (error) {
        throw error
      }
    }

    // 刷新 Token
    async function refreshToken() {
      try {
        const data = await request.post<{
          token: string
          refreshToken: string
          expiresIn: number
        }>('/auth/refresh-token', {
          refreshToken: refreshTokenValue.value,
        })

        token.value = data.token
        refreshTokenValue.value = data.refreshToken

        setToken(data.token)
        setRefreshToken(data.refreshToken)
        setTokenExpires(Date.now() + data.expiresIn * 1000)

        return data.token
      } catch (error) {
        // 刷新失败，清除登录状态
        await logout()
        throw error
      }
    }

    // 登出
    async function logout() {
      try {
        await request.post('/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        user.value = null
        token.value = ''
        refreshTokenValue.value = ''
        permissions.value = []
        clearAuth()
        clearSentryUser()
      }
    }

    // 更新用户信息
    function updateUser(userData: Partial<User>) {
      if (user.value) {
        user.value = { ...user.value, ...userData }
      }
    }

    // 重置状态
    function reset() {
      user.value = null
      token.value = ''
      refreshTokenValue.value = ''
      permissions.value = []
      tenantId.value = ''
    }

    return {
      user,
      token,
      refreshTokenValue,
      permissions,
      tenantId,
      login,
      getUserInfo,
      refreshToken,
      logout,
      updateUser,
      reset,
    }
  },
  {
    persist: {
      paths: ['user', 'token', 'refreshTokenValue', 'permissions', 'tenantId'],
    },
  }
)


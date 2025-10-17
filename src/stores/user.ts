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
    async function login(username: string, password: string, _roleType?: string) {
      // 模拟登录数据（用于演示）
      const mockUsers: Record<
        string,
        {
          user: User
          token: string
          refreshToken: string
          expiresIn: number
          permissions: string[]
        }
      > = {
        admin: {
          user: {
            id: 1,
            username: 'admin',
            realName: '管理员',
            email: 'admin@example.com',
            phone: '13800138000',
            avatar: '',
            roleId: 1,
            roleName: '超级管理员',
            roleCode: 'super_admin',
            departmentId: 1,
            departmentName: '管理部',
            status: 1,
            createdAt: '2024-01-01 00:00:00',
            updatedAt: '2024-01-01 00:00:00',
          },
          token: 'mock_token_admin_' + Date.now(),
          refreshToken: 'mock_refresh_token_admin_' + Date.now(),
          expiresIn: 7200,
          permissions: ['*:*:*'], // 所有权限
        },
        operator: {
          user: {
            id: 2,
            username: 'operator',
            realName: '运营人员',
            email: 'operator@example.com',
            phone: '13800138001',
            avatar: '',
            roleId: 2,
            roleName: '运营人员',
            roleCode: 'operator',
            departmentId: 2,
            departmentName: '运营部',
            status: 1,
            createdAt: '2024-01-01 00:00:00',
            updatedAt: '2024-01-01 00:00:00',
          },
          token: 'mock_token_operator_' + Date.now(),
          refreshToken: 'mock_refresh_token_operator_' + Date.now(),
          expiresIn: 7200,
          permissions: [
            'ticket:view',
            'ticket:create',
            'ticket:edit',
            'order:view',
            'order:create',
            'inventory:view',
          ],
        },
        customer: {
          user: {
            id: 3,
            username: 'customer',
            realName: '客服人员',
            email: 'customer@example.com',
            phone: '13800138002',
            avatar: '',
            roleId: 3,
            roleName: '客服人员',
            roleCode: 'customer',
            departmentId: 3,
            departmentName: '客服部',
            status: 1,
            createdAt: '2024-01-01 00:00:00',
            updatedAt: '2024-01-01 00:00:00',
          },
          token: 'mock_token_customer_' + Date.now(),
          refreshToken: 'mock_refresh_token_customer_' + Date.now(),
          expiresIn: 7200,
          permissions: ['ticket:view', 'ticket:create', 'ticket:edit'],
        },
      }

      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 验证用户名和密码
      const mockData = mockUsers[username]
      if (!mockData || password !== username + '123') {
        throw new Error('用户名或密码错误')
      }

      const data = mockData

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
    }

    // 获取用户信息
    async function getUserInfo() {
      // 如果已经有用户信息，直接返回（模拟模式）
      if (user.value && token.value) {
        return {
          user: user.value,
          permissions: permissions.value,
        }
      }

      // 否则抛出错误，需要重新登录
      throw new Error('未登录或登录已过期')
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

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { hasPermission, hasRole, isAdmin } from '@/utils/permission'
import { useUserStore } from '@/stores/user'
import { createPinia, setActivePinia } from 'pinia'

describe('权限工具函数', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('hasPermission', () => {
    it('超级管理员应该拥有所有权限', () => {
      const userStore = useUserStore()
      userStore.user = {
        roleCode: 'super_admin',
      } as any
      
      expect(hasPermission('user:add')).toBe(true)
      expect(hasPermission(['user:add', 'user:edit'])).toBe(true)
    })

    it('应该正确检查单个权限', () => {
      const userStore = useUserStore()
      userStore.user = { roleCode: 'admin' } as any
      userStore.permissions = ['user:add', 'user:edit', 'user:delete']
      
      expect(hasPermission('user:add')).toBe(true)
      expect(hasPermission('user:view')).toBe(false)
    })

    it('应该正确检查多个权限（some模式）', () => {
      const userStore = useUserStore()
      userStore.user = { roleCode: 'admin' } as any
      userStore.permissions = ['user:add', 'user:edit']
      
      expect(hasPermission(['user:add', 'user:delete'], 'some')).toBe(true)
      expect(hasPermission(['user:delete', 'user:view'], 'some')).toBe(false)
    })

    it('应该正确检查多个权限（every模式）', () => {
      const userStore = useUserStore()
      userStore.user = { roleCode: 'admin' } as any
      userStore.permissions = ['user:add', 'user:edit']
      
      expect(hasPermission(['user:add', 'user:edit'], 'every')).toBe(true)
      expect(hasPermission(['user:add', 'user:delete'], 'every')).toBe(false)
    })
  })

  describe('hasRole', () => {
    it('应该正确检查角色', () => {
      const userStore = useUserStore()
      userStore.user = { roleCode: 'admin' } as any
      
      expect(hasRole('admin')).toBe(true)
      expect(hasRole('operator')).toBe(false)
    })

    it('应该正确检查多个角色', () => {
      const userStore = useUserStore()
      userStore.user = { roleCode: 'admin' } as any
      
      expect(hasRole(['admin', 'super_admin'])).toBe(true)
      expect(hasRole(['operator', 'customer'])).toBe(false)
    })
  })

  describe('isAdmin', () => {
    it('应该正确判断是否为管理员', () => {
      const userStore = useUserStore()
      
      userStore.user = { roleCode: 'super_admin' } as any
      expect(isAdmin()).toBe(true)
      
      userStore.user = { roleCode: 'admin' } as any
      expect(isAdmin()).toBe(true)
      
      userStore.user = { roleCode: 'operator' } as any
      expect(isAdmin()).toBe(false)
    })
  })
})


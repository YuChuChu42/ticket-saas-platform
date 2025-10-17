import type { Directive, DirectiveBinding } from 'vue'
import { hasPermission } from '@/utils/permission'

/**
 * 权限指令
 * 用法：
 * v-perm="'user:add'"
 * v-perm="['user:add', 'user:edit']"
 * v-perm:every="['user:add', 'user:edit']"
 */
export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    
    if (!value) {
      console.warn('[v-perm] Permission value is required')
      return
    }

    const mode = arg === 'every' ? 'every' : 'some'
    const hasPerm = hasPermission(value, mode)

    if (!hasPerm) {
      // 移除元素
      el.parentNode?.removeChild(el)
    }
  },
}

/**
 * 角色指令
 * 用法：
 * v-role="'admin'"
 * v-role="['admin', 'operator']"
 */
export const roleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding

    if (!value) {
      console.warn('[v-role] Role value is required')
      return
    }

    const { hasRole } = await import('@/utils/permission')
    const hasTheRole = hasRole(value)

    if (!hasTheRole) {
      el.parentNode?.removeChild(el)
    }
  },
}


import { useUserStore } from '@/stores/user'

/**
 * 检查用户是否有指定权限
 * @param permissions 权限代码或权限代码数组
 * @param mode 'some' 表示满足任一权限即可，'every' 表示需要满足所有权限
 */
export function hasPermission(
  permissions: string | string[],
  mode: 'some' | 'every' = 'some'
): boolean {
  const userStore = useUserStore()
  const userPermissions = userStore.permissions || []

  // 超级管理员拥有所有权限
  if (userStore.user?.roleCode === 'super_admin') {
    return true
  }

  if (!permissions || permissions.length === 0) {
    return true
  }

  const perms = Array.isArray(permissions) ? permissions : [permissions]

  if (mode === 'every') {
    return perms.every((perm) => userPermissions.includes(perm))
  }

  return perms.some((perm) => userPermissions.includes(perm))
}

/**
 * 检查用户是否有指定角色
 */
export function hasRole(roles: string | string[]): boolean {
  const userStore = useUserStore()
  const userRole = userStore.user?.roleCode

  if (!userRole) return false

  const roleList = Array.isArray(roles) ? roles : [roles]
  return roleList.includes(userRole)
}

/**
 * 检查用户是否是管理员
 */
export function isAdmin(): boolean {
  return hasRole(['super_admin', 'admin'])
}


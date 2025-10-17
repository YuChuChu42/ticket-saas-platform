import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { hasPermission } from '@/utils/permission'
import { ElMessage } from 'element-plus'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '数据大屏',
          icon: 'DataLine',
          requiresAuth: true,
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: '/ticket',
    component: () => import('@/layout/index.vue'),
    redirect: '/ticket/list',
    meta: {
      title: '工单管理',
      icon: 'Tickets',
      requiresAuth: true,
    },
    children: [
      {
        path: 'list',
        name: 'TicketList',
        component: () => import('@/views/ticket/list.vue'),
        meta: {
          title: '工单列表',
          icon: 'List',
          requiresAuth: true,
          keepAlive: true,
          permissions: ['ticket:view'],
        },
      },
      {
        path: 'create',
        name: 'TicketCreate',
        component: () => import('@/views/ticket/create.vue'),
        meta: {
          title: '创建工单',
          icon: 'Plus',
          requiresAuth: true,
          permissions: ['ticket:create'],
        },
      },
      {
        path: 'detail/:id',
        name: 'TicketDetail',
        component: () => import('@/views/ticket/detail.vue'),
        meta: {
          title: '工单详情',
          hidden: true,
          requiresAuth: true,
          permissions: ['ticket:view'],
        },
      },
    ],
  },
  {
    path: '/inventory',
    component: () => import('@/layout/index.vue'),
    redirect: '/inventory/list',
    meta: {
      title: '库存管理',
      icon: 'Box',
      requiresAuth: true,
    },
    children: [
      {
        path: 'list',
        name: 'InventoryList',
        component: () => import('@/views/inventory/list.vue'),
        meta: {
          title: '库存列表',
          icon: 'List',
          requiresAuth: true,
          keepAlive: true,
          permissions: ['inventory:view'],
        },
      },
      {
        path: 'alert',
        name: 'InventoryAlert',
        component: () => import('@/views/inventory/alert.vue'),
        meta: {
          title: '库存告警',
          icon: 'BellFilled',
          requiresAuth: true,
          keepAlive: true,
          permissions: ['inventory:alert'],
        },
      },
    ],
  },
  {
    path: '/order',
    component: () => import('@/layout/index.vue'),
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      icon: 'Document',
      requiresAuth: true,
    },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: {
          title: '订单列表',
          icon: 'List',
          requiresAuth: true,
          keepAlive: true,
          permissions: ['order:view'],
        },
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: {
          title: '订单详情',
          hidden: true,
          requiresAuth: true,
          permissions: ['order:view'],
        },
      },
    ],
  },
  {
    path: '/workflow',
    component: () => import('@/layout/index.vue'),
    redirect: '/workflow/list',
    meta: {
      title: '流程配置',
      icon: 'Connection',
      requiresAuth: true,
      permissions: ['workflow:view'],
    },
    children: [
      {
        path: 'list',
        name: 'WorkflowList',
        component: () => import('@/views/workflow/list.vue'),
        meta: {
          title: '流程列表',
          icon: 'List',
          requiresAuth: true,
          keepAlive: true,
        },
      },
      {
        path: 'design/:id?',
        name: 'WorkflowDesign',
        component: () => import('@/views/workflow/design.vue'),
        meta: {
          title: '流程设计',
          icon: 'EditPen',
          hidden: true,
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      requiresAuth: true,
      permissions: ['system:view'],
    },
    children: [
      {
        path: 'user',
        name: 'UserManagement',
        component: () => import('@/views/system/user.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          requiresAuth: true,
          keepAlive: true,
          permissions: ['user:view'],
        },
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: () => import('@/views/system/role.vue'),
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
          requiresAuth: true,
          keepAlive: true,
          permissions: ['role:view'],
        },
      },
    ],
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '无权限',
      hidden: true,
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const appStore = useAppStore()

  // 设置页面标题
  document.title = `${to.meta.title || ''} - ${import.meta.env.VITE_APP_TITLE}`

  // 不需要认证的页面
  if (to.meta.requiresAuth === false) {
    next()
    return
  }

  // 检查登录状态
  if (!userStore.token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // 获取用户信息（如果还没有）
  if (!userStore.user) {
    try {
      await userStore.getUserInfo()
    } catch (error) {
      ElMessage.error('获取用户信息失败')
      userStore.logout()
      next('/login')
      return
    }
  }

  // 检查权限
  const permissions = to.meta.permissions as string[] | undefined
  if (permissions && permissions.length > 0) {
    if (!hasPermission(permissions)) {
      ElMessage.error('您没有权限访问该页面')
      next('/403')
      return
    }
  }

  // 添加标签页
  if (to.name && to.meta.title && !to.meta.hidden) {
    appStore.addVisitedView({
      name: to.name as string,
      path: to.path,
      title: to.meta.title as string,
      query: to.query,
    })
  }

  next()
})

export default router


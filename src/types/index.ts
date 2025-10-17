// 用户相关类型
export interface User {
  id: number
  username: string
  realName: string
  email: string
  phone: string
  avatar?: string
  roleId: number
  roleName: string
  roleCode: string
  departmentId: number
  departmentName: string
  status: number
  createdAt: string
  updatedAt: string
}

// 角色类型
export interface Role {
  id: number
  name: string
  code: string
  description: string
  permissions: Permission[]
  status: number
  createdAt: string
}

// 权限类型
export interface Permission {
  id: number
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  parentId: number | null
  path?: string
  component?: string
  icon?: string
  sort: number
  status: number
}

// 菜单类型
export interface MenuItem {
  id: number
  name: string
  path: string
  component?: string
  icon?: string
  title: string
  redirect?: string
  children?: MenuItem[]
  meta?: {
    title: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
    requiresAuth?: boolean
    permissions?: string[]
  }
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页参数
export interface PageParams {
  page: number
  pageSize: number
  total?: number
}

// 分页响应
export interface PageResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 工单相关类型
export interface Ticket {
  id: number
  ticketNo: string
  title: string
  description: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  creatorId: number
  creatorName: string
  assigneeId?: number
  assigneeName?: string
  departmentId: number
  departmentName: string
  attachments?: Attachment[]
  tags?: string[]
  customFields?: Record<string, any>
  flowNodeId?: number
  flowNodeName?: string
  createdAt: string
  updatedAt: string
  deadline?: string
}

export enum TicketType {
  BUG = 'bug',
  FEATURE = 'feature',
  SUPPORT = 'support',
  INQUIRY = 'inquiry',
  OTHER = 'other'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TicketStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected'
}

// 工单流转记录
export interface TicketLog {
  id: number
  ticketId: number
  action: string
  fromStatus?: string
  toStatus?: string
  operatorId: number
  operatorName: string
  comment?: string
  createdAt: string
}

// 附件
export interface Attachment {
  id: number
  name: string
  url: string
  size: number
  type: string
  uploaderId: number
  uploaderName: string
  createdAt: string
}

// 库存相关类型
export interface Inventory {
  id: number
  productId: number
  productName: string
  productCode: string
  sku: string
  quantity: number
  safetyStock: number
  warehouseId: number
  warehouseName: string
  location?: string
  status: 'normal' | 'warning' | 'critical'
  lastInboundDate?: string
  lastOutboundDate?: string
  updatedAt: string
}

// 订单相关类型
export interface Order {
  id: number
  orderNo: string
  customerId: number
  customerName: string
  orderType: 'purchase' | 'sale' | 'return'
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'
  totalAmount: number
  paidAmount: number
  items: OrderItem[]
  creatorId: number
  creatorName: string
  remark?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: number
  productId: number
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// 动态表单 Schema
export interface FormSchema {
  id: string
  name: string
  fields: FormField[]
  rules?: Record<string, any>
}

export interface FormField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'radio' | 'upload' | 'cascader'
  placeholder?: string
  defaultValue?: any
  options?: Array<{ label: string; value: any }>
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  rules?: any[]
  props?: Record<string, any>
  span?: number
  dependencies?: FieldDependency[]
}

export interface FieldDependency {
  field: string
  condition: 'eq' | 'neq' | 'gt' | 'lt' | 'in'
  value: any
  action: 'show' | 'hide' | 'enable' | 'disable' | 'required'
}

// 流程节点
export interface FlowNode {
  id: string
  name: string
  type: 'start' | 'approval' | 'process' | 'condition' | 'end'
  approvers?: number[]
  approvalType?: 'any' | 'all' | 'sequential'
  conditions?: FlowCondition[]
  actions?: FlowAction[]
  x: number
  y: number
  next?: string[]
}

export interface FlowCondition {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'in'
  value: any
}

export interface FlowAction {
  type: 'notify' | 'webhook' | 'email' | 'sms'
  config: Record<string, any>
}

// 告警规则
export interface AlertRule {
  id: number
  name: string
  type: 'inventory' | 'order' | 'ticket' | 'system'
  condition: AlertCondition
  actions: AlertAction[]
  enabled: boolean
  createdAt: string
}

export interface AlertCondition {
  field: string
  operator: 'gt' | 'lt' | 'eq' | 'neq' | 'in'
  value: any
  threshold?: number
}

export interface AlertAction {
  type: 'notify' | 'email' | 'sms' | 'webhook'
  recipients: number[]
  template?: string
}

// 统计数据
export interface StatisticsData {
  ticketStats: {
    total: number
    pending: number
    processing: number
    resolved: number
    avgProcessTime: number
  }
  inventoryStats: {
    total: number
    normal: number
    warning: number
    critical: number
  }
  orderStats: {
    total: number
    totalAmount: number
    todayOrders: number
    todayAmount: number
  }
}


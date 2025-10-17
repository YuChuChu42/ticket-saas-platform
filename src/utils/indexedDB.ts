import { openDB, IDBPDatabase, DBSchema } from 'idb'

// 定义数据库 Schema
interface TicketDB extends DBSchema {
  drafts: {
    key: string
    value: {
      id: string
      formData: any
      timestamp: number
    }
    indexes: { 'by-timestamp': number }
  }
  cache: {
    key: string
    value: {
      key: string
      data: any
      timestamp: number
      expiry?: number
    }
  }
  attachments: {
    key: string
    value: {
      id: string
      file: Blob
      name: string
      size: number
      type: string
      timestamp: number
    }
  }
}

const DB_NAME = 'ticket-saas-db'
const DB_VERSION = 1

let db: IDBPDatabase<TicketDB> | null = null

// 初始化数据库
export async function initDB(): Promise<IDBPDatabase<TicketDB>> {
  if (db) return db

  db = await openDB<TicketDB>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // 创建草稿箱表
      if (!database.objectStoreNames.contains('drafts')) {
        const draftStore = database.createObjectStore('drafts', { keyPath: 'id' })
        draftStore.createIndex('by-timestamp', 'timestamp')
      }

      // 创建缓存表
      if (!database.objectStoreNames.contains('cache')) {
        database.createObjectStore('cache', { keyPath: 'key' })
      }

      // 创建附件表
      if (!database.objectStoreNames.contains('attachments')) {
        database.createObjectStore('attachments', { keyPath: 'id' })
      }
    },
  })

  return db
}

// 草稿箱操作
export const draftDB = {
  // 保存草稿
  async save(id: string, formData: any): Promise<void> {
    const database = await initDB()
    await database.put('drafts', {
      id,
      formData,
      timestamp: Date.now(),
    })
  },

  // 获取草稿
  async get(id: string): Promise<any> {
    const database = await initDB()
    const draft = await database.get('drafts', id)
    return draft?.formData
  },

  // 获取所有草稿
  async getAll(): Promise<any[]> {
    const database = await initDB()
    return database.getAll('drafts')
  },

  // 删除草稿
  async delete(id: string): Promise<void> {
    const database = await initDB()
    await database.delete('drafts', id)
  },

  // 清空草稿箱
  async clear(): Promise<void> {
    const database = await initDB()
    await database.clear('drafts')
  },

  // 清理过期草稿（7天前）
  async cleanExpired(): Promise<void> {
    const database = await initDB()
    const expireTime = Date.now() - 7 * 24 * 60 * 60 * 1000
    const drafts = await database.getAllFromIndex('drafts', 'by-timestamp')
    
    for (const draft of drafts) {
      if (draft.timestamp < expireTime) {
        await database.delete('drafts', draft.id)
      }
    }
  },
}

// 缓存操作
export const cacheDB = {
  // 设置缓存
  async set(key: string, data: any, expiry?: number): Promise<void> {
    const database = await initDB()
    await database.put('cache', {
      key,
      data,
      timestamp: Date.now(),
      expiry,
    })
  },

  // 获取缓存
  async get(key: string): Promise<any> {
    const database = await initDB()
    const cache = await database.get('cache', key)
    
    if (!cache) return null
    
    // 检查是否过期
    if (cache.expiry && Date.now() > cache.timestamp + cache.expiry) {
      await database.delete('cache', key)
      return null
    }
    
    return cache.data
  },

  // 删除缓存
  async delete(key: string): Promise<void> {
    const database = await initDB()
    await database.delete('cache', key)
  },

  // 清空缓存
  async clear(): Promise<void> {
    const database = await initDB()
    await database.clear('cache')
  },

  // 清理过期缓存
  async cleanExpired(): Promise<void> {
    const database = await initDB()
    const caches = await database.getAll('cache')
    const now = Date.now()
    
    for (const cache of caches) {
      if (cache.expiry && now > cache.timestamp + cache.expiry) {
        await database.delete('cache', cache.key)
      }
    }
  },
}

// 附件操作
export const attachmentDB = {
  // 保存附件
  async save(id: string, file: Blob, name: string): Promise<void> {
    const database = await initDB()
    await database.put('attachments', {
      id,
      file,
      name,
      size: file.size,
      type: file.type,
      timestamp: Date.now(),
    })
  },

  // 获取附件
  async get(id: string): Promise<Blob | null> {
    const database = await initDB()
    const attachment = await database.get('attachments', id)
    return attachment?.file || null
  },

  // 删除附件
  async delete(id: string): Promise<void> {
    const database = await initDB()
    await database.delete('attachments', id)
  },

  // 清空附件
  async clear(): Promise<void> {
    const database = await initDB()
    await database.clear('attachments')
  },

  // 获取存储大小
  async getStorageSize(): Promise<number> {
    const database = await initDB()
    const attachments = await database.getAll('attachments')
    return attachments.reduce((total, item) => total + item.size, 0)
  },
}

// 清理所有过期数据
export async function cleanExpiredData(): Promise<void> {
  await Promise.all([
    draftDB.cleanExpired(),
    cacheDB.cleanExpired(),
  ])
}

// 初始化时清理过期数据
if (typeof window !== 'undefined') {
  cleanExpiredData().catch(console.error)
}


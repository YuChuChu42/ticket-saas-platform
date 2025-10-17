<template>
  <div class="file-upload">
    <el-upload
      ref="uploadRef"
      :file-list="fileList"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
      :show-file-list="true"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      drag
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          {{ tipText }}
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadProps, UploadRequestOptions } from 'element-plus'

interface Props {
  modelValue?: any[]
  multiple?: boolean
  limit?: number
  accept?: string
  maxSize?: number // MB
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  multiple: true,
  limit: 5,
  maxSize: 10,
})

const emit = defineEmits(['update:modelValue'])

const uploadRef = ref()
const fileList = ref<UploadFile[]>([])

const tipText = computed(() => {
  return `支持上传${props.limit}个文件，单个文件不超过${props.maxSize}MB`
})

// 文件变化
function handleChange(file: UploadFile) {
  console.log('File changed:', file)
}

// 删除文件
function handleRemove(file: UploadFile) {
  const index = fileList.value.findIndex((f) => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emit('update:modelValue', fileList.value)
  }
}

// 上传前检查
function beforeUpload(file: File) {
  const isLt = file.size / 1024 / 1024 < props.maxSize
  if (!isLt) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
    return false
  }
  return true
}

// 自定义上传（支持切片上传）
async function handleUpload(options: UploadRequestOptions) {
  const { file } = options
  
  try {
    // 大文件使用切片上传
    if (file.size > 5 * 1024 * 1024) {
      await uploadLargeFile(file)
    } else {
      await uploadNormalFile(file)
    }
    
    ElMessage.success('上传成功')
  } catch (error: any) {
    ElMessage.error(error.message || '上传失败')
    throw error
  }
}

// 普通上传
async function uploadNormalFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  // 实际项目中调用 API
  // await request.upload('/upload', formData)
  
  console.log('Normal upload:', file.name)
}

// 切片上传
async function uploadLargeFile(file: File) {
  const chunkSize = 1 * 1024 * 1024 // 1MB per chunk
  const chunks = Math.ceil(file.size / chunkSize)
  
  // 计算文件 hash（用于秒传和断点续传）
  const fileHash = await calculateFileHash(file)
  
  // 检查是否已上传（秒传）
  // const { uploaded, uploadedChunks } = await request.get(`/upload/check/${fileHash}`)
  // if (uploaded) {
  //   console.log('File already uploaded (instant upload)')
  //   return
  // }
  
  // 切片上传
  for (let i = 0; i < chunks; i++) {
    // if (uploadedChunks?.includes(i)) continue // 跳过已上传的分片
    
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    
    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('hash', fileHash)
    formData.append('index', i.toString())
    formData.append('total', chunks.toString())
    
    // await request.upload('/upload/chunk', formData)
    console.log(`Uploaded chunk ${i + 1}/${chunks}`)
  }
  
  // 合并分片
  // await request.post('/upload/merge', { hash: fileHash, total: chunks })
  console.log('Large file upload completed:', file.name)
}

// 计算文件 hash
async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve) => {
    // 简化版，实际应使用 spark-md5 或 Web Crypto API
    const reader = new FileReader()
    reader.onload = (e) => {
      const hash = btoa(String.fromCharCode(...new Uint8Array(e.target?.result as ArrayBuffer)))
      resolve(hash.slice(0, 32))
    }
    reader.readAsArrayBuffer(file.slice(0, 1024 * 1024)) // 只读取前 1MB 计算 hash
  })
}
</script>

<style lang="scss" scoped>
.file-upload {
  width: 100%;
}

:deep(.el-upload-dragger) {
  padding: 40px;
}
</style>


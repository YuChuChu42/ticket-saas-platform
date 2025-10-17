<template>
  <template v-if="!item.meta?.hidden">
    <!-- 有子菜单 -->
    <el-sub-menu v-if="hasChildren" :index="item.path">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>

    <!-- 无子菜单 -->
    <el-menu-item v-else :index="resolvePath(item.path)">
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import path from 'path-browserify'

interface Props {
  item: RouteRecordRaw
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  basePath: '',
})

// 是否有子菜单
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})

// 解析路径
function resolvePath(routePath: string) {
  if (/^https?:\/\//.test(routePath)) {
    return routePath
  }
  if (/^\//.test(routePath)) {
    return routePath
  }
  return path.resolve(props.basePath, routePath)
}
</script>


<template>
  <div ref="containerRef" class="virtual-list-container" :style="{ height: `${height}px` }">
    <div class="virtual-list-phantom" :style="{ height: `${totalHeight}px` }"></div>
    <div class="virtual-list-content" :style="{ transform: `translateY(${offset}px)` }">
      <div
        v-for="item in visibleData"
        :key="getItemKey(item)"
        class="virtual-list-item"
        :style="{ height: `${itemHeight}px` }"
      >
        <slot :item="item" :index="item.__index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  data: any[]
  itemHeight: number
  height: number
  buffer?: number
}

const props = withDefaults(defineProps<Props>(), {
  buffer: 5,
})

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)

// 总高度
const totalHeight = computed(() => props.data.length * props.itemHeight)

// 可见区域起始索引
const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
})

// 可见区域结束索引
const endIndex = computed(() => {
  const count = Math.ceil(props.height / props.itemHeight)
  return Math.min(props.data.length, startIndex.value + count + props.buffer * 2)
})

// 可见数据
const visibleData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value).map((item, index) => ({
    ...item,
    __index: startIndex.value + index,
  }))
})

// 偏移量
const offset = computed(() => startIndex.value * props.itemHeight)

// 滚动处理
function handleScroll() {
  if (containerRef.value) {
    scrollTop.value = containerRef.value.scrollTop
  }
}

// 获取项的唯一 key
function getItemKey(item: any) {
  return item.id || item.__index
}

// 滚动到指定索引
function scrollToIndex(index: number) {
  if (containerRef.value) {
    containerRef.value.scrollTop = index * props.itemHeight
  }
}

// 滚动到顶部
function scrollToTop() {
  scrollToIndex(0)
}

// 滚动到底部
function scrollToBottom() {
  scrollToIndex(props.data.length - 1)
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
})

// 数据变化时重置滚动位置
watch(() => props.data, () => {
  scrollTop.value = 0
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
  }
})

defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
})
</script>

<style lang="scss" scoped>
.virtual-list-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.virtual-list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.virtual-list-item {
  box-sizing: border-box;
}
</style>


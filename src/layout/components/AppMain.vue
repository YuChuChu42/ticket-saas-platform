<template>
  <main class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const cachedViews = computed(() => appStore.cachedViews)
</script>

<style lang="scss" scoped>
.app-main {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
  overflow-x: hidden;
}

// 页面过渡动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.25s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>


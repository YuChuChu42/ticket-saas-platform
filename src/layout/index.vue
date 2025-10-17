<template>
  <div class="app-container" :class="{ 'sidebar-collapsed': appStore.sidebarCollapsed }">
    <Sidebar />
    <div class="main-container">
      <Header />
      <TagsView />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import TagsView from './components/TagsView.vue'
import AppMain from './components/AppMain.vue'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &.sidebar-collapsed {
    .main-container {
      margin-left: 64px;
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 200px;
  transition: margin-left 0.3s ease;
  overflow: hidden;
}
</style>


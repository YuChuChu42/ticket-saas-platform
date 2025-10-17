<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-title">页面不存在</div>
      <div class="error-description">抱歉，您访问的页面不存在</div>
      <el-button type="primary" @click="$router.push('/dashboard')">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f7fa;

  .error-content {
    text-align: center;

    .error-code {
      font-size: 120px;
      font-weight: bold;
      color: #f56c6c;
      line-height: 1;
      margin-bottom: 20px;
    }

    .error-title {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 10px;
    }

    .error-description {
      font-size: 14px;
      color: #909399;
      margin-bottom: 30px;
    }
  }
}
</style>


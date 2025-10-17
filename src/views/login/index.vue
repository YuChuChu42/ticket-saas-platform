<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <h1>{{ t('login.title') }}</h1>
        <p class="subtitle">{{ t('login.subtitle') }}</p>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
        <!-- 角色选择 -->
        <el-form-item prop="roleType">
          <el-select
            v-model="loginForm.roleType"
            :placeholder="t('login.selectRole')"
            size="large"
            style="width: 100%"
          >
            <el-option :label="t('login.admin')" value="admin" />
            <el-option :label="t('login.operator')" value="operator" />
            <el-option :label="t('login.customer')" value="customer" />
          </el-select>
        </el-form-item>

        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="t('login.username')"
            size="large"
            prefix-icon="User"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            :placeholder="t('login.password')"
            size="large"
            prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <!-- 记住我 -->
        <el-form-item>
          <div class="form-footer">
            <el-checkbox v-model="loginForm.rememberMe">
              {{ t('login.rememberMe') }}
            </el-checkbox>
            <el-link type="primary" :underline="false">
              {{ t('login.forgotPassword') }}
            </el-link>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >
            {{ t('login.login') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="demo-accounts">
        <el-divider>演示账号</el-divider>
        <div class="account-list">
          <el-tag
            v-for="account in demoAccounts"
            :key="account.username"
            class="account-tag"
            @click="fillDemoAccount(account)"
          >
            {{ account.label }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { t } from '@/i18n'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  roleType: 'admin',
  rememberMe: false,
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  roleType: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

// 演示账号
const demoAccounts = [
  { label: '管理员', username: 'admin', password: 'admin123', roleType: 'admin' },
  { label: '运营', username: 'operator', password: 'operator123', roleType: 'operator' },
  { label: '客服', username: 'customer', password: 'customer123', roleType: 'customer' },
]

// 填充演示账号
function fillDemoAccount(account: any) {
  loginForm.username = account.username
  loginForm.password = account.password
  loginForm.roleType = account.roleType
}

// 登录
async function handleLogin() {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    await userStore.login(
      loginForm.username,
      loginForm.password,
      loginForm.roleType
    )

    ElMessage.success(t('login.loginSuccess'))
    
    // 跳转到首页或重定向页面
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/dashboard')
  } catch (error: any) {
    ElMessage.error(error.message || t('login.loginFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  // 装饰性背景
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    opacity: 0.1;
  }

  &::before {
    background: #fff;
    top: -100px;
    left: -100px;
  }

  &::after {
    background: #fff;
    bottom: -100px;
    right: -100px;
  }
}

.login-box {
  width: 450px;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 10px;
  }

  .subtitle {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }
}

.login-form {
  .form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}

.demo-accounts {
  margin-top: 30px;

  .account-list {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .account-tag {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>


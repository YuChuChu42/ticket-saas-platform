import { test, expect } from '@playwright/test'

test.describe('登录页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('应该正确显示登录页面', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '智链工单与运营看板' })).toBeVisible()
    await expect(page.getByPlaceholder('用户名')).toBeVisible()
    await expect(page.getByPlaceholder('密码')).toBeVisible()
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible()
  })

  test('应该能够成功登录（管理员）', async ({ page }) => {
    // 填写登录信息
    await page.getByPlaceholder('用户名').fill('admin')
    await page.getByPlaceholder('密码').fill('admin123')
    
    // 点击登录按钮
    await page.getByRole('button', { name: '登录' }).click()
    
    // 验证跳转到首页
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('数据大屏')).toBeVisible()
  })

  test('应该显示登录错误信息', async ({ page }) => {
    // 填写错误的登录信息
    await page.getByPlaceholder('用户名').fill('wronguser')
    await page.getByPlaceholder('密码').fill('wrongpass')
    
    // 点击登录按钮
    await page.getByRole('button', { name: '登录' }).click()
    
    // 验证错误提示
    await expect(page.getByText(/登录失败/)).toBeVisible()
  })

  test('应该能够使用演示账号快速填充', async ({ page }) => {
    // 点击演示账号标签
    await page.getByText('管理员').first().click()
    
    // 验证表单已填充
    await expect(page.getByPlaceholder('用户名')).toHaveValue('admin')
    await expect(page.getByPlaceholder('密码')).toHaveValue('admin123')
  })
})


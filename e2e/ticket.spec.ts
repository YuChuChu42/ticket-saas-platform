import { test, expect } from '@playwright/test'

test.describe('工单管理', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill('admin')
    await page.getByPlaceholder('密码').fill('admin123')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('应该能够查看工单列表', async ({ page }) => {
    // 导航到工单列表
    await page.goto('/ticket/list')
    
    // 验证页面元素
    await expect(page.getByText('工单列表')).toBeVisible()
    await expect(page.getByRole('button', { name: '创建工单' })).toBeVisible()
  })

  test('应该能够搜索工单', async ({ page }) => {
    await page.goto('/ticket/list')
    
    // 输入搜索条件
    await page.getByPlaceholder('请输入工单编号').fill('TK20240115001')
    await page.getByRole('button', { name: '搜索' }).click()
    
    // 验证搜索结果
    await expect(page.getByText('TK20240115001')).toBeVisible()
  })

  test('应该能够创建工单', async ({ page }) => {
    await page.goto('/ticket/create')
    
    // 填写表单
    await page.getByPlaceholder('请输入工单标题').fill('测试工单')
    await page.getByPlaceholder('请详细描述问题或需求').fill('这是一个测试工单')
    
    // 选择类型和优先级
    await page.getByLabel('工单类型').click()
    await page.getByText('故障').click()
    
    await page.getByLabel('优先级').click()
    await page.getByText('中').click()
    
    // 提交
    await page.getByRole('button', { name: '提交工单' }).click()
    
    // 验证成功提示
    await expect(page.getByText('工单创建成功')).toBeVisible()
  })

  test('应该能够查看工单详情', async ({ page }) => {
    await page.goto('/ticket/list')
    
    // 点击第一个工单
    await page.locator('.ticket-item').first().click()
    
    // 验证详情页面
    await expect(page.getByText('工单详情')).toBeVisible()
    await expect(page.getByText('工单编号')).toBeVisible()
  })
})


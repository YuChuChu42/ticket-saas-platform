import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VirtualList from '@/components/VirtualList/index.vue'

describe('VirtualList', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(VirtualList, {
      props: {
        data: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
        ],
        itemHeight: 50,
        height: 300,
      },
      slots: {
        default: `
          <template #default="{ item }">
            <div>{{ item.name }}</div>
          </template>
        `,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.virtual-list-container').exists()).toBe(true)
  })

  it('应该计算正确的总高度', () => {
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
    
    const wrapper = mount(VirtualList, {
      props: {
        data,
        itemHeight: 50,
        height: 300,
      },
    })

    const phantom = wrapper.find('.virtual-list-phantom')
    expect(phantom.attributes('style')).toContain('height: 5000px')
  })

  it('应该只渲染可见区域的项', () => {
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
    
    const wrapper = mount(VirtualList, {
      props: {
        data,
        itemHeight: 50,
        height: 300,
        buffer: 2,
      },
      slots: {
        default: `
          <template #default="{ item }">
            <div class="item">{{ item.name }}</div>
          </template>
        `,
      },
    })

    // 应该只渲染可见区域的项 + buffer
    const items = wrapper.findAll('.virtual-list-item')
    expect(items.length).toBeLessThan(data.length)
    expect(items.length).toBeGreaterThan(0)
  })
})


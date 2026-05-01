import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AddProductModal from './AddProductModal.vue'

// Mocking everything to isolate pure logic
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

vi.mock('../utils/keyboard', () => ({
  useKeyboardShortcuts: () => ({
    register: vi.fn(),
    unregister: vi.fn()
  })
}))

describe('AddProductModal.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(AddProductModal, {
      props: {
        visible: true,
        loading: false,
        ...props
      },
      global: {
        stubs: {
          Dialog: { template: '<div><slot/><slot name="footer"/></div>' },
          InputText: true,
          Button: true,
          Select: true
        }
      }
    })
  }

  it('initializes product ref correctly', () => {
    const wrapper = mountComponent()
    const vm = wrapper.vm
    expect(vm.product.name).toBe('')
    expect(vm.product.type).toBe('serial')
  })

  it('emits save event when handleSave is called', async () => {
    const wrapper = mountComponent()
    const vm = wrapper.vm
    vm.product = {
      name: 'Test',
      sku: 'SKU',
      type: 'serial',
      brand: 'Brand',
      category: 'Smartphones'
    }
    
    await vm.handleSave()
    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')[0][0].name).toBe('Test')
  })
})

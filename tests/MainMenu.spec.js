import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import MainMenu from '../components/common/MainMenu.vue'

describe('MainMenu', () => {
  it('check MainMenu text', () => {
    const wrapper = mount(MainMenu)
    expect(wrapper.text()).toContain('About')
    expect(wrapper.text()).toContain('The consortium')
  })
})
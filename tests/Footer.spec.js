import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Footer from '../components/common/Footer.vue'

describe('Footer', () => {
  it('check Footer text', () => {
    const wrapper = mount(Footer)
    expect(wrapper.text()).toContain('Molecular Modeling and Bioinformatics')
  })
})
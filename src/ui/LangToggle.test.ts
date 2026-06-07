import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18n } from '@app/i18n'
import LangToggle from './LangToggle.vue'

describe('LangToggle', () => {
  it('renders EN and עב options with globe', () => {
    setActivePinia(createPinia())
    const w = mount(LangToggle, { global: { plugins: [i18n] } })
    const buttons = w.findAll('.lang-toggle-option')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]!.text()).toBe('EN')
    expect(buttons[1]!.text()).toBe('עב')
    expect(w.find('.lang-toggle-globe').exists()).toBe(true)
  })
})

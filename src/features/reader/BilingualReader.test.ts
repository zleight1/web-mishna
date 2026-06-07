import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BilingualReader from './BilingualReader.vue'
import { fixtureMishnah } from '@mocks/fixtures'

describe('BilingualReader', () => {
  it('renders Hebrew with dir rtl', () => {
    const w = mount(BilingualReader, { props: { mishnah: fixtureMishnah, lang: 'en' } })
    const he = w.find('[dir="rtl"]')
    expect(he.exists()).toBe(true)
    expect(he.text()).toContain('מֵאֵימָתַי')
  })

  it('toggles transliteration', async () => {
    const w = mount(BilingualReader, { props: { mishnah: fixtureMishnah, lang: 'en' } })
    await w.find('input[type="checkbox"]').setValue(true)
    expect(w.text()).toContain("Me'eimatai")
  })

  it('reveals translation on tap', async () => {
    const w = mount(BilingualReader, { props: { mishnah: fixtureMishnah, lang: 'en' } })
    await w.find('.cursor-pointer').trigger('click')
    expect(w.text()).toContain('From when does one recite Shema')
  })
})

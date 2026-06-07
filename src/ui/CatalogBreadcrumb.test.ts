import { describe, it, expect } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import { i18n } from '@app/i18n'
import CatalogBreadcrumb from './CatalogBreadcrumb.vue'

describe('CatalogBreadcrumb', () => {
  it('renders linked and current crumbs', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/learn/:order/:tractate/:chapter', component: { template: '<div />' } },
      ],
    })
    await router.push('/')
    await router.isReady()

    const w = mount(CatalogBreadcrumb, {
      props: {
        navLabel: 'Breadcrumb',
        items: [
          { id: 'home', label: 'Web Mishnah', to: '/' },
          { id: 'seder', label: 'Zeraim', to: '/#seder-zeraim' },
          { id: 'chapter', label: 'Berakhot Chapter 1' },
        ],
      },
      global: { plugins: [router, i18n] },
    })

    const links = w.findAll('a')
    expect(links).toHaveLength(2)
    expect(links[0]!.attributes('href')).toBe('/')
    expect(links[1]!.attributes('href')).toBe('/#seder-zeraim')
    expect(w.find('.catalog-breadcrumb-current').text()).toBe('Berakhot Chapter 1')
    expect(w.find('nav').attributes('aria-label')).toBe('Breadcrumb')
  })
})

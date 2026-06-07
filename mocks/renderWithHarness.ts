import { mount, type MountingOptions } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import type { Component } from 'vue'
import { i18n } from '@app/i18n'
import { servicesKey, createServices } from '@app/providers'
import type { Services } from '@core/contracts/services'

export interface HarnessOptions {
  services?: Partial<Services>
  route?: string
  props?: Record<string, unknown>
}

export function renderWithHarness(
  component: Component,
  options: HarnessOptions = {},
  mountOptions: MountingOptions<unknown> = {},
) {
  setActivePinia(createPinia())
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  const baseServices = createServices()
  const services: Services = { ...baseServices, ...options.services }

  return mount(component, {
    global: {
      plugins: [router, i18n],
      provide: { [servicesKey as unknown as string]: services },
    },
    props: options.props,
    ...mountOptions,
  })
}

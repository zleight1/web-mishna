import { inject, type InjectionKey } from 'vue'
import type { Services } from '@core/contracts/services'
import { createDefaultServices } from '@core/services/defaults'

export const servicesKey: InjectionKey<Services> = Symbol('services')

let fallbackServices: Services | null = null

export function createServices(): Services {
  return createDefaultServices()
}

export function setFallbackServices(services: Services): void {
  fallbackServices = services
}

export function useServices(): Services {
  const services = inject(servicesKey, null)
  if (services) return services
  if (fallbackServices) return fallbackServices
  throw new Error('Services not provided')
}

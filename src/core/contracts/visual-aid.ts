import type { Component } from 'vue'
import type { VisualAid } from '@content/schema'

export interface VisualAidRenderer {
  kind: VisualAid['kind']
  lazy?: boolean
  component: Component
}

export interface Registry<T extends { kind: string }> {
  register(item: T): void
  get(kind: string): T | undefined
  all(): T[]
}

export function createRegistry<T extends { kind: string }>(): Registry<T> {
  const map = new Map<string, T>()
  return {
    register: (item) => {
      map.set(item.kind, item)
    },
    get: (kind) => map.get(kind),
    all: () => [...map.values()],
  }
}

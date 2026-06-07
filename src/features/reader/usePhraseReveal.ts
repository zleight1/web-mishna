import { ref } from 'vue'

export function usePhraseReveal() {
  const revealed = ref<Set<number>>(new Set())
  const showTranslit = ref(false)

  function toggle(index: number) {
    const next = new Set(revealed.value)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    revealed.value = next
  }

  function isRevealed(index: number) {
    return revealed.value.has(index)
  }

  return { showTranslit, toggle, isRevealed }
}

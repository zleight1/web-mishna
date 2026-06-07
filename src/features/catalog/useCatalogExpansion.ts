import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

function expansionKey(...parts: string[]) {
  return parts.join(':')
}

export function useCatalogExpansion() {
  const route = useRoute()
  const openKeys = reactive<Record<string, boolean>>({})

  function isOpen(...parts: string[]) {
    return !!openKeys[expansionKey(...parts)]
  }

  function setOpen(...parts: string[]) {
    openKeys[expansionKey(...parts)] = true
  }

  function setClosed(...parts: string[]) {
    delete openKeys[expansionKey(...parts)]
  }

  function handleExpanded(expanded: boolean, ...parts: string[]) {
    if (expanded) setOpen(...parts)
    else setClosed(...parts)
  }

  function expandFromHash(hash: string) {
    if (!hash.startsWith('#seder-')) return
    setOpen('seder', hash.slice('#seder-'.length))
  }

  watch(() => route.hash, expandFromHash, { immediate: true })

  return { isOpen, setOpen, setClosed, handleExpanded }
}

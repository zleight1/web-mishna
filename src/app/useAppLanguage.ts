import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LangCode } from '@content/schema'

const STORAGE_KEY = 'web-mishna.lang'

function readStoredLang(): LangCode {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'he' ? 'he' : 'en'
}

const lang = ref<LangCode>(readStoredLang())

function applyDocumentLang(next: LangCode) {
  document.documentElement.lang = next
  document.documentElement.dir = next === 'he' ? 'rtl' : 'ltr'
}

export function initAppLanguage() {
  applyDocumentLang(lang.value)
}

export function useAppLanguage() {
  const { locale } = useI18n()

  if (locale.value !== lang.value) {
    locale.value = lang.value
  }

  function setLang(next: LangCode) {
    lang.value = next
    locale.value = next
    localStorage.setItem(STORAGE_KEY, next)
    applyDocumentLang(next)
  }

  return {
    lang: computed({
      get: () => lang.value,
      set: setLang,
    }),
  }
}

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import { initAppLanguage } from './useAppLanguage'
import { servicesKey, createServices, setFallbackServices } from './providers'
import '../ui/tokens.css'

const savedLang = localStorage.getItem('web-mishna.lang')
if (savedLang === 'he' || savedLang === 'en') {
  i18n.global.locale.value = savedLang
}
initAppLanguage()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
const services = createServices()
setFallbackServices(services)
app.provide(servicesKey, services)
app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import { servicesKey, createServices, setFallbackServices } from './providers'
import '../ui/tokens.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
const services = createServices()
setFallbackServices(services)
app.provide(servicesKey, services)
app.mount('#app')

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-dvh">
    <header class="border-b border-[var(--color-border)] bg-white px-4 py-3">
      <div class="mx-auto flex max-w-3xl items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-[var(--color-primary)]">{{ t('app.title') }}</h1>
          <p class="text-sm text-[var(--color-text-muted)]">{{ t('app.subtitle') }}</p>
        </div>
        <RouterLink to="/credits" class="text-sm text-[var(--color-primary)] hover:underline">
          {{ t('app.credits') }}
        </RouterLink>
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

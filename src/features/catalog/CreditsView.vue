<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="prose max-w-none space-y-4">
    <h2>{{ t('app.credits') }}</h2>
    <section>
      <h3 class="font-semibold">{{ t('app.creditsHebrew') }}</h3>
      <p>
        {{ t('app.creditsToratEmet') }}
        <a href="https://www.sefaria.org" class="text-[var(--color-primary)]">Sefaria</a>
      </p>
    </section>
    <section>
      <h3 class="font-semibold">{{ t('app.creditsEnglish') }}</h3>
      <p>
        {{ t('app.creditsKulp') }}
        <a href="https://www.sefaria.org" class="text-[var(--color-primary)]">Sefaria</a>
      </p>
    </section>
    <section>
      <h3 class="font-semibold">{{ t('app.creditsApp') }}</h3>
      <p>{{ t('app.creditsMit') }} {{ t('app.creditsHobby') }}</p>
    </section>
  </div>
</template>

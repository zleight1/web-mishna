<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="prose max-w-none space-y-4">
    <h2>{{ t('app.credits') }}</h2>
    <section>
      <h3 class="font-semibold">Hebrew text</h3>
      <p>
        Torat Emet 357 (Public Domain) via
        <a href="https://www.sefaria.org" class="text-[var(--color-primary)]">Sefaria</a>
      </p>
    </section>
    <section>
      <h3 class="font-semibold">English translation</h3>
      <p>
        Mishnah Yomit by Dr. Joshua Kulp (CC-BY) via
        <a href="https://www.sefaria.org" class="text-[var(--color-primary)]">Sefaria</a>
      </p>
    </section>
    <section>
      <h3 class="font-semibold">Application</h3>
      <p>MIT License. A hobby project for learning Mishnah.</p>
    </section>
  </div>
</template>

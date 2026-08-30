<script setup>
const items = [
  'Haute Couture',
  'FW 2026',
  'Avant-Garde',
  'Maison',
  'Silhouette',
  'Atelier',
  'Editorial',
  'Craft',
]
</script>

<template>
  <section class="py-12 md:py-16 bg-ink-950 border-y border-ink-800 overflow-hidden">
    <div class="marquee whitespace-nowrap">
      <div class="marquee__content">
        <span
          v-for="(item, i) in [...items, ...items]"
          :key="i"
          class="flex items-center gap-8"
        >
          <span class="font-display text-4xl md:text-6xl tracking-wide text-ink-50">{{ item }}</span>
          <span class="text-accent-500 text-3xl">✦</span>
        </span>
      </div>
      <div class="marquee__content" aria-hidden="true">
        <span
          v-for="(item, i) in [...items, ...items]"
          :key="`dup-${i}`"
          class="flex items-center gap-8"
        >
          <span class="font-display text-4xl md:text-6xl tracking-wide text-ink-50">{{ item }}</span>
          <span class="text-accent-500 text-3xl">✦</span>
        </span>
      </div>
    </div>
  </section>
</template>

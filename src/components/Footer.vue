```vue
<script setup>
const links = {
  Shop: ['New Arrivals', 'Collections', 'Accessories', 'Gift Cards'],
  Maison: ['Our Story', 'Atelier', 'Sustainability', 'Careers'],
  Service: ['Contact', 'Shipping', 'Returns', 'FAQ'],
}

const socials = ['Instagram', 'Pinterest', 'TikTok', 'YouTube']
</script>

<template>
  <footer class="bg-ink-950 border-t border-ink-800 pt-20 pb-10">
    <div class="max-w-[1600px] mx-auto px-6 md:px-12">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-16">
        <div class="col-span-2">
          <h3 class="font-display text-3xl tracking-[0.15em] text-ink-50 mb-4">
            MAISON
          </h3>

          <p class="font-serif text-ink-400 max-w-xs leading-relaxed">
            Fashion as living sculpture. Crafted in our atelier since 2014.
          </p>

          <div class="flex gap-4 mt-6">
            <a
              v-for="social in socials"
              :key="social"
              href="#"
              class="font-sans text-xs tracking-[0.15em] uppercase text-ink-400 hover:text-accent-400 transition-colors cursor-hover"
            >
              {{ social }}
            </a>
          </div>
        </div>

        <div v-for="(items, title) in links" :key="title">
          <h4 class="font-sans text-xs tracking-[0.2em] uppercase text-ink-50 mb-5">
            {{ title }}
          </h4>

          <ul class="space-y-3">
            <li v-for="item in items" :key="item">
              <a
                href="#"
                class="font-serif text-ink-400 hover:text-accent-400 transition-colors cursor-hover"
              >
                {{ item }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-ink-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="font-sans text-xs text-ink-500">
          © 2026 Maison. All rights reserved.
        </p>

        <div class="flex gap-6">
          <a
            href="#"
            class="font-sans text-xs text-ink-500 hover:text-ink-300 transition-colors cursor-hover"
          >
            Privacy
          </a>

          <a
            href="#"
            class="font-sans text-xs text-ink-500 hover:text-ink-300 transition-colors cursor-hover"
          >
            Terms
          </a>

          <a
            href="#"
            class="font-sans text-xs text-ink-500 hover:text-ink-300 transition-colors cursor-hover"
          >
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
```

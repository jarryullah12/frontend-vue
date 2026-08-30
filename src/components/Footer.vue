<script setup>
const emit = defineEmits(['navigate'])

const go = (view) => {
  emit('navigate', view)
  window.scrollTo({
    top: 0,
    behavior: 'instant',
  })
}

const shopLinks = [
  { label: 'Collections', view: 'collections' },
  { label: 'Lookbook', view: 'lookbook' },
  { label: 'Accessories', view: 'accessories' },
]
</script>

<template>
  <footer class="bg-ink-950 border-t border-ink-800 pt-20 pb-10">
    <div class="max-w-[1600px] mx-auto px-6 md:px-12">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-16">

        <!-- Maison -->
        <div>
          <h3
            class="font-display text-3xl tracking-[0.15em] text-ink-50 mb-4"
          >
            MAISON
          </h3>

          <p class="font-serif text-ink-400 max-w-xs leading-relaxed">
            Fashion as living sculpture. Crafted in our atelier since 2014.
          </p>
        </div>

        <!-- Shop -->
        <div>
          <h4
            class="font-sans text-xs tracking-[0.2em] uppercase text-ink-50 mb-5"
          >
            Shop
          </h4>

          <ul class="space-y-3">
            <li v-for="item in shopLinks" :key="item.view">
              <button
                @click="go(item.view)"
                class="font-serif text-ink-400 hover:text-accent-400 transition-colors cursor-hover text-left"
              >
                {{ item.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Information -->
        <div>
          <h4
            class="font-sans text-xs tracking-[0.2em] uppercase text-ink-50 mb-5"
          >
            Information
          </h4>

          <ul class="space-y-3">
            <li>
              <button
                @click="go('about')"
                class="font-serif text-ink-400 hover:text-accent-400 transition-colors cursor-hover"
              >
                About
              </button>
            </li>

            <li>
              <button
                @click="go('contact')"
                class="font-serif text-ink-400 hover:text-accent-400 transition-colors cursor-hover"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        <!-- Account -->
        <div>
          <h4
            class="font-sans text-xs tracking-[0.2em] uppercase text-ink-50 mb-5"
          >
            Account
          </h4>

          <ul class="space-y-3">
            <li>
              <button
                @click="go('auth')"
                class="font-serif text-ink-400 hover:text-accent-400 transition-colors cursor-hover"
              >
                Sign In
              </button>
            </li>

            <li>
              <button
                @click="go('account')"
                class="font-serif text-ink-400 hover:text-accent-400 transition-colors cursor-hover"
              >
                My Account
              </button>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom -->
      <div
        class="border-t border-ink-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p class="font-sans text-xs text-ink-500">
          © 2026 Maison. All rights reserved.
        </p>
      </div>

    </div>
  </footer>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { useCart } from '../composables/useCart'

const emit = defineEmits(['navigate'])

const { add } = useCart()

const products = ref([])
const loading = ref(true)

const formatPrice = (price) => {
  return '$' + Number(price || 0).toLocaleString()
}

onMounted(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'accessories')
    .order('sort_order')

  if (error) {
    console.error('Error loading accessories:', error.message)
  } else {
    products.value = data || []
  }

  loading.value = false

  gsap.from('.accessories-page-header', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  })
})
</script>

<template>
  <section class="min-h-screen bg-ink-950 px-6 md:px-12 py-32">
    <div class="max-w-[1600px] mx-auto">

      <div class="accessories-page-header mb-16">

        <button
          @click="emit('navigate', 'home')"
          class="font-sans text-xs tracking-[0.2em] uppercase text-ink-500 hover:text-accent-400 mb-8"
        >
          ← Back to Store
        </button>

        <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-4">
          N° 04 — Accessories
        </p>

        <h1 class="font-display text-5xl md:text-7xl lg:text-8xl text-ink-50 leading-[0.9]">
          The
          <span class="italic font-light text-ink-400">
            Finishing
          </span>
          Touch
        </h1>

        <p class="font-serif text-lg text-ink-400 max-w-xl mt-8 leading-relaxed">
          Complete your look with our collection of refined accessories,
          created to complement every Maison piece.
        </p>
      </div>

      <div
        v-if="loading"
        class="flex justify-center py-20"
      >
        <p class="font-serif text-ink-400 text-lg">
          Loading accessories...
        </p>
      </div>

      <div
        v-else-if="products.length === 0"
        class="border border-ink-800 p-16 text-center"
      >
        <p class="font-serif text-ink-400 text-lg">
          No accessories available.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="group"
        >
          <div class="relative aspect-square overflow-hidden bg-ink-900 mb-5">

            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <button
                @click="add(product)"
                class="w-full bg-accent-500 text-ink-950 py-3 font-sans text-xs tracking-[0.2em] uppercase"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div class="flex justify-between items-baseline">
            <h2 class="font-serif text-xl text-ink-50 group-hover:text-accent-400">
              {{ product.name }}
            </h2>

            <p class="font-sans text-sm text-ink-400">
              {{ formatPrice(product.price) }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>


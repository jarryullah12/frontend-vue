
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
    .eq('category', 'collection')
    .order('sort_order')

  if (error) {
    console.error('Error loading collections:', error.message)
  } else {
    products.value = data || []
  }

  loading.value = false

  gsap.from('.collection-page-header', {
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

      <!-- Header -->
      <div class="collection-page-header mb-16">
        <button
          @click="emit('navigate', 'home')"
          class="font-sans text-xs tracking-[0.2em] uppercase text-ink-500 hover:text-accent-400 mb-8"
        >
          ← Back to Store
        </button>

        <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-4">
          N° 02 — The Collection
        </p>

        <h1 class="font-display text-5xl md:text-7xl lg:text-8xl text-ink-50 leading-[0.9]">
          Signature
          <span class="italic font-light text-ink-400">
            Pieces
          </span>
        </h1>

        <p class="font-serif text-lg text-ink-400 max-w-xl mt-8 leading-relaxed">
          Discover our complete collection of carefully crafted pieces,
          designed with timeless proportions and exceptional materials.
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="flex justify-center py-20"
      >
        <p class="font-serif text-ink-400 text-lg">
          Loading collection...
        </p>
      </div>

      <!-- Empty -->
      <div
        v-else-if="products.length === 0"
        class="border border-ink-800 p-16 text-center"
      >
        <p class="font-serif text-ink-400 text-lg">
          No collection pieces available.
        </p>
      </div>

      <!-- Products -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="group"
        >
          <div class="relative aspect-[3/4] overflow-hidden bg-ink-900 mb-5">

            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div
              v-if="product.tag"
              class="absolute top-4 left-4"
            >
              <span class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-50 bg-ink-950/70 px-3 py-1.5">
                {{ product.tag }}
              </span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <button
                @click="add(product)"
                class="w-full bg-accent-500 text-ink-950 py-3 font-sans text-xs tracking-[0.2em] uppercase"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div class="flex justify-between gap-4">
            <h2 class="font-serif text-lg text-ink-50 group-hover:text-accent-400">
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


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart } from '../composables/useCart'

gsap.registerPlugin(ScrollTrigger)

const { add } = useCart()

const sectionRef = ref(null)
const accessories = ref([])
const loading = ref(true)

const formatPrice = (n) =>
  '$' + Number(n || 0).toLocaleString()

// Fake API / Dummy Accessories Data
const fakeAccessories = [
  {
    id: 'acc-001',
    name: 'Leather Crossbody Bag',
    price: 185,
    tag: 'Bags',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    sort_order: 1,
  },
  {
    id: 'acc-002',
    name: 'Minimal Leather Wallet',
    price: 95,
    tag: 'Leather Goods',
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    sort_order: 2,
  },
  {
    id: 'acc-003',
    name: 'Classic Sunglasses',
    price: 145,
    tag: 'Eyewear',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    sort_order: 3,
  },
  {
    id: 'acc-004',
    name: 'Silk Scarf',
    price: 120,
    tag: 'Scarves',
    image:
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    sort_order: 4,
  },
  {
    id: 'acc-005',
    name: 'Leather Belt',
    price: 110,
    tag: 'Leather Goods',
    image:
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    sort_order: 5,
  },
  {
    id: 'acc-006',
    name: 'Structured Tote',
    price: 225,
    tag: 'Bags',
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    sort_order: 6,
  },
]

onMounted(async () => {
  // Simulate fake API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  accessories.value = [...fakeAccessories].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  loading.value = false

  // GSAP animations
  const ctx = gsap.context(() => {
    gsap.from('.acc-header', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
      },
    })

    gsap.utils.toArray('.acc-card').forEach((card, i) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      })
    })
  }, sectionRef.value)

  // Store cleanup function on the element
  sectionRef.value._gsapCleanup = () => ctx.revert()
})

onUnmounted(() => {
  if (sectionRef.value?._gsapCleanup) {
    sectionRef.value._gsapCleanup()
  }

  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <section
    id="accessories"
    ref="sectionRef"
    class="py-24 md:py-40 bg-ink-950 relative"
  >
    <div class="max-w-[1600px] mx-auto px-6 md:px-12">

      <!-- Header -->
      <div
        class="acc-header flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
      >
        <div>
          <p
            class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-4"
          >
            N° 04 — Accessories
          </p>

          <h2
            class="font-display text-5xl md:text-7xl text-ink-50 leading-[0.9]"
          >
            The
            <span class="italic font-light text-ink-400">
              Finishing
            </span>
            Touch
          </h2>
        </div>

        <a
          href="#"
          class="font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-accent-400 transition-colors border-b border-ink-700 pb-1 cursor-hover"
        >
          View All →
        </a>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="flex justify-center py-20"
      >
        <p class="font-serif text-ink-400 text-lg">
          Loading accessories...
        </p>
      </div>

      <!-- Products -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"
      >
        <div
          v-for="(item, i) in accessories"
          :key="item.id"
          class="acc-card group cursor-hover"
        >
          <!-- Image -->
          <div
            class="relative aspect-square overflow-hidden bg-ink-900 mb-5"
          >
            <img
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              :src="item.image"
              :alt="item.name"
              loading="lazy"
            />

            <div
              class="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/30 transition-all duration-500"
            ></div>

            <!-- Quick Add -->
            <div
              class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            >
              <button
                @click="add(item)"
                class="w-full bg-ink-50 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase py-3 cursor-hover"
              >
                Quick Add
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div
            class="flex justify-between items-baseline"
          >
            <div>
              <h3
                class="font-serif text-xl text-ink-50 group-hover:text-accent-400 transition-colors"
              >
                {{ item.name }}
              </h3>

              <p
                v-if="item.tag"
                class="font-sans text-[10px] tracking-[0.15em] uppercase text-ink-500 mt-1"
              >
                {{ item.tag }}
              </p>
            </div>

            <p
              class="font-sans text-sm text-ink-400"
            >
              {{ formatPrice(item.price) }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

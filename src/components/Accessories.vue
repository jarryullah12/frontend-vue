<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../composables/useSupabase'
import { useCart } from '../composables/useCart'

gsap.registerPlugin(ScrollTrigger)

const { add } = useCart()
const sectionRef = ref(null)
const accessories = ref([])
const loading = ref(true)

const formatPrice = (n) => '$' + n.toLocaleString()

onMounted(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'accessories')
    .order('sort_order')

  if (error) {
    console.error('Error loading accessories:', error.message)
  } else {
    accessories.value = data || []
  }
  loading.value = false

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

  return () => ctx.revert()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <section id="accessories" ref="sectionRef" class="py-24 md:py-40 bg-ink-950 relative">
    <div class="max-w-[1600px] mx-auto px-6 md:px-12">
      <div class="acc-header flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-4">N° 04 — Accessories</p>
          <h2 class="font-display text-5xl md:text-7xl text-ink-50 leading-[0.9]">
            The <span class="italic font-light text-ink-400">Finishing</span> Touch
          </h2>
        </div>
        <a href="#" class="font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-accent-400 transition-colors border-b border-ink-700 pb-1 cursor-hover">
          View All →
        </a>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <p class="font-serif text-ink-400 text-lg">Loading accessories...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        <div
          v-for="(item, i) in accessories"
          :key="item.id"
          class="acc-card group cursor-hover"
        >
          <div class="relative aspect-square overflow-hidden bg-ink-900 mb-5">
            <img
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              :src="item.image"
              :alt="item.name"
            />
            <div class="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/30 transition-all duration-500"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <button @click="add(item)" class="w-full bg-ink-50 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase py-3 cursor-hover">
                Quick Add
              </button>
            </div>
          </div>
          <div class="flex justify-between items-baseline">
            <h3 class="font-serif text-xl text-ink-50 group-hover:text-accent-400 transition-colors">{{ item.name }}</h3>
            <p class="font-sans text-sm text-ink-400">{{ formatPrice(item.price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../composables/useSupabase'
import { useCart } from '../composables/useCart'

gsap.registerPlugin(ScrollTrigger)

const { add } = useCart()
const sectionRef = ref(null)
const pieces = ref([])
const loading = ref(true)

const formatPrice = (n) => '$' + n.toLocaleString()

onMounted(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'collection')
    .order('sort_order')

  if (error) {
    console.error('Error loading products:', error.message)
  } else {
    pieces.value = data || []
  }
  loading.value = false

  const ctx = gsap.context(() => {
    gsap.from('.collection-heading', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 75%',
      },
    })

    gsap.utils.toArray('.collection-card').forEach((card, i) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        rotationY: 15,
        duration: 1,
        ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      })

      const img = card.querySelector('.collection-img')
      if (img) {
        gsap.to(img, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    })
  }, sectionRef.value)

  return () => ctx.revert()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <section id="collections" ref="sectionRef" class="py-24 md:py-40 bg-ink-950 relative">
    <div class="max-w-[1600px] mx-auto px-6 md:px-12">
      <div class="collection-heading flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
        <div>
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-4">N° 02 — The Collection</p>
          <h2 class="font-display text-5xl md:text-7xl lg:text-8xl text-ink-50 leading-[0.9]">
            Signature<br />
            <span class="italic font-light text-ink-400">Pieces</span>
          </h2>
        </div>
        <p class="font-serif text-lg text-ink-300 max-w-md leading-relaxed">
          Each piece is a study in proportion and material — crafted in our atelier from the finest natural fibers.
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <p class="font-serif text-ink-400 text-lg">Loading collection...</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div
          v-for="(piece, i) in pieces"
          :key="piece.id"
          class="collection-card group cursor-hover preserve-3d"
          :class="i % 2 === 1 ? 'md:mt-16' : ''"
        >
          <div class="relative aspect-[3/4] overflow-hidden bg-ink-900 mb-4">
            <img
              class="collection-img absolute inset-0 w-full h-[130%] object-cover transition-transform duration-700 group-hover:scale-105"
              :src="piece.image"
              :alt="piece.name"
            />
            <div class="absolute inset-0 bg-ink-950/20 group-hover:bg-ink-950/0 transition-all duration-500"></div>
            <div class="absolute top-4 left-4" v-if="piece.tag">
              <span class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-50 bg-ink-950/60 backdrop-blur-sm px-3 py-1.5">
                {{ piece.tag }}
              </span>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <button @click="add(piece)" class="w-full bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase py-3 cursor-hover">
                Add to Cart
              </button>
            </div>
          </div>
          <div class="flex justify-between items-start">
            <h3 class="font-serif text-xl text-ink-50 group-hover:text-accent-400 transition-colors duration-300">{{ piece.name }}</h3>
            <p class="font-sans text-sm text-ink-400 mt-1">{{ formatPrice(piece.price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

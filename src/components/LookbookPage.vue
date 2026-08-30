
<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits(['navigate'])

const loading = ref(true)

const looks = [
  {
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85',
    title: 'Form & Movement',
    number: '01',
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',
    title: 'Quiet Luxury',
    number: '02',
  },
  {
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    title: 'Natural Form',
    number: '03',
  },
  {
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=85',
    title: 'The Atelier',
    number: '04',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
    title: 'Modern Silhouette',
    number: '05',
  },
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85',
    title: 'Timeless',
    number: '06',
  },
]

onMounted(() => {
  loading.value = false

  gsap.from('.lookbook-page-header', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  })

  gsap.from('.lookbook-item', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    delay: 0.2,
    ease: 'power3.out',
  })
})
</script>

<template>
  <section class="min-h-screen bg-ink-950 px-6 md:px-12 py-32">
    <div class="max-w-[1600px] mx-auto">

      <!-- Header -->
      <div class="lookbook-page-header mb-20">

        <button
          @click="emit('navigate', 'home')"
          class="font-sans text-xs tracking-[0.2em] uppercase text-ink-500 hover:text-accent-400 mb-8"
        >
          ← Back to Store
        </button>

        <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-4">
          N° 03 — Editorial
        </p>

        <h1 class="font-display text-5xl md:text-7xl lg:text-8xl text-ink-50 leading-[0.9]">
          The
          <span class="italic font-light text-ink-400">
            Lookbook
          </span>
        </h1>

        <p class="font-serif text-lg text-ink-400 max-w-xl mt-8 leading-relaxed">
          A visual exploration of Maison — where architecture,
          fabric and movement become one.
        </p>
      </div>

      <!-- Gallery -->
      <div
        v-if="!loading"
        class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
      >
        <article
          v-for="(look, index) in looks"
          :key="look.number"
          class="lookbook-item group"
          :class="index % 2 === 1 ? 'md:mt-24' : ''"
        >
          <div class="relative aspect-[3/4] overflow-hidden bg-ink-900">

            <img
              :src="look.image"
              :alt="look.title"
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            <div class="absolute inset-0 bg-ink-950/10 group-hover:bg-transparent transition-all duration-500"></div>

            <div class="absolute top-5 left-5">
              <span class="font-sans text-xs tracking-[0.2em] text-ink-50 bg-ink-950/60 backdrop-blur-sm px-3 py-2">
                {{ look.number }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between mt-5">
            <h2 class="font-display text-2xl md:text-3xl text-ink-50">
              {{ look.title }}
            </h2>

            <span class="font-sans text-xs tracking-[0.2em] uppercase text-ink-500">
              Maison
            </span>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>


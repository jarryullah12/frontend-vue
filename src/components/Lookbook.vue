<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)

const looks = [
  {
    num: '01',
    title: 'The Sculptor',
    desc: 'Structured lines meet fluid draping in a study of architectural form.',
    image: 'https://images.pexels.com/photos/33626742/pexels-photo-33626742.jpeg?auto=compress&cs=tinysrgb&h=1100&w=750',
  },
  {
    num: '02',
    title: 'Crimson Hour',
    desc: 'Bold color as statement — a singular bow, a singular attitude.',
    image: 'https://images.pexels.com/photos/33976561/pexels-photo-33976561.jpeg?auto=compress&cs=tinysrgb&h=1100&w=750',
  },
  {
    num: '03',
    title: 'Berlin Noir',
    desc: 'Avant-garde tailoring from the underground, reimagined for daylight.',
    image: 'https://images.pexels.com/photos/29616258/pexels-photo-29616258.jpeg?auto=compress&cs=tinysrgb&h=1100&w=750',
  },
]

onMounted(() => {
  const ctx = gsap.context(() => {
    gsap.utils.toArray('.look-item').forEach((item, i) => {
      const isEven = i % 2 === 0
      const direction = isEven ? -1 : 1

      gsap.from(item.querySelector('.look-image-wrap'), {
        x: 120 * direction,
        opacity: 0,
        rotationY: 10 * direction,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
        },
      })

      gsap.from(item.querySelector('.look-text'), {
        x: -80 * direction,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
        },
      })

      gsap.to(item.querySelector('.look-image'), {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })

    gsap.from('.lookbook-header', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
      },
    })
  }, sectionRef.value)

  return () => ctx.revert()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <section id="lookbook" ref="sectionRef" class="py-24 md:py-40 bg-ink-900 relative overflow-hidden">
    <div class="max-w-[1600px] mx-auto px-6 md:px-12">
      <div class="lookbook-header text-center mb-20 md:mb-32">
        <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-4">N° 03 — Lookbook</p>
        <h2 class="font-display text-5xl md:text-7xl lg:text-8xl text-ink-50 leading-[0.9]">
          Three <span class="italic font-light text-ink-400">Studies</span>
        </h2>
      </div>

      <div class="flex flex-col gap-24 md:gap-40">
        <div
          v-for="(look, i) in looks"
          :key="i"
          class="look-item grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
          :class="i % 2 === 1 ? 'md:[direction:rtl]' : ''"
        >
          <div class="look-image-wrap relative aspect-[4/5] overflow-hidden bg-ink-950 [direction:ltr]">
            <img
              class="look-image absolute inset-0 w-full h-[120%] object-cover"
              :src="look.image"
              :alt="look.title"
            />
            <div class="absolute top-4 left-4 font-display text-6xl text-ink-50/30">{{ look.num }}</div>
          </div>
          <div class="look-text [direction:ltr]">
            <p class="font-display text-7xl md:text-8xl text-accent-500/20 mb-2">{{ look.num }}</p>
            <h3 class="font-display text-3xl md:text-5xl text-ink-50 mb-4">{{ look.title }}</h3>
            <p class="font-serif text-lg md:text-xl text-ink-300 leading-relaxed max-w-md">{{ look.desc }}</p>
            <a href="#" class="inline-flex items-center gap-3 mt-6 font-sans text-xs tracking-[0.2em] uppercase text-ink-50 border-b border-accent-500 pb-1 hover:text-accent-400 transition-colors cursor-hover">
              View Look
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

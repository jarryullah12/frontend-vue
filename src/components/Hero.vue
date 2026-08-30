<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref(null)

const images = [
  'https://images.pexels.com/photos/20194705/pexels-photo-20194705.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  'https://images.pexels.com/photos/20177238/pexels-photo-20177238.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  'https://images.pexels.com/photos/20231996/pexels-photo-20231996.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  'https://images.pexels.com/photos/20238956/pexels-photo-20238956.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  'https://images.pexels.com/photos/20238933/pexels-photo-20238933.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
]

/*
|--------------------------------------------------------------------------
| Scroll helper
|--------------------------------------------------------------------------
*/
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)

  if (!element) {
    console.warn(`Section #${sectionId} not found`)
    return
  }

  // Agar GSAP pin active hai to pehle refresh karein
  ScrollTrigger.refresh()

  // Thora delay taake pinned Hero properly release ho
  setTimeout(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, 50)
}

onMounted(() => {
  const ctx = gsap.context(() => {

    // --------------------------------------------------
    // Entrance animation
    // --------------------------------------------------
    const tl = gsap.timeline({
      delay: 0.5,
    })

    tl.from('.hero-eyebrow', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })

    .from(
      '.hero-sub',
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.5'
    )

    .from(
      '.hero-cta',
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      },
      '-=0.4'
    )

    .from(
      '.hero-side-text',
      {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.6'
    )

    .from(
      '.hero-image-wrap',
      {
        scale: 1.3,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
      },
      '-=1.2'
    )

    // --------------------------------------------------
    // Scroll pinned timeline
    // --------------------------------------------------
    const segs = images.length - 1

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: `+=${segs * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    // --------------------------------------------------
    // Image crossfades
    // --------------------------------------------------
    for (let i = 1; i < images.length; i++) {
      pinTl.fromTo(
        `.hero-image-${i}`,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
          ease: 'none',
        },
        i - 1
      )
    }

    // --------------------------------------------------
    // Image parallax
    // --------------------------------------------------
    pinTl.fromTo(
      '.hero-image-stack',
      {
        yPercent: 0,
      },
      {
        yPercent: 15,
        duration: segs,
        ease: 'none',
      },
      0
    )

    // --------------------------------------------------
    // Content fade
    // --------------------------------------------------
    pinTl.to(
      '.hero-content',
      {
        yPercent: -10,
        opacity: 0.2,
        duration: 1,
        ease: 'none',
      },
      segs - 1
    )

    // --------------------------------------------------
    // Progress dots
    // --------------------------------------------------
    gsap.utils.toArray('.hero-dot').forEach((dot, i) => {
      pinTl.fromTo(
        dot,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 1,
          ease: 'none',
        },
        i
      )
    })

  }, heroRef.value)

  // Refresh after images/layout are loaded
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 300)

  return () => ctx.revert()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <section
    ref="heroRef"
    class="relative h-screen min-h-[700px] w-full overflow-hidden bg-ink-950"
  >

    <!-- Background Images -->
    <div class="absolute inset-0 z-0">

      <div class="hero-image-wrap absolute inset-0 overflow-hidden">

        <div class="hero-image-stack absolute inset-0 w-full h-[115%]">

          <img
            v-for="(src, i) in images"
            :key="i"
            :class="[
              'hero-image',
              `hero-image-${i}`,
              'absolute inset-0 w-full h-full object-cover object-center',
              i === 0 ? '' : 'opacity-0'
            ]"
            :src="src"
            :alt="`Fashion editorial ${i + 1}`"
          />

        </div>

        <div
          class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/60"
        ></div>

      </div>
    </div>

    <!-- Image Progress Dots -->
    <div
      class="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3"
    >

      <div
        v-for="(img, i) in images"
        :key="i"
        class="w-px h-8 bg-ink-700 overflow-hidden"
      >
        <div
          class="hero-dot h-full bg-accent-500 origin-left scale-x-0"
        ></div>
      </div>

    </div>

    <!-- Hero Content -->
    <div
      class="relative z-10 h-full flex flex-col justify-between max-w-[1600px] mx-auto px-6 md:px-12 pt-28 pb-10"
    >

      <!-- Top Text -->
      <div class="hero-side-text flex items-center gap-4">

        <div class="w-12 h-px bg-accent-500"></div>

        <p
          class="font-sans text-xs tracking-[0.3em] uppercase text-ink-300"
        >
          Fall / Winter 2026
        </p>

      </div>

      <!-- Center Content -->
      <div
        class="hero-content flex-1 flex flex-col justify-center items-center text-center"
      >

        <p
          class="hero-eyebrow font-sans text-xs tracking-[0.4em] uppercase text-accent-400 mb-6"
        >
          The New Silhouette
        </p>

        <p
          class="hero-sub mt-8 font-serif text-lg md:text-xl text-ink-200 max-w-xl leading-relaxed text-balance"
        >
          A sculptural exploration of form, fabric, and the body — where every
          garment becomes a living silhouette.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mt-10">

          <!-- Explore Collection -->
          <button
            @click="scrollToSection('collections')"
            class="hero-cta group relative overflow-hidden px-8 py-4 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-hover"
          >
            <span class="relative z-10">
              Explore Collection
            </span>

            <div
              class="absolute inset-0 bg-ink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
            ></div>
          </button>

          <!-- View Lookbook -->
          <button
            @click="scrollToSection('lookbook')"
            class="hero-cta group relative overflow-hidden px-8 py-4 border border-ink-600 text-ink-50 font-sans text-xs tracking-[0.2em] uppercase cursor-hover"
          >
            <span
              class="relative z-10 group-hover:text-ink-950 transition-colors duration-400"
            >
              View Lookbook
            </span>

            <div
              class="absolute inset-0 bg-ink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
            ></div>
          </button>

        </div>
      </div>

      <!-- Bottom -->
      <div class="flex items-end justify-between">

        <!-- SCROLL BUTTON -->
        <button
          @click="scrollToSection('collections')"
          type="button"
          class="hero-side-text group flex items-center gap-3 cursor-pointer cursor-hover"
          aria-label="Scroll to collections"
        >

          <svg
            class="w-5 h-5 text-ink-400 group-hover:text-accent-400 animate-bounce transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>

          <span
            class="font-sans text-xs tracking-[0.2em] uppercase text-ink-400 group-hover:text-ink-50 transition-colors"
          >
            Scroll
          </span>

        </button>

        <!-- Edition -->
        <div class="hero-side-text hidden md:block text-right">

          <p class="font-serif italic text-ink-300 text-sm">
            N° 01 — Vol. XII
          </p>

        </div>

      </div>

    </div>

  </section>
</template>


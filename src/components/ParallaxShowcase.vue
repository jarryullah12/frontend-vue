<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const showcaseRef = ref(null)

const currentFrame = ref(0)

let scrollTrigger = null
let lastScrollProgress = 0

/*
|--------------------------------------------------------------------------
| FRAME IMAGES
|--------------------------------------------------------------------------
| IMPORTANT:
| Images public/frames/ folder mein hain.
| URL mein "public" nahi likhna hai.
|--------------------------------------------------------------------------
*/

const frames = [
  '/frames/frame1.jpg',
  '/frames/frame2.jpg',
  '/frames/frame3.jpg',
  '/frames/frame4.jpg',
  '/frames/frame5.jpg',
]

/*
|--------------------------------------------------------------------------
| Mouse Hover → ONE NEXT FRAME
|--------------------------------------------------------------------------
*/

const showNextFrame = () => {
  currentFrame.value =
    (currentFrame.value + 1) % frames.length
}

/*
|--------------------------------------------------------------------------
| Scroll To Section
|--------------------------------------------------------------------------
*/

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)

  if (!element) {
    console.warn(`Section #${sectionId} not found`)
    return
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

/*
|--------------------------------------------------------------------------
| Mounted
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await nextTick()

  /*
  |--------------------------------------------------------------------------
  | Check images
  |--------------------------------------------------------------------------
  */

  frames.forEach((src) => {
    const img = new Image()

    img.onload = () => {
      console.log('Image loaded:', src)
    }

    img.onerror = () => {
      console.error('Image NOT found:', src)
    }

    img.src = src
  })

  const ctx = gsap.context(() => {

    /*
    |--------------------------------------------------------------------------
    | Entrance Animation
    |--------------------------------------------------------------------------
    */

    const tl = gsap.timeline({
      delay: 0.3,
    })

    tl.from('.showcase-eyebrow', {
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })

      .from(
        '.showcase-title',
        {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.5'
      )

      .from(
        '.showcase-description',
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.6'
      )

      .from(
        '.showcase-cta',
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      )

    /*
    |--------------------------------------------------------------------------
    | Scroll → Change Frame
    |--------------------------------------------------------------------------
    */

    scrollTrigger = ScrollTrigger.create({
      trigger: showcaseRef.value,

      start: 'top top',

      end: '+=100%',

      pin: true,

      pinSpacing: true,

      scrub: false,

      anticipatePin: 1,

      onUpdate: (self) => {
        const progress = self.progress

        const frameIndex = Math.min(
          frames.length - 1,
          Math.floor(progress * frames.length)
        )

        if (frameIndex !== currentFrame.value) {
          currentFrame.value = frameIndex
        }

        lastScrollProgress = progress
      },
    })

  }, showcaseRef.value)

  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 500)

  return () => {
    ctx.revert()
  }
})

/*
|--------------------------------------------------------------------------
| Cleanup
|--------------------------------------------------------------------------
*/

onUnmounted(() => {
  if (scrollTrigger) {
    scrollTrigger.kill()
    scrollTrigger = null
  }

  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill()
  })
})
</script>

<template>

  <section
    ref="showcaseRef"
    class="relative h-screen min-h-[700px] w-full overflow-hidden bg-ink-950"
    @mouseenter="showNextFrame"
  >

    <!-- =====================================================
         BACKGROUND FRAMES
    ====================================================== -->

    <div class="absolute inset-0 z-0">

      <img
        v-for="(frame, index) in frames"
        :key="frame"
        :src="frame"
        :alt="`Maison editorial frame ${index + 1}`"
        class="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
        :class="
          currentFrame === index
            ? 'opacity-100'
            : 'opacity-0'
        "
        draggable="false"
      />

    </div>


    <!-- =====================================================
         CONTENT
    ====================================================== -->

    <div
      class="relative z-20 h-full flex items-center max-w-[1600px] mx-auto px-6 md:px-12"
    >

      <div class="w-full md:w-[52%] lg:w-[48%]">

        <p
          class="showcase-eyebrow font-sans text-xs tracking-[0.4em] uppercase text-accent-400 mb-6"
        >
          Maison / Philosophy
        </p>

        <h2
          class="showcase-title font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight text-ink-50"
        >
          Where Form
          <br />

          <span class="italic">
            Becomes Art
          </span>
        </h2>

        <p
          class="showcase-description mt-8 font-serif text-lg md:text-xl text-ink-100 max-w-xl leading-relaxed"
        >
          Every silhouette is an exploration of proportion,
          movement, and material — designed to exist beyond
          the ordinary.
        </p>

        <div class="mt-10">

          <button
            @click.stop="scrollToSection('lookbook')"
            class="showcase-cta group relative overflow-hidden px-8 py-4 border border-ink-300 text-ink-50 font-sans text-xs tracking-[0.2em] uppercase"
          >

            <span
              class="relative z-10 group-hover:text-ink-950 transition-colors duration-400"
            >
              Discover The Lookbook
            </span>

            <div
              class="absolute inset-0 bg-ink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
            ></div>

          </button>

        </div>

      </div>

    </div>


    <!-- =====================================================
         FRAME INDICATOR
    ====================================================== -->

    <div
      class="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3"
    >

      <div
        v-for="(frame, index) in frames"
        :key="index"
        class="w-px h-8 bg-ink-700/70 overflow-hidden"
      >

        <div
          class="w-full bg-accent-500 transition-all duration-300"
          :class="
            currentFrame === index
              ? 'h-full opacity-100'
              : 'h-0 opacity-40'
          "
        ></div>

      </div>

    </div>


    <!-- =====================================================
         SCROLL
    ====================================================== -->

    <button
      @click.stop="scrollToSection('lookbook')"
      type="button"
      class="absolute bottom-10 left-6 md:left-12 z-30 flex items-center gap-3 cursor-pointer"
      aria-label="Scroll to lookbook"
    >

      <svg
        class="w-5 h-5 text-ink-200 animate-bounce"
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
        class="font-sans text-xs tracking-[0.2em] uppercase text-ink-200"
      >
        Scroll
      </span>

    </button>


    <!-- =====================================================
         EDITION
    ====================================================== -->

    <div
      class="absolute bottom-10 right-6 md:right-12 z-30 hidden md:block"
    >

      <p
        class="font-serif italic text-ink-300 text-sm"
      >
        N° 02 — Maison
      </p>

    </div>

  </section>

</template>
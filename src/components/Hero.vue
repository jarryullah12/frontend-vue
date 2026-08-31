```vue
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref(null)
const videoRef = ref(null)

const currentFrame = ref(0)
const totalFrames = 5

let hoverTimer = null
let isHovering = false
let scrollTriggerInstance = null

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
| Mouse Hover → Next Video Scene
|--------------------------------------------------------------------------
*/

const showNextFrame = () => {
  const video = videoRef.value

  if (!video) return

  if (!video.duration || !isFinite(video.duration)) {
    return
  }

  currentFrame.value += 1

  if (currentFrame.value >= totalFrames) {
    currentFrame.value = 0
  }

  const progress = currentFrame.value / totalFrames

  video.currentTime = video.duration * progress
}

const startHoverAnimation = () => {
  if (isHovering) return

  isHovering = true

  // Immediately show next scene
  showNextFrame()

  // Continue changing scenes while mouse is over hero
  hoverTimer = setInterval(() => {
    if (isHovering) {
      showNextFrame()
    }
  }, 900)
}

const stopHoverAnimation = () => {
  isHovering = false

  if (hoverTimer) {
    clearInterval(hoverTimer)
    hoverTimer = null
  }
}

/*
|--------------------------------------------------------------------------
| Video Ready
|--------------------------------------------------------------------------
*/

const handleVideoLoaded = () => {
  const video = videoRef.value

  if (!video) return

  video.currentTime = 0
  currentFrame.value = 0
}

/*
|--------------------------------------------------------------------------
| Mounted
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await nextTick()

  const video = videoRef.value

  if (video) {
    video.addEventListener(
      'loadedmetadata',
      handleVideoLoaded
    )
  }

  const ctx = gsap.context(() => {

    /*
    |--------------------------------------------------------------------------
    | Entrance Animation
    |--------------------------------------------------------------------------
    */

    const tl = gsap.timeline({
      delay: 0.3,
    })

    tl.from('.hero-eyebrow', {
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })

      .from(
        '.hero-sub',
        {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5'
      )

      .from(
        '.hero-cta',
        {
          x: -20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.4'
      )

    /*
    |--------------------------------------------------------------------------
    | Scroll Controlled Video
    |--------------------------------------------------------------------------
    */

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: heroRef.value,

      start: 'top top',

      end: '+=100%',

      pin: true,

      pinSpacing: true,

      scrub: 1,

      anticipatePin: 1,

      onUpdate: (self) => {
        const video = videoRef.value

        if (!video) return

        if (
          video.duration &&
          isFinite(video.duration)
        ) {
          video.currentTime =
            video.duration * self.progress
        }
      },
    })

  }, heroRef.value)

  /*
  |--------------------------------------------------------------------------
  | Refresh ScrollTrigger
  |--------------------------------------------------------------------------
  */

  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 500)

  /*
  |--------------------------------------------------------------------------
  | Cleanup
  |--------------------------------------------------------------------------
  */

  return () => {
    ctx.revert()
  }
})

/*
|--------------------------------------------------------------------------
| Unmounted
|--------------------------------------------------------------------------
*/

onUnmounted(() => {
  stopHoverAnimation()

  const video = videoRef.value

  if (video) {
    video.removeEventListener(
      'loadedmetadata',
      handleVideoLoaded
    )
  }

  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
  }
})
</script>

<template>
  <section
    ref="heroRef"
    class="relative h-screen min-h-[700px] w-full overflow-hidden bg-ink-950"
    @mouseenter="startHoverAnimation"
    @mouseleave="stopHoverAnimation"
  >

    <!--
    |--------------------------------------------------------------------------
    | Full Screen Video
    |--------------------------------------------------------------------------
    -->

    <div class="absolute inset-0 z-0">

      <video
        ref="videoRef"
        class="absolute inset-0 w-full h-full object-cover"
        src="/video-frames/video.mp4"
        muted
        playsinline
        preload="auto"
      ></video>

    </div>


    <!--
    |--------------------------------------------------------------------------
    | Hero Content - LEFT SIDE
    |--------------------------------------------------------------------------
    -->

    <div
      class="relative z-10 h-full flex items-center justify-start max-w-[1600px] mx-auto px-6 md:px-12"
    >

      <div
        class="hero-content w-full md:w-[48%] lg:w-[42%] text-left"
      >

        <!-- Eyebrow -->

        <p
          class="hero-eyebrow font-sans text-xs tracking-[0.4em] uppercase text-accent-400 mb-6"
        >
          The New Silhouette
        </p>


        <!-- Description -->

        <p
          class="hero-sub font-serif text-lg md:text-xl text-ink-100 max-w-xl leading-relaxed"
        >
          A sculptural exploration of form, fabric, and the body —
          where every garment becomes a living silhouette.
        </p>


        <!--
        |--------------------------------------------------------------------------
        | CTA Buttons
        |--------------------------------------------------------------------------
        -->

        <div
          class="flex flex-col sm:flex-row justify-start gap-4 mt-10"
        >

          <!-- Explore Collection -->

          <button
            @click.stop="scrollToSection('collections')"
            type="button"
            class="hero-cta group relative overflow-hidden px-8 py-4 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-pointer"
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
            @click.stop="scrollToSection('lookbook')"
            type="button"
            class="hero-cta group relative overflow-hidden px-8 py-4 border border-ink-300 text-ink-50 font-sans text-xs tracking-[0.2em] uppercase cursor-pointer"
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

    </div>


    <!--
    |--------------------------------------------------------------------------
    | Scroll Indicator
    |--------------------------------------------------------------------------
    -->

    <button
      @click.stop="scrollToSection('collections')"
      type="button"
      class="absolute bottom-10 left-6 md:left-12 z-20 flex items-center gap-3 cursor-pointer"
      aria-label="Scroll to collections"
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

  </section>
</template>
```

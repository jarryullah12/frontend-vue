<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const email = ref('')
const submitted = ref(false)

const handleSubmit = () => {
  if (email.value && email.value.includes('@')) {
    submitted.value = true
  }
}

onMounted(() => {
  const ctx = gsap.context(() => {
    gsap.from('.nl-content', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 75%',
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
  <section id="editorial" ref="sectionRef" class="relative py-32 md:py-48 overflow-hidden bg-ink-900">
    <div class="absolute inset-0 z-0 opacity-20">
      <img
        class="w-full h-full object-cover"
        src="https://images.pexels.com/photos/1343524/pexels-photo-1343524.jpeg?auto=compress&cs=tinysrgb&h=800&w=1600"
        alt=""
      />
      <div class="absolute inset-0 bg-ink-950/60"></div>
    </div>

    <div class="relative z-10 max-w-3xl mx-auto px-6 text-center">
      <div class="nl-content">
        <p class="font-sans text-xs tracking-[0.4em] uppercase text-accent-500 mb-6">N° 05 — Join Maison</p>
        <h2 class="font-display text-4xl md:text-6xl lg:text-7xl text-ink-50 leading-[0.95] mb-6">
          Become Part of the<br />
          <span class="italic font-light text-accent-400">Inner Circle</span>
        </h2>
        <p class="font-serif text-lg md:text-xl text-ink-300 max-w-lg mx-auto mb-10 leading-relaxed">
          Private previews, atelier stories, and early access to limited editions — delivered to your inbox.
        </p>

        <transition
          enter-active-class="transition-all duration-500 ease-out"
          leave-active-class="transition-all duration-300 ease-in"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
          mode="out-in"
        >
          <form v-if="!submitted" @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              v-model="email"
              type="email"
              required
              placeholder="your@email.com"
              class="flex-1 bg-ink-950/60 backdrop-blur-sm border border-ink-700 text-ink-50 font-sans text-sm px-5 py-4 focus:outline-none focus:border-accent-500 transition-colors placeholder:text-ink-500"
            />
            <button
              type="submit"
              class="group relative overflow-hidden px-8 py-4 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-hover whitespace-nowrap"
            >
              <span class="relative z-10">Subscribe</span>
              <div class="absolute inset-0 bg-ink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-400"></div>
            </button>
          </form>

          <div v-else class="max-w-lg mx-auto">
            <p class="font-display text-2xl md:text-3xl text-ink-50 mb-2">Welcome to the Inner Circle.</p>
            <p class="font-serif text-ink-400">Check your inbox for a confirmation.</p>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const sectionRef = ref(null)

onMounted(() => {
  gsap.from(sectionRef.value, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  })
})
</script>

<template>
  <section
    id="newsletter"
    ref="sectionRef"
    class="py-24 md:py-40 bg-ink-950 border-t border-ink-800"
  >
    <div class="max-w-[1200px] mx-auto px-6 md:px-12 text-center">

      <p
        class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-5"
      >
        N° 05 — Join Maison
      </p>

      <h2
        class="font-display text-5xl md:text-7xl text-ink-50 leading-[0.9]"
      >
        Enter the
        <span class="italic font-light text-ink-400">
          Maison
        </span>
      </h2>

      <p
        class="font-serif text-lg text-ink-400 max-w-xl mx-auto mt-6 leading-relaxed"
      >
        Discover new collections, atelier stories, and the latest Maison
        releases.
      </p>

    </div>
  </section>
</template>

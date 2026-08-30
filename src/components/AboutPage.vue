<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['navigate'])

const sectionRef = ref(null)

onMounted(() => {
  const ctx = gsap.context(() => {
    gsap.from('.about-hero', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })

    gsap.from('.about-content', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 80%',
      },
    })

    gsap.utils.toArray('.about-card').forEach((card, i) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
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
  <section
    ref="sectionRef"
    class="min-h-screen bg-ink-950 text-ink-50"
  >
    <!-- Hero -->
    <div class="about-hero max-w-[1600px] mx-auto px-6 md:px-12 pt-32 md:pt-44 pb-24">
      <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-5">
        N° 05 — About Maison
      </p>

      <h1 class="font-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.82]">
        Fashion as
        <br />
        <span class="italic font-light text-ink-400">
          Living Sculpture.
        </span>
      </h1>
    </div>

    <!-- Main Story -->
    <div class="about-content max-w-[1200px] mx-auto px-6 md:px-12 pb-32">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <div>
          <p class="font-sans text-xs tracking-[0.25em] uppercase text-accent-500 mb-5">
            Our Story
          </p>

          <h2 class="font-display text-4xl md:text-5xl text-ink-50 leading-tight">
            Designed with
            <span class="italic font-light text-ink-400">
              intention.
            </span>
          </h2>
        </div>

        <div class="space-y-6">
          <p class="font-serif text-lg md:text-xl text-ink-300 leading-relaxed">
            Maison was founded in 2014 with a simple idea: clothing should
            feel as meaningful as the spaces we live in.
          </p>

          <p class="font-serif text-base text-ink-400 leading-relaxed">
            We create considered pieces that balance form, function and
            timeless elegance. Every silhouette is carefully developed,
            every material thoughtfully selected, and every detail given
            room to speak.
          </p>

          <p class="font-serif text-base text-ink-400 leading-relaxed">
            From our atelier to your wardrobe, Maison represents a slower,
            more intentional approach to fashion.
          </p>
        </div>
      </div>
    </div>

    <!-- Values -->
    <div class="border-y border-ink-800">
      <div class="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">

          <div class="about-card border border-ink-800 p-8 md:p-10">
            <span class="font-display text-4xl text-accent-400">
              01
            </span>

            <h3 class="font-display text-2xl text-ink-50 mt-8 mb-4">
              Craft
            </h3>

            <p class="font-serif text-ink-400 leading-relaxed">
              We believe great design begins with exceptional craftsmanship.
              Each Maison piece is made with patience and precision.
            </p>
          </div>

          <div class="about-card border border-ink-800 p-8 md:p-10">
            <span class="font-display text-4xl text-accent-400">
              02
            </span>

            <h3 class="font-display text-2xl text-ink-50 mt-8 mb-4">
              Material
            </h3>

            <p class="font-serif text-ink-400 leading-relaxed">
              Natural fibers, thoughtful textures and carefully selected
              materials form the foundation of our collections.
            </p>
          </div>

          <div class="about-card border border-ink-800 p-8 md:p-10">
            <span class="font-display text-4xl text-accent-400">
              03
            </span>

            <h3 class="font-display text-2xl text-ink-50 mt-8 mb-4">
              Longevity
            </h3>

            <p class="font-serif text-ink-400 leading-relaxed">
              We design beyond seasons. Our pieces are created to become
              lasting parts of your wardrobe.
            </p>
          </div>

        </div>
      </div>
    </div>

    <!-- Atelier -->
    <div class="max-w-[1200px] mx-auto px-6 md:px-12 py-32">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div>
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-5">
            The Atelier
          </p>

          <h2 class="font-display text-5xl md:text-6xl text-ink-50 leading-[0.9]">
            Made by
            <span class="italic font-light text-ink-400">
              hand.
            </span>
          </h2>
        </div>

        <div>
          <p class="font-serif text-lg text-ink-300 leading-relaxed">
            Our atelier brings together traditional techniques and modern
            design. Every garment passes through skilled hands before it
            reaches yours.
          </p>

          <button
            @click="emit('navigate', 'home')"
            class="mt-8 font-sans text-xs tracking-[0.2em] uppercase text-accent-400 border-b border-accent-500 pb-2 cursor-hover"
          >
            Explore Collection →
          </button>
        </div>

      </div>
    </div>
  </section>
</template>
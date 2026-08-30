<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits(['complete'])

const counter = ref(0)
let tl

onMounted(() => {
  tl = gsap.timeline({
    onComplete: () => {
      emit('complete')
    },
  })

  tl.to(counter, {
    value: 100,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      counter.value = Math.round(counter.value)
    },
  })
  .to('.loader-content', {
    y: -60,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.inOut',
  }, '+=0.2')
  .to('.loader-overlay', {
    y: '-100%',
    duration: 0.7,
    ease: 'power4.inOut',
  }, '-=0.2')
  .to('.loader-bar', {
    scaleX: 0,
    duration: 0.4,
    ease: 'power3.inOut',
  }, '<')
})

onUnmounted(() => {
  if (tl) tl.kill()
})
</script>

<template>
  <div class="loader-overlay fixed inset-0 z-[100] bg-ink-950 flex flex-col items-center justify-center">
    <div class="loader-content flex flex-col items-center gap-6">
      <p class="font-display text-5xl md:text-7xl tracking-wider text-ink-50">{{ String(counter).padStart(3, '0') }}</p>
      <div class="w-48 h-px bg-ink-700 overflow-hidden">
        <div class="loader-bar h-full bg-accent-500 origin-left scale-x-100"></div>
      </div>
      <p class="font-sans text-xs tracking-[0.3em] text-ink-400 uppercase">Maison — FW 26</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dotX = ref(0)
const dotY = ref(0)
const ringX = ref(0)
const ringY = ref(0)
const hovering = ref(false)
const visible = ref(false)

let rafId
let mouseX = 0
let mouseY = 0

const animate = () => {
  dotX.value = mouseX
  dotY.value = mouseY
  ringX.value += (mouseX - ringX.value) * 0.15
  ringY.value += (mouseY - ringY.value) * 0.15
  rafId = requestAnimationFrame(animate)
}

const onMouseMove = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  if (!visible.value) visible.value = true
}

const onMouseOver = (e) => {
  const interactive = e.target.closest('a, button, .cursor-hover')
  hovering.value = !!interactive
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseover', onMouseOver)
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseover', onMouseOver)
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
    class="fixed top-0 left-0 z-[90] pointer-events-none hidden md:block"
    :style="{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }"
  >
    <div
      class="fixed top-0 left-0 w-1.5 h-1.5 bg-accent-500 rounded-full -translate-x-1/2 -translate-y-1/2"
      :style="{ transform: `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)` }"
    ></div>
    <div
      class="fixed top-0 left-0 rounded-full border border-ink-400 -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-300"
      :style="{
        transform: `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`,
        width: hovering ? '48px' : '28px',
        height: hovering ? '48px' : '28px',
        borderColor: hovering ? '#d06a30' : '#969080',
      }"
    ></div>
  </div>
</template>

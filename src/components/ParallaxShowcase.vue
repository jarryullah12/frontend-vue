<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)

onMounted(() => {
  const ctx = gsap.context(() => {
    const layers = gsap.utils.toArray('.ps-layer')

    layers.forEach((layer, i) => {
      const depth = parseFloat(layer.dataset.depth || '0.2')
      gsap.to(layer, {
        yPercent: -depth * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })

    gsap.to('.ps-rotate', {
      rotation: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    })

    gsap.from('.ps-text-line', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.ps-text-block',
        start: 'top 80%',
      },
    })

    gsap.from('.ps-image', {
      scale: 1.4,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 70%',
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
  <section ref="sectionRef" class="relative h-[120vh] min-h-[800px] overflow-hidden bg-ink-950">
    <div class="absolute inset-0 z-0 overflow-hidden">
      <img
        class="ps-image ps-layer absolute inset-0 w-full h-[130%] object-cover"
        src="https://images.pexels.com/photos/262039/pexels-photo-262039.jpeg?auto=compress&cs=tinysrgb&h=1400&w=2000"
        alt="Runway show"
        data-depth="0.15"
      />
      <div class="absolute inset-0 bg-ink-950/50"></div>
    </div>

    <div class="ps-layer absolute top-[15%] left-[5%] md:left-[10%] z-10" data-depth="0.4">
      <div class="ps-rotate w-20 h-20 md:w-32 md:h-32 border border-accent-500/40 rounded-full flex items-center justify-center">
        <p class="font-sans text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-accent-400 text-center leading-tight">Atelier<br/>Maison<br/>FW26</p>
      </div>
    </div>

    <div class="ps-layer absolute bottom-[10%] right-[5%] md:right-[10%] z-10" data-depth="0.3">
      <div class="font-display text-[15vw] md:text-[12vw] text-ink-50/10 leading-none">FW26</div>
    </div>

    <div class="relative z-20 h-full flex items-center justify-center">
      <div class="ps-text-block text-center px-6">
        <p class="ps-text-line font-sans text-xs tracking-[0.4em] uppercase text-accent-400 mb-6">The Runway</p>
        <h2 class="ps-text-line font-display text-6xl md:text-8xl lg:text-9xl text-ink-50 leading-[0.9] mb-4">
          Where Form
        </h2>
        <h2 class="ps-text-line font-display italic font-light text-6xl md:text-8xl lg:text-9xl text-accent-400 leading-[0.9]">
          Becomes Art
        </h2>
        <p class="ps-text-line mt-8 font-serif text-lg md:text-xl text-ink-200 max-w-xl mx-auto leading-relaxed">
          Experience the runway — a choreography of silhouette, shadow, and movement.
        </p>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink-950 to-transparent z-20"></div>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NavBar from './components/NavBar.vue'
import Hero from './components/Hero.vue'
import Marquee from './components/Marquee.vue'
import Collection from './components/Collection.vue'
import Lookbook from './components/Lookbook.vue'
import ParallaxShowcase from './components/ParallaxShowcase.vue'
import Accessories from './components/Accessories.vue'
import Newsletter from './components/Newsletter.vue'
import Footer from './components/Footer.vue'
import CustomCursor from './components/CustomCursor.vue'
import Loader from './components/Loader.vue'
import CartDrawer from './components/CartDrawer.vue'
import AuthPage from './components/AuthPage.vue'
import AccountPage from './components/AccountPage.vue'
import AdminPanel from './components/AdminPanel.vue'
import { useAuth } from './composables/useAuth'

gsap.registerPlugin(ScrollTrigger)

const { init, loading: authLoading, isAuthenticated, isAdmin } = useAuth()

const loading = ref(true)
const view = ref('home')
const loaderDone = ref(false)

const onLoaderComplete = () => {
  loading.value = false
  loaderDone.value = true
  nextTick(() => {
    ScrollTrigger.refresh()
  })
}

const navigate = (v) => {
  if (v === 'admin' && !isAdmin.value) {
    v = 'auth'
  }
  if (v === 'account' && !isAuthenticated.value) {
    v = 'auth'
  }
  view.value = v
  window.scrollTo({ top: 0, behavior: 'instant' })
  nextTick(() => {
    ScrollTrigger.refresh()
  })
}

watch(view, () => {
  nextTick(() => {
    ScrollTrigger.refresh()
  })
})

onMounted(() => {
  init()
})
</script>

<template>
  <div class="relative bg-ink-950 min-h-screen overflow-x-hidden">
    <NavBar @navigate="navigate" />

    <AuthPage v-if="view === 'auth'" @navigate="navigate" />

    <AccountPage v-else-if="view === 'account' && isAuthenticated" @navigate="navigate" />

    <AdminPanel v-else-if="view === 'admin' && isAdmin" @navigate="navigate" />

    <main v-else>
      <CustomCursor />
      <Hero />
      <Marquee />
      <Collection />
      <Lookbook />
      <ParallaxShowcase />
      <Accessories />
      <Newsletter />
    </main>

    <Footer />
    <CartDrawer />
    <Loader v-if="loading" @complete="onLoaderComplete" />
  </div>
</template>

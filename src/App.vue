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

import AboutPage from './components/AboutPage.vue'
import ContactPage from './components/ContactPage.vue'
import CollectionsPage from './components/CollectionsPage.vue'
import LookbookPage from './components/LookbookPage.vue'
import AccessoriesPage from './components/AccessoriesPage.vue'

import { useAuth } from './composables/useAuth'

gsap.registerPlugin(ScrollTrigger)

const {
  init,
  isAuthenticated,
  isAdmin,
} = useAuth()

const loading = ref(true)
const view = ref('home')

const onLoaderComplete = () => {
  loading.value = false

  nextTick(() => {
    ScrollTrigger.refresh()
  })
}

const navigate = (target) => {
  // =========================
  // Admin Panel Protection
  // =========================
  if (target === 'admin') {
    if (!isAuthenticated.value || !isAdmin.value) {
      view.value = 'auth'
      return
    }
  }

  // =========================
  // Account Protection
  // =========================
  if (target === 'account') {
    if (!isAuthenticated.value) {
      view.value = 'auth'
      return
    }
  }

  // =========================
  // Change View
  // =========================
  view.value = target

  // Scroll page to top
  window.scrollTo({
    top: 0,
    behavior: 'instant',
  })

  nextTick(() => {
    ScrollTrigger.refresh()
  })
}

// Refresh ScrollTrigger whenever page/view changes
watch(view, () => {
  nextTick(() => {
    ScrollTrigger.refresh()
  })
})

onMounted(async () => {
  await init()

  nextTick(() => {
    ScrollTrigger.refresh()
  })
})
</script>

<template>
  <div
    class="relative bg-ink-950 min-h-screen overflow-x-hidden"
  >

    <!-- =========================
         NAVIGATION
         Hidden on Auth Page
    ========================== -->
    <NavBar
      v-if="view !== 'auth'"
      @navigate="navigate"
    />

    <!-- =========================
         AUTH PAGE
         No Header / No Footer
    ========================== -->
    <AuthPage
      v-if="view === 'auth'"
      @navigate="navigate"
    />

    <!-- =========================
         ABOUT PAGE
    ========================== -->
    <AboutPage
      v-else-if="view === 'about'"
      @navigate="navigate"
    />

    <!-- =========================
         CONTACT PAGE
    ========================== -->
    <ContactPage
      v-else-if="view === 'contact'"
      @navigate="navigate"
    />

    <!-- =========================
         COLLECTIONS PAGE
    ========================== -->
    <CollectionsPage
      v-else-if="view === 'collections'"
      @navigate="navigate"
    />

    <!-- =========================
         LOOKBOOK PAGE
    ========================== -->
    <LookbookPage
      v-else-if="view === 'lookbook'"
      @navigate="navigate"
    />

    <!-- =========================
         ACCESSORIES PAGE
    ========================== -->
    <AccessoriesPage
      v-else-if="view === 'accessories'"
      @navigate="navigate"
    />

    <!-- =========================
         ACCOUNT PAGE
    ========================== -->
    <AccountPage
      v-else-if="view === 'account' && isAuthenticated"
      @navigate="navigate"
    />

    <!-- =========================
         ADMIN PANEL
    ========================== -->
    <AdminPanel
      v-else-if="view === 'admin' && isAuthenticated && isAdmin"
      @navigate="navigate"
    />

    <!-- =========================
         HOME PAGE
    ========================== -->
    <main v-else>

      <!-- Custom Cursor -->
      <CustomCursor />

      <!-- 1. Hero -->
      <Hero />

      <!-- 2. Marquee -->
      <Marquee />

      <!-- 3. Signature Pieces -->
      <Collection />

      <!-- 4. Where Form Becomes Art -->
      <ParallaxShowcase />

      <!-- 5. Lookbook -->
      <Lookbook />

      <!-- 6. Accessories -->
      <Accessories />

      <!-- 7. Newsletter -->
      <Newsletter />

    </main>

    <!-- =========================
         FOOTER
         Hidden on Auth Page
    ========================== -->
    <Footer
      v-if="view !== 'auth'"
      @navigate="navigate"
    />

    <!-- =========================
         CART
    ========================== -->
    <CartDrawer />

    <!-- =========================
         LOADER
    ========================== -->
    <Loader
      v-if="loading"
      @complete="onLoaderComplete"
    />

  </div>
</template>
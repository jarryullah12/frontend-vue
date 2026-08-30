<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['navigate'])

const { count, open } = useCart()
const { profile, isAdmin, isAuthenticated } = useAuth()

const scrolled = ref(false)
const menuOpen = ref(false)

const onScroll = () => {
  scrolled.value = window.scrollY > 80
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)

  gsap.from('.nav-item', {
    y: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 0.3,
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const go = (view) => {
  menuOpen.value = false
  emit('navigate', view)
}

const goHomeSection = (section) => {
  menuOpen.value = false

  // Home page par jao
  emit('navigate', 'home')

  // Home render hone ke baad section par scroll
  setTimeout(() => {
    const element = document.getElementById(section)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, 200)
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="
      scrolled
        ? 'bg-ink-950/85 backdrop-blur-md border-b border-ink-800 py-3'
        : 'py-6'
    "
  >
    <nav
      class="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between"
    >
      <!-- Logo -->
      <button
        @click="go('home')"
        class="nav-item font-display text-2xl md:text-3xl tracking-[0.15em] text-ink-50 cursor-hover"
      >
        MAISON
      </button>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8 lg:gap-10">

        <!-- Collections -->
        <button
          @click="goHomeSection('collections')"
          class="nav-item font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-ink-50 transition-colors duration-300 relative group cursor-hover"
        >
          Collections
          <span
            class="absolute -bottom-1 left-0 w-0 h-px bg-accent-500 group-hover:w-full transition-all duration-400"
          ></span>
        </button>

        <!-- Lookbook -->
        <button
          @click="goHomeSection('lookbook')"
          class="nav-item font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-ink-50 transition-colors duration-300 relative group cursor-hover"
        >
          Lookbook
          <span
            class="absolute -bottom-1 left-0 w-0 h-px bg-accent-500 group-hover:w-full transition-all duration-400"
          ></span>
        </button>

        <!-- Accessories -->
        <button
          @click="goHomeSection('accessories')"
          class="nav-item font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-ink-50 transition-colors duration-300 relative group cursor-hover"
        >
          Accessories
          <span
            class="absolute -bottom-1 left-0 w-0 h-px bg-accent-500 group-hover:w-full transition-all duration-400"
          ></span>
        </button>

        <!-- About -->
        <button
          @click="go('about')"
          class="nav-item font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-ink-50 transition-colors duration-300 relative group cursor-hover"
        >
          About
          <span
            class="absolute -bottom-1 left-0 w-0 h-px bg-accent-500 group-hover:w-full transition-all duration-400"
          ></span>
        </button>

        <!-- Contact -->
        <button
          @click="go('contact')"
          class="nav-item font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-ink-50 transition-colors duration-300 relative group cursor-hover"
        >
          Contact
          <span
            class="absolute -bottom-1 left-0 w-0 h-px bg-accent-500 group-hover:w-full transition-all duration-400"
          ></span>
        </button>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-5">

        <!-- Sign In -->
        <button
          v-if="!isAuthenticated"
          @click="go('auth')"
          class="nav-item hidden md:flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-ink-50 transition-colors cursor-hover"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7 7z"
            />
          </svg>
          Sign In
        </button>

        <!-- Account -->
        <button
          v-else
          @click="go('account')"
          class="nav-item hidden md:flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-ink-50 transition-colors cursor-hover"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7 7z"
            />
          </svg>
          {{ profile?.full_name || 'Account' }}
        </button>

        <!-- Admin -->
        <button
          v-if="isAuthenticated && isAdmin"
          @click="go('admin')"
          class="nav-item hidden md:flex font-sans text-xs tracking-[0.2em] uppercase text-accent-400 hover:text-accent-300 transition-colors cursor-hover"
        >
          Admin
        </button>

        <!-- Cart -->
        <button
          @click="open"
          class="nav-item flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-ink-300 hover:text-ink-50 transition-colors cursor-hover"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 5.2A1 1 0 005.6 20h12.8M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          Cart ({{ count }})
        </button>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMenu"
          class="md:hidden text-ink-50 cursor-hover"
          aria-label="Toggle menu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!menuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 6h16M4 12h16M4 18h16"
            />

            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-400 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="menuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-ink-950/95 backdrop-blur-md border-b border-ink-800"
      >
        <div class="flex flex-col px-6 py-8 gap-6">

          <!-- Collections -->
          <button
            @click="goHomeSection('collections')"
            class="font-display text-3xl text-ink-50 hover:text-accent-500 transition-colors text-left"
          >
            Collections
          </button>

          <!-- Lookbook -->
          <button
            @click="goHomeSection('lookbook')"
            class="font-display text-3xl text-ink-50 hover:text-accent-500 transition-colors text-left"
          >
            Lookbook
          </button>

          <!-- Accessories -->
          <button
            @click="goHomeSection('accessories')"
            class="font-display text-3xl text-ink-50 hover:text-accent-500 transition-colors text-left"
          >
            Accessories
          </button>

          <!-- About -->
          <button
            @click="go('about')"
            class="font-display text-3xl text-ink-50 hover:text-accent-500 transition-colors text-left"
          >
            About
          </button>

          <!-- Contact -->
          <button
            @click="go('contact')"
            class="font-display text-3xl text-ink-50 hover:text-accent-500 transition-colors text-left"
          >
            Contact
          </button>

          <!-- Account -->
          <div class="border-t border-ink-800 pt-6 flex flex-col gap-4">

            <!-- Sign In -->
            <button
              v-if="!isAuthenticated"
              @click="go('auth')"
              class="font-sans text-sm tracking-[0.2em] uppercase text-ink-300 text-left cursor-hover"
            >
              Sign In
            </button>

            <!-- My Account -->
            <button
              v-else
              @click="go('account')"
              class="font-sans text-sm tracking-[0.2em] uppercase text-ink-300 text-left cursor-hover"
            >
              My Account
            </button>

            <!-- Admin Panel -->
            <button
              v-if="isAuthenticated && isAdmin"
              @click="go('admin')"
              class="font-sans text-sm tracking-[0.2em] uppercase text-accent-400 text-left cursor-hover"
            >
              Admin Panel
            </button>

            <!-- Cart -->
            <button
              @click="open(); menuOpen = false"
              class="font-sans text-sm tracking-[0.2em] uppercase text-ink-300 text-left cursor-hover"
            >
              Cart ({{ count }})
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>


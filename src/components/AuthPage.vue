
<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['navigate'])

const { signIn, signUp, user, profile, isAuthenticated } = useAuth()

const mode = ref('login')
const email = ref('')
const password = ref('')
const fullName = ref('')
const error = ref('')
const loading = ref(false)

const isAdmin = computed(() => {
  return profile.value?.is_admin === true
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    if (mode.value === 'login') {
      await signIn(email.value, password.value)

      // Admin login ke baad directly Admin Panel
      if (isAdmin.value) {
        emit('navigate', 'admin')
      } else {
        emit('navigate', 'home')
      }
    } else {
      await signUp(email.value, password.value, fullName.value)
      emit('navigate', 'home')
    }
  } catch (e) {
    error.value = e.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}

const switchMode = () => {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  error.value = ''
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-ink-950 px-6 py-28">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-12">
        <button
          @click="emit('navigate', 'home')"
          class="font-display text-3xl tracking-[0.15em] text-ink-50 cursor-hover"
        >
          MAISON
        </button>

        <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-400 mt-4">
          {{ mode === 'login' ? 'Welcome Back' : 'Create Account' }}
        </p>
      </div>

      <!-- Login / Signup -->
      <form @submit.prevent="handleSubmit" class="space-y-5">

        <!-- Full Name -->
        <div v-if="mode === 'signup'">
          <label
            class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
          >
            Full Name
          </label>

          <input
            v-model="fullName"
            type="text"
            required
            class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-accent-500 transition-colors"
          />
        </div>

        <!-- Email -->
        <div>
          <label
            class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
          >
            Email
          </label>

          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-accent-500 transition-colors"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
          >
            Password
          </label>

          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            autocomplete="current-password"
            class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-accent-500 transition-colors"
          />
        </div>

        <!-- Error -->
        <p
          v-if="error"
          class="font-sans text-sm text-red-400"
        >
          {{ error }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full group relative overflow-hidden py-4 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-hover disabled:opacity-50"
        >
          <span class="relative z-10">
            {{
              loading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'
            }}
          </span>

          <div
            class="absolute inset-0 bg-ink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
          ></div>
        </button>
      </form>

      <!-- Switch Login / Signup -->
      <p class="text-center mt-8 font-sans text-sm text-ink-400">
        {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}

        <button
          @click="switchMode"
          class="text-accent-400 hover:text-accent-300 transition-colors cursor-hover ml-1"
        >
          {{ mode === 'login' ? 'Sign Up' : 'Sign In' }}
        </button>
      </p>

      <!-- ADMIN PANEL LINK -->
      <div
        v-if="mode === 'login'"
        class="mt-8 pt-6 border-t border-ink-800 text-center"
      >
      
      </div>

      <!-- Back to Store -->
      <button
        @click="emit('navigate', 'home')"
        class="block mx-auto mt-6 font-sans text-xs tracking-[0.2em] uppercase text-ink-500 hover:text-ink-300 transition-colors cursor-hover"
      >
        Back to Store
      </button>

    </div>
  </section>
</template>


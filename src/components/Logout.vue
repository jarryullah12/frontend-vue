<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow text-center">
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Logout</h2>
    <p class="mb-6">You have been logged out.</p>
    <router-link to="/login" class="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900">Go to Login</router-link>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  auth.logout()
  setTimeout(() => router.push('/'), 800)
})
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
    <!-- Welcome message for newly registered users -->
    <div v-if="isNewlyRegistered" class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
      <strong class="font-bold">Welcome!</strong>
      <span class="block sm:inline"> Your account has been created successfully. Please login with your credentials.</span>
    </div>
    
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input v-model="email" type="email" class="w-full px-3 py-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Password</label>
        <input v-model="password" type="password" class="w-full px-3 py-2 border rounded" required />
      </div>
      <button type="submit" class="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <div v-if="success" class="mt-4 text-green-700">Login successful!</div>
    <div v-if="error" class="mt-4 text-red-700">{{ error }}</div>
    

    
    <div class="mt-6 flex justify-between items-center">
      <router-link to="/register" class="text-blue-700 hover:underline text-sm">Don't have an account? Register</router-link>
      <router-link to="/admin/login" class="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-900 transition duration-300 text-sm">Admin Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const success = ref(false)
const error = ref('')
const isLoading = ref(false)
const isNewlyRegistered = ref(false)

// Check if user just registered
onMounted(() => {
  // Check if the registered query parameter is present
  isNewlyRegistered.value = route.query.registered === 'true'
  
  // Check if there's a registered user in localStorage
  try {
    const registeredUserJson = localStorage.getItem('registeredUser')
    if (registeredUserJson) {
      const registeredUser = JSON.parse(registeredUserJson)
      // Pre-fill email field with registered user's email
      if (registeredUser.email && isNewlyRegistered.value) {
        email.value = registeredUser.email
      }
    }
  } catch (error) {
    console.error('Error checking registered user:', error)
  }
})

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function login() {
  isLoading.value = true
  error.value = ''
  
  try {
    console.log('Attempting login with:', { email: email.value })
    
    // DIRECT LOGIN APPROACH - Check all possible login sources directly
    let loginSuccess = false;
    let isAdmin = false;
    let userData = null;
    
    // 1. Check registered user from Register.vue
    try {
      const registeredUserJson = localStorage.getItem('registeredUser');
      console.log('Registered user data:', registeredUserJson);
      
      if (registeredUserJson) {
        const registeredUser = JSON.parse(registeredUserJson);
        console.log('Checking against registered user:', registeredUser.email);
        
        if (registeredUser.email === email.value && registeredUser.password === password.value) {
          console.log('Registered user credentials match!');
          loginSuccess = true;
          isAdmin = false;
          userData = {
            id: 2000,
            name: registeredUser.username || 'Registered User',
            email: registeredUser.email,
            role: 'User'
          };
        }
      }
    } catch (err) {
      console.error('Error checking registered user:', err);
    }
    
    // 2. Check default admin credentials
    if (!loginSuccess && email.value === 'admin@luxuryhotel.com' && password.value === 'admin123') {
      console.log('Admin credentials match!');
      loginSuccess = true;
      isAdmin = true;
      userData = {
        id: 999,
        name: 'Admin User',
        email: 'admin@luxuryhotel.com',
        role: 'Admin'
      };
    }
    
    // 3. Check default user credentials
    if (!loginSuccess && email.value === 'user@example.com' && password.value === 'user123') {
      console.log('Default user credentials match!');
      loginSuccess = true;
      isAdmin = false;
      userData = {
        id: 1000,
        name: 'Regular User',
        email: 'user@example.com',
        role: 'User'
      };
    }
    
    // 4. Handle login result
    if (loginSuccess) {
      // Update auth store directly (without using $patch)
      auth.isAuthenticated = true;
      auth.isAdmin = isAdmin;
      auth.user = userData;
      
      // Update localStorage directly
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      localStorage.setItem('user', JSON.stringify(userData));
      
      success.value = true;
      console.log('Login successful, redirecting...');
      redirectAfterLogin(isAdmin);
    } else {
      error.value = 'Invalid email or password';
      success.value = false;
    }
  } catch (e) {
    console.error('Login error:', e);
    error.value = 'An error occurred during login: ' + e.message;
    success.value = false;
  } finally {
    isLoading.value = false;
  }
}

function redirectAfterLogin(isAdmin) {
  // Get the redirect path from the route query if it exists
  const redirectPath = route.query.redirect || (isAdmin ? '/admin' : '/')
  
  console.log('Redirecting to:', redirectPath)
  
  // Force a reload of the page to ensure all components recognize the auth state
  setTimeout(() => {
    // Use window.location for a full page reload to ensure session is recognized
    window.location.href = redirectPath
  }, 800)
}
</script>

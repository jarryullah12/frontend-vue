<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Admin Login</h2>
        <p class="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
      </div>
      
      <form @submit.prevent="login">
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="admin@example.com"
            required
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="••••••••"
            required
          />
        </div>
        
        <div class="mb-6">
          <button 
            type="submit" 
            class="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>
      </form>
      
      <div v-if="success" class="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
        Login successful! Redirecting to admin dashboard...
      </div>
      
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ error }}
      </div>
      
      <div class="text-center mt-4">
        <p class="text-gray-600 text-sm">
          Don't have an admin account? 
          <router-link to="/admin/register" class="text-purple-700 hover:underline">Register</router-link>
        </p>
        <p class="text-gray-600 text-sm mt-2">
          <router-link to="/" class="text-purple-700 hover:underline">Back to website</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const success = ref(false);
const error = ref('');
const isLoading = ref(false);

const router = useRouter();

async function login() {
  isLoading.value = true;
  error.value = '';
  success.value = false;
  
  try {
    // Get registered admin credentials from localStorage
    const storedEmail = localStorage.getItem('adminEmail');
    const storedPassword = localStorage.getItem('adminPassword');
    const storedName = localStorage.getItem('adminName') || 'Admin User';
    const storedRole = localStorage.getItem('adminRole') || 'Admin';
    
    console.log('Stored admin:', { email: storedEmail, password: storedPassword });
    console.log('Trying to login with:', { email: email.value, password: password.value });
    
    // Check if credentials match registered admin or default admin
    if ((storedEmail && storedPassword && 
         email.value === storedEmail && 
         password.value === storedPassword) || 
        (email.value === 'admin@luxuryhotel.com' && 
         password.value === 'admin123')) {
      
      // Set authentication in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      
      // Store user info
      const user = {
        id: 999,
        name: storedEmail === email.value ? storedName : 'Admin User',
        email: email.value,
        role: storedEmail === email.value ? storedRole : 'Admin'
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Login successful:', user);
      
      // Show success message
      success.value = true;
      
      // Redirect to admin dashboard after a short delay
      setTimeout(() => router.push('/admin'), 1000);
    } else {
      error.value = 'Invalid email or password';
      console.log('Login failed: Invalid credentials');
    }
  } catch (e) {
    console.error('Login error:', e);
    error.value = 'An error occurred during login';
  } finally {
    isLoading.value = false;
  }
}
</script>

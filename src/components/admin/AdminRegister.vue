<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Admin Registration</h2>
        <p class="text-gray-600 mt-2">Create a new admin account</p>
      </div>
      
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
          <input 
            v-model="name" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="John Doe"
            required
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="admin@example.com"
            required
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="••••••••"
            required
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="••••••••"
            required
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-2">Admin Role</label>
          <select 
            v-model="role" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="Admin">Admin</option>
            <option value="SuperAdmin">Super Admin</option>
          </select>
        </div>
        
        <div class="mb-6">
          <button 
            type="submit" 
            class="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Create Account
          </button>
        </div>
      </form>
      
      <div v-if="success" class="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
        Registration successful! You can now <router-link to="/admin/login" class="font-medium underline">login</router-link>.
      </div>
      
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ error }}
      </div>
      
      <div class="text-center mt-4">
        <p class="text-gray-600 text-sm">
          Already have an admin account? 
          <router-link to="/admin/login" class="text-purple-700 hover:underline">Login</router-link>
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

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('Admin');
const success = ref(false);
const error = ref('');

function register() {
  // Reset error and success
  error.value = '';
  success.value = false;
  
  // Validate form
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }
  
  try {
    // Create a simple admin object
    const adminData = {
      email: email.value,
      password: password.value,
      name: name.value,
      role: role.value
    };
    
    // Save directly to localStorage
    localStorage.setItem('adminEmail', email.value);
    localStorage.setItem('adminPassword', password.value);
    localStorage.setItem('adminName', name.value);
    localStorage.setItem('adminRole', role.value);
    
    // Also save as JSON for backup
    localStorage.setItem('adminData', JSON.stringify(adminData));
    
    console.log('Admin registered:', adminData);
    
    // Show success message
    success.value = true;
    
    // Reset form
    name.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    role.value = 'Admin';
  } catch (e) {
    error.value = 'An error occurred during registration';
    console.error(e);
  }
}
</script>

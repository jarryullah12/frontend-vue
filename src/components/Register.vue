<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Register</h2>
    <form @submit.prevent="register">
      <div class="mb-4">
        <label class="block text-gray-700">Username</label>
        <input v-model="username" type="text" class="w-full px-3 py-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input v-model="email" type="email" class="w-full px-3 py-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Password</label>
        <input v-model="password" type="password" class="w-full px-3 py-2 border rounded" required />
      </div>
      <button type="submit" class="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900">Register</button>
    </form>
    <div v-if="success" class="mt-4 text-green-700">Registration successful!</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const success = ref(false)
const router = useRouter()

function register() {
  try {
    console.log('Registering new user:', username.value, email.value);
    
    // Create user object with all necessary fields
    const user = { 
      username: username.value, 
      name: username.value, // Add name field for compatibility with auth store
      email: email.value, 
      password: password.value,
      registrationDate: new Date().toISOString()
    };
    
    // Save to registeredUser in localStorage
    localStorage.setItem('registeredUser', JSON.stringify(user));
    
    // Also add to users list if it exists
    try {
      const usersJson = localStorage.getItem('users');
      let users = [];
      
      if (usersJson) {
        users = JSON.parse(usersJson);
      }
      
      // Add user to users list (without password for security)
      const userForList = {
        id: users.length + 1,
        name: username.value,
        email: email.value,
        phone: '', // No phone provided during registration
        registrationDate: new Date().toISOString()
      };
      
      users.push(userForList);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('User added to users list');
    } catch (error) {
      console.error('Error updating users list:', error);
    }
    
    // Show success message and reset form
    success.value = true;
    username.value = '';
    email.value = '';
    password.value = '';
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { registered: 'true' } // Add query param to show special message on login page
      });
    }, 1200);
  } catch (error) {
    console.error('Error during registration:', error);
    alert('Registration failed. Please try again.');
  }
}
</script>

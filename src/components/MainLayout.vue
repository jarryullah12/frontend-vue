<template>
  <div>
    <!-- Navigation -->
    <nav class="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="../assets/hotel-logo.svg" alt="Hotel Logo" class="h-12 w-12 mr-3" />
            <span class="text-xl font-bold">Luxury Hotel</span>
          </router-link>
        </div>
        <div class="hidden md:flex space-x-6">
          <router-link to="/" class="hover:text-blue-200 transition duration-300">Home</router-link>
          <router-link to="/search" class="hover:text-blue-200 transition duration-300">Search</router-link>
          <router-link to="/rooms" class="hover:text-blue-200 transition duration-300">Rooms & Suites</router-link>
          <router-link to="/rooms-list" class="hover:text-blue-200 transition duration-300">Rooms List</router-link>
          <router-link v-if="auth.isAuthenticated" to="/booked-rooms" class="hover:text-blue-200 transition duration-300">My Bookings</router-link>
          <router-link to="/contact" class="hover:text-blue-200 transition duration-300">Contact</router-link>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Book Now button removed -->
          
          <!-- Admin Panel Link -->
          <a v-if="auth.isAdmin" href="/admin" class="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-900 transition duration-300">Admin Panel</a>
          
          <!-- Login Button (when not authenticated) -->
          <router-link v-if="!auth.isAuthenticated" to="/login" class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition duration-300">Login</router-link>
          
          <!-- Direct Logout Button (when authenticated) -->
          <button v-if="auth.isAuthenticated" @click="logout" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 flex items-center space-x-2">
            <span>Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          
          <!-- User Menu (when authenticated) -->
          <div v-if="auth.isAuthenticated" class="relative" @click.away="userMenuOpen = false">
            <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition duration-300">
              <span>{{ auth.user ? auth.user.name.split(' ')[0] : 'User' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'transform rotate-180': userMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div v-show="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div class="px-4 py-2 border-b border-gray-200">
                <p class="text-sm text-gray-500">Signed in as</p>
                <p class="text-sm font-medium text-gray-900 truncate">{{ auth.user ? auth.user.email : 'user@example.com' }}</p>
              </div>
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="userMenuOpen = false">Your Profile</router-link>
              <router-link to="/booked-rooms" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="userMenuOpen = false">Your Bookings</router-link>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
            </div>
          </div>
          
          <!-- Mobile Menu Button -->
          <button class="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <router-view></router-view>
    
    <!-- Footer -->
    <footer class="bg-blue-900 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Hotel Info -->
          <div>
            <div class="flex items-center mb-4">
              <img src="../assets/hotel-logo.svg" alt="Hotel Logo" class="h-12 w-12 mr-3" />
              <div>
                <div class="text-xl font-bold">Luxury Hotel</div>
                <div class="text-sm text-blue-300">Experience the difference</div>
              </div>
            </div>
            <p class="text-blue-200 mb-6">
              Our hotel offers luxury accommodations, fine dining, and exceptional service in a prime location.
            </p>

          </div>
          
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><router-link to="/" class="text-blue-200 hover:text-white transition duration-300">Home</router-link></li>
              <li><router-link to="/search" class="text-blue-200 hover:text-white transition duration-300">Search</router-link></li>
              <li><router-link to="/rooms" class="text-blue-200 hover:text-white transition duration-300">Rooms & Suites</router-link></li>
              <li><router-link to="/rooms-list" class="text-blue-200 hover:text-white transition duration-300">Rooms List</router-link></li>
              <li v-if="auth.isAuthenticated"><router-link to="/booked-rooms" class="text-blue-200 hover:text-white transition duration-300">My Bookings</router-link></li>
              <li><router-link to="/contact" class="text-blue-200 hover:text-white transition duration-300">Contact</router-link></li>
            </ul>
          </div>
          
          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact Info</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-blue-200">Faisalabad, Pakistan</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="text-blue-200">+92 3356471303</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-blue-200">jarryullah46@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <!-- Newsletter -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Newsletter</h3>
            <p class="text-blue-200 mb-4">Subscribe to our newsletter for exclusive offers, travel tips, and special deals!</p>
            
            <div v-if="subscriptionSuccess" class="bg-green-800 text-white p-3 rounded-md mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Thank you for subscribing!</span>
            </div>
            
            <form @submit.prevent="subscribeToNewsletter" class="space-y-3">
              <div class="flex">
                <input 
                  v-model="newsletterEmail" 
                  type="email" 
                  placeholder="Your email address" 
                  class="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                  required
                />
                <button 
                  type="submit" 
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r-md transition duration-300 flex items-center"
                  :disabled="subscribing"
                >
                  <span v-if="subscribing" class="mr-2">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-else>Subscribe</span>
                </button>
              </div>
              
              <!-- Promotional checkboxes removed as requested -->
            </form>
            
            <p class="text-xs text-blue-300 mt-3">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="border-t border-blue-800 mt-12 pt-6">
  <p class="text-blue-300 text-sm text-center w-full">2025 Luxury Hotel. All rights reserved.</p>
</div>
      </div>
    </footer>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
export default {
  name: 'MainLayout',
  setup() {
    const auth = useAuthStore()
    
    // Check authentication state on component mount
    onMounted(() => {
      // Force the component to recognize the current auth state from localStorage
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      const isAdmin = localStorage.getItem('isAdmin') === 'true'
      
      console.log('MainLayout - Current auth state:', { isAuthenticated, isAdmin })
      
      // If localStorage has auth state but store doesn't, update the store
      if (isAuthenticated && !auth.isAuthenticated) {
        console.log('Syncing auth state from localStorage to store')
        auth.$patch({
          isAuthenticated: true,
          isAdmin: isAdmin
        })
        
        // Also try to restore user data
        try {
          const userJson = localStorage.getItem('user')
          if (userJson) {
            auth.$patch({ user: JSON.parse(userJson) })
          }
        } catch (error) {
          console.error('Error restoring user data:', error)
        }
      }
    })
    
    return { auth }
  },
  data() {
    return {
      userMenuOpen: false,
      newsletterEmail: '',
      subscribing: false,
      subscriptionSuccess: false,
      newsletterPreferences: {
        specialOffers: true,
        travelTips: false
      }
    }
  },
  methods: {
    subscribeToNewsletter() {
      // Validate email
      if (!this.validateEmail(this.newsletterEmail)) {
        alert('Please enter a valid email address');
        return;
      }
      
      this.subscribing = true;
      
      // Simulate API call
      setTimeout(() => {
        this.subscribing = false;
        this.subscriptionSuccess = true;
        
        // Reset form after successful subscription
        this.newsletterEmail = '';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.subscriptionSuccess = false;
        }, 5000);
        
        console.log('Newsletter subscription:', {
          email: this.newsletterEmail,
          preferences: this.newsletterPreferences
        });
      }, 1500);
    },
    
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    
    logout() {
      // Close the user menu
      this.userMenuOpen = false;
      
      // Log the user out using the auth store
      this.auth.logout();
      
      // Redirect to home page
      this.$router.push('/');
    }
  }
}
</script>

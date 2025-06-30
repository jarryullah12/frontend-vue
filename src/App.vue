<template>
  <router-view />
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue'
import { sessionManager } from './utils/sessionManager'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    
    onMounted(() => {
      console.log('App component mounted')
      
      // Clear localStorage for testing purposes
      // Uncomment this line if you want to reset all data
      // localStorage.clear()
      
      // Initialize default data in localStorage if needed
      initializeDefaultData()
      
      // Initialize session management
      sessionManager.initSession()
      
      // Check if user is already authenticated from localStorage
      if (localStorage.getItem('isAuthenticated') === 'true') {
        console.log('User is already authenticated')
      }
      
      // Log the current rooms in localStorage for debugging
      const storedRooms = localStorage.getItem('rooms')
      if (storedRooms) {
        console.log('Current rooms in localStorage:', JSON.parse(storedRooms))
      } else {
        console.log('No rooms found in localStorage')
      }
    })
    
    onBeforeUnmount(() => {
      // Clean up session management
      sessionManager.cleanUp()
    })
    
    // Initialize default data in localStorage if it doesn't exist
    const initializeDefaultData = () => {
      try {
        // Check if rooms exist in localStorage
        if (!localStorage.getItem('rooms')) {
          // Set default rooms
          const defaultRooms = [
            {
              id: 1,
              name: 'Deluxe King Room',
              description: 'Spacious room with king-size bed and city view',
              price: 199,
              capacity: 2,
              amenities: [
                'Free Wi-Fi', 
                'Minibar', 
                'Room Service', 
                'TV',
                'Air conditioning',
                'Private bathroom',
                'Wake-up service'
              ],
              image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
              imageTwo: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
              imageThree: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
              available: true
            },
            {
              id: 2,
              name: 'Superior Double Room',
              description: 'Comfortable room with two double beds',
              price: 149,
              capacity: 4,
              amenities: [
                'Free Wi-Fi', 
                'Coffee Maker', 
                'TV',
                'Air conditioning',
                'Private bathroom',
                'Wake-up service'
              ],
              image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
              imageTwo: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
              imageThree: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
              available: true
            },
            {
              id: 3,
              name: 'Executive Suite',
              description: 'Luxury suite with separate living area and ocean view',
              price: 299,
              capacity: 2,
              amenities: [
                'Free Wi-Fi', 
                'Minibar', 
                'Room Service', 
                'TV', 
                'Jacuzzi',
                'Air conditioning',
                'Private bathroom',
                'Wake-up service'
              ],
              image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
              imageTwo: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
              imageThree: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
              available: true
            }
          ]
          localStorage.setItem('rooms', JSON.stringify(defaultRooms))
          console.log('Default rooms initialized in localStorage')
        }
        
        // Check if users exist in localStorage
        if (!localStorage.getItem('users')) {
          // Set default users
          const defaultUsers = [
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+1 (555) 123-4567',
              registrationDate: '2025-01-15'
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+1 (555) 987-6543',
              registrationDate: '2025-02-20'
            }
          ]
          localStorage.setItem('users', JSON.stringify(defaultUsers))
          console.log('Default users initialized in localStorage')
        }
      } catch (error) {
        console.error('Error initializing default data:', error)
      }
    }
  }
}
</script>

<template>
  <div class="bg-white">
    <!-- Page Header -->
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <div class="flex justify-center items-center gap-1 mb-2">
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
        </div>
        <h2 class="text-3xl font-bold mb-2">Rooms List</h2>
        <p class="text-gray-600">The hotel is arranged on three floors, with a variety of 85 rooms. All the rooms are elegant and comfortable, equipped with modern amenities.</p>
      </div>
      
      <!-- Room Listings -->
      <div class="space-y-8">
        <!-- Dynamic Room Cards -->
        <div v-for="room in rooms" :key="room.id" class="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden">
          <div class="md:w-1/3">
            <img :src="room.image" :alt="room.name" class="w-full h-full object-cover">
          </div>
          <div class="md:w-2/3 p-6">
            <h3 class="text-2xl font-bold mb-2">{{ room.name }}</h3>
            <p class="text-gray-600 mb-4">{{ room.description }}</p>
            
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ room.beds }}</span>
              </div>
              <div v-for="(amenity, index) in room.amenities" :key="index" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ amenity }}</span>
              </div>
            </div>
            
            <div class="flex flex-wrap justify-between items-center mt-4">
              <div>
                <span class="text-2xl font-bold">${{ room.price }}</span>
                <span class="text-gray-600 text-sm">/night (Taxes and Fees)</span>
              </div>
              <div>
                <button 
                  @click="selectRoom(room.id)" 
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition duration-300"
                >
                  Book Now
                </button>
                <button 
                  @click="viewRoomDetails(room.id)" 
                  class="text-blue-600 text-sm hover:underline ml-4"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    </div>
    
    <!-- Payment Methods Section -->

    
    <!-- Booking Modal Removed -->
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useRoomsStore } from '../stores/rooms'

export default {
  name: 'RoomsList',
  setup() {
    const router = useRouter()
    const roomsStore = useRoomsStore()
    const auth = useAuthStore()
    
    // Initialize on component mount
    onMounted(() => {
      console.log('RoomsList component mounted')
      
      // Initialize the rooms store to ensure data is loaded from localStorage
      roomsStore.initializeRooms()
      
      console.log('Rooms loaded from localStorage:', roomsStore.rooms.length)
      
      // If no rooms are available, we might want to show a message
      if (roomsStore.rooms.length === 0) {
        console.warn('No rooms found in localStorage')
      }
    })
    
    // Computed properties
    const rooms = computed(() => roomsStore.rooms)
    
    // Methods
    const selectRoom = (roomId) => {
      // Require authentication before viewing room details
      if (!auth.isAuthenticated) {
        // Redirect to login, with redirect query
        router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
        return
      }
      
      // Redirect to room details page
      router.push(`/room/${roomId}`)
    }
    
    const viewRoomDetails = (roomId) => {
      router.push(`/room/${roomId}`)
    }
    
    return {
      rooms,
      selectRoom,
      viewRoomDetails
    }
  }
}
</script>

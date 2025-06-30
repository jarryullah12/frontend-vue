<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-lg text-gray-700">Loading rooms...</span>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredRooms.length === 0" class="py-20 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No Rooms Found</h3>
      <p class="text-gray-600 mb-6">No rooms match your current search criteria.</p>
      <button @click="$emit('reset-filters')" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
        Reset Filters
      </button>
    </div>
    
    <!-- Room Listings -->
    <div v-else class="space-y-16">
      <div v-for="room in filteredRooms" :key="room.id" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="overflow-hidden rounded-lg">
          <img :src="room.image" :alt="room.name" class="w-full h-full object-cover">
        </div>
        <div>
          <h3 class="text-2xl font-bold mb-4">{{ room.name }}</h3>
          <ul class="space-y-2 mb-6">
            <!-- Bed Information -->
            <li class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ room.beds }}</span>
            </li>
            
            <!-- Amenities -->
            <li v-for="amenity in room.amenities" :key="amenity" class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ amenity }}</span>
            </li>
            
            <!-- Features -->
            <li v-if="room.features && room.features.length > 0" class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ room.features.join(', ') }}</span>
            </li>
          </ul>
          
          <div class="flex items-center mb-6">
            <span class="text-3xl font-bold">${{ room.price }}</span>
            <span class="text-gray-600 ml-2">/night (Taxes and Fees)</span>
          </div>
          
          <div class="flex items-center gap-4">
            <button 
              @click="$emit('select-room', room.id)" 
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition duration-300"
              :disabled="!room.available"
            >
              {{ room.available ? 'Book Now' : 'Not Available' }}
            </button>
            <button 
              @click="$emit('view-details', room.id)" 
              class="text-blue-600 hover:underline"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoomsStore } from '../stores/rooms'

export default {
  name: 'FilteredRoomsList',
  props: {
    sortOrder: {
      type: String,
      default: null
    }
  },
  emits: ['select-room', 'view-details', 'reset-filters'],
  setup(props) {
    const roomsStore = useRoomsStore()
    const loading = ref(true)
    
    // Initialize on component mount
    onMounted(() => {
      // Initialize the rooms store
      roomsStore.initializeRooms()
      
      // Simulate loading for better UX
      setTimeout(() => {
        loading.value = false
        console.log('Rooms loaded from localStorage:', availableRooms.value.length)
      }, 500)
    })
    
    // Get all available rooms
    const availableRooms = computed(() => {
      return roomsStore.filteredRooms || []
    })
    
    // Filter out specific room types
    const filteredRooms = computed(() => {
      const excludedRoomTypes = ['Classic Double Room', 'Comfort Triple Room']
      
      // Filter out the excluded room types
      const filtered = availableRooms.value.filter(room => 
        room && !excludedRoomTypes.includes(room.name)
      )
      
      // Apply sorting if needed
      if (props.sortOrder === 'asc') {
        return [...filtered].sort((a, b) => a.price - b.price)
      } else if (props.sortOrder === 'desc') {
        return [...filtered].sort((a, b) => b.price - a.price)
      }
      
      return filtered
    })
    
    return {
      loading,
      filteredRooms
    }
  }
}
</script>

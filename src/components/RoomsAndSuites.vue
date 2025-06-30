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
        <h2 class="text-3xl font-bold mb-2">Rooms & Suites</h2>
        <p class="text-gray-600">The hotel is arranged on three floors, with a variety of 85 rooms. All the rooms are elegant and comfortable, equipped with modern amenities.</p>
      </div>
      
      <!-- Room Filters Section -->
      <div class="bg-gray-50 p-6 rounded-lg shadow-sm mb-10">
        <h2 class="text-xl font-semibold mb-4">Find Your Perfect Room</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Date Range Picker -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Check In - Check Out</label>
            <div class="grid grid-cols-2 gap-2">
              <input 
                type="date" 
                v-model="bookingDetails.checkInDate" 
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <input 
                type="date" 
                v-model="bookingDetails.checkOutDate" 
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
          
          <!-- Guests Filter -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Guests</label>
            <select 
              v-model="bookingDetails.guests" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="updateCapacityFilter"
            >
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>2 Adults, 1 Child</option>
              <option>2 Adults, 2 Children</option>
            </select>
          </div>
          
          <!-- Price Range Filter -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Price Range: ${{ priceRange[0] }} - ${{ priceRange[1] }}</label>
            <div class="px-2">
              <input 
                type="range" 
                min="0" 
                max="600" 
                step="50"
                v-model.number="priceRange[1]" 
                class="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                @change="updatePriceFilter"
              >
            </div>
          </div>
        </div>
        
        <!-- Additional Room Preferences -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium mb-4">Room Preferences</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="preference-wifi" 
                v-model="roomPreferences.wifi"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="preference-wifi" class="ml-2 block text-sm text-gray-700">Free WiFi</label>
            </div>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="preference-breakfast" 
                v-model="roomPreferences.breakfast"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="preference-breakfast" class="ml-2 block text-sm text-gray-700">Breakfast Included</label>
            </div>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="preference-aircon" 
                v-model="roomPreferences.airConditioning"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="preference-aircon" class="ml-2 block text-sm text-gray-700">Air Conditioning</label>
            </div>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="preference-balcony" 
                v-model="roomPreferences.balcony"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="preference-balcony" class="ml-2 block text-sm text-gray-700">Balcony/Terrace</label>
            </div>
          </div>
        </div>
        
        <!-- View Preferences -->
        <div class="mt-4">
          <h3 class="text-lg font-medium mb-4">View Preference</h3>
          <div class="flex flex-wrap gap-3">
            <button 
              @click="setViewPreference('any')" 
              class="px-4 py-2 rounded-full text-sm"
              :class="viewPreference === 'any' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              Any View
            </button>
            <button 
              @click="setViewPreference('garden')" 
              class="px-4 py-2 rounded-full text-sm"
              :class="viewPreference === 'garden' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              Garden View
            </button>
            <button 
              @click="setViewPreference('city')" 
              class="px-4 py-2 rounded-full text-sm"
              :class="viewPreference === 'city' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              City View
            </button>
            <button 
              @click="setViewPreference('pool')" 
              class="px-4 py-2 rounded-full text-sm"
              :class="viewPreference === 'pool' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              Pool View
            </button>
          </div>
        </div>
        
        <div class="flex justify-between mt-6">
          <button 
            @click="resetFilters" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300"
          >
            Reset Filters
          </button>
          <button 
            @click="checkAvailability" 
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
            :disabled="loading"
          >
            <span v-if="!loading">Check Availability</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </span>
          </button>
        </div>
      </div>
      
      <!-- Results Summary -->
      <div id="room-results" v-if="rooms.length > 0" class="mb-8 flex justify-between items-center">
        <p class="text-gray-700"><span class="font-semibold">{{ rooms.length }}</span> rooms found</p>
        <div class="flex gap-2">
          <button 
            @click="sortRoomsByPrice('asc')" 
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition duration-300"
            :class="{'bg-blue-50 border-blue-300': sortOrder === 'asc'}"
          >
            Price: Low to High
          </button>
          <button 
            @click="sortRoomsByPrice('desc')" 
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition duration-300"
            :class="{'bg-blue-50 border-blue-300': sortOrder === 'desc'}"
          >
            Price: High to Low
          </button>
        </div>
      </div>
      
      <!-- Room Listings using the new component -->
      <filtered-rooms-list 
        :sort-order="sortOrder"
        @select-room="selectRoom"
        @view-details="viewRoomDetails"
        @reset-filters="resetFilters"
      />
    </div>
    
    <!-- Booking Modal Removed -->
  </div>
</template>

<script>
import { useRoomsStore } from '../stores/rooms'
import { useBookingStore } from '../stores/booking'
import FilteredRoomsList from './FilteredRoomsList.vue'

export default {
  name: 'RoomsAndSuites',
  components: {
    FilteredRoomsList
  },
  data() {
    return {
      loading: false,
      sortOrder: null,
      priceRange: [0, 600],
      sortedRooms: [],
      viewPreference: 'any',
      roomPreferences: {
        wifi: false,
        breakfast: false,
        airConditioning: false,
        balcony: false
      },
      bookingDetails: {
        checkInDate: '',
        checkOutDate: '',
        guests: '1 Adult',
        specialRequests: ''
      }
    }
  },
  computed: {
    roomsStore() {
      return useRoomsStore()
    },
    bookingStore() {
      return useBookingStore()
    },
    rooms() {
      // Make sure filteredRooms exists before filtering
      if (!this.roomsStore || !this.roomsStore.filteredRooms) {
        return [];
      }
      
      // Filter out Classic Double Room and Comfort Triple Room
      return this.roomsStore.filteredRooms.filter(room => 
        room && room.name !== 'Classic Double Room' && room.name !== 'Comfort Triple Room'
      );
    }
  },
  created() {
    // Initialize rooms data from localStorage
    this.loading = true;
    
    // Initialize the rooms store
    this.roomsStore.initializeRooms();
    
    // Initialize booking details from booking store if available
    if (this.bookingStore.checkInDate) {
      this.bookingDetails.checkInDate = this.bookingStore.checkInDate
    }
    if (this.bookingStore.checkOutDate) {
      this.bookingDetails.checkOutDate = this.bookingStore.checkOutDate
    }
    if (this.bookingStore.guests) {
      this.bookingDetails.guests = this.bookingStore.guests
    }
    
    // Simulate loading for better UX
    setTimeout(() => {
      this.loading = false;
      console.log('Rooms loaded from localStorage:', this.rooms);
    }, 500);
  },
  methods: {
    selectRoom(roomId) {
      // Redirect to room details page instead of showing modal
      this.$router.push(`/room/${roomId}`)
    },
    resetBookingForm() {
      this.bookingDetails = {
        checkInDate: '',
        checkOutDate: '',
        guests: '1 Adult',
        specialRequests: ''
      }
    },
    filterByCapacity(capacity) {
      this.roomsStore.setCapacityFilter(capacity)
    },
    resetFilters() {
      this.roomsStore.resetFilters()
      this.priceRange = [0, 600]
      this.sortOrder = null
      this.sortedRooms = []
      this.viewPreference = 'any'
      this.roomPreferences = {
        wifi: false,
        breakfast: false,
        airConditioning: false,
        balcony: false
      }
      this.bookingDetails = {
        checkInDate: '',
        checkOutDate: '',
        guests: '1 Adult',
        specialRequests: ''
      }
    },
    

    
    setViewPreference(view) {
      this.viewPreference = view
      this.filterRoomsByView()
    },
    
    filterRoomsByView() {
      // In a real app, this would filter rooms based on the view preference
      // For demo purposes, we'll just log the preference
      console.log('Filtering rooms by view:', this.viewPreference)
    },
    
    filterRoomsByPreferences() {
      // In a real app, this would filter rooms based on the selected preferences
      // For demo purposes, we'll just log the preferences
      console.log('Filtering rooms by preferences:', this.roomPreferences)
    },
    
    updateCapacityFilter() {
      // Extract the number of guests from the selection
      let capacity = 1
      if (this.bookingDetails.guests.includes('2 Adults')) {
        capacity = 2
      }
      if (this.bookingDetails.guests.includes('Child')) {
        capacity += parseInt(this.bookingDetails.guests.match(/\d+(?=\s+Child)/)[0] || 0)
      }
      
      this.roomsStore.setCapacityFilter(capacity)
    },
    
    updatePriceFilter() {
      this.roomsStore.setPriceRangeFilter(this.priceRange[0], this.priceRange[1])
    },
    
    sortRoomsByPrice(order) {
      this.sortOrder = order
      this.sortedRooms = [...this.rooms].sort((a, b) => {
        return order === 'asc' ? a.price - b.price : b.price - a.price
      })
    },
    
    viewRoomDetails(roomId) {
      // Navigate to room details page
      this.$router.push(`/room/${roomId}`)
    },
    
    async checkAvailability() {
      this.loading = true
      try {
        // Update booking store with latest details
        this.bookingStore.setCheckInDate(this.bookingDetails.checkInDate)
        this.bookingStore.setCheckOutDate(this.bookingDetails.checkOutDate)
        this.bookingStore.setGuests(this.bookingDetails.guests)
        
        // In a real app, this would make an API call to check availability
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Apply all filters based on the form data
        this.updateCapacityFilter()
        this.updatePriceFilter()
        this.filterRoomsByPreferences()
        this.filterRoomsByView()
        
        // If we have a sort order, apply it
        if (this.sortOrder) {
          this.sortRoomsByPrice(this.sortOrder)
        }
        
        // Show a success message or notification
        this.$nextTick(() => {
          const resultsElement = document.querySelector('#room-results')
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' })
          }
        })
      } catch (error) {
        console.error('Error checking availability:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

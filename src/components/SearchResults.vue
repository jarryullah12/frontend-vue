<template>
  <div class="bg-white">
    <!-- Search Header -->
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <div class="flex justify-center items-center gap-1 mb-2">
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          <div class="w-1 h-1 rounded-full bg-blue-600"></div>
        </div>
        <h2 class="text-3xl font-bold mb-2">Search Results</h2>
        <p class="text-gray-600">We found {{ filteredRooms.length }} rooms matching your criteria</p>
      </div>
      
      <!-- Search Info -->
      <div class="flex flex-wrap justify-between items-center mb-6 text-sm text-gray-600">
        <div>Check-in: {{ formattedCheckInDate }} | Check-out: {{ formattedCheckOutDate }} | {{ bookingStore.guests }}</div>
        <div>
          <button @click="modifySearch" class="text-blue-600 hover:underline">Modify Search</button>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Room Listings (2/3 width) -->
        <div class="lg:col-span-2">
          <!-- Room Cards -->
          <div v-for="room in filteredRooms" :key="room.id" class="border border-gray-200 rounded-lg mb-8 overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="overflow-hidden">
                <img :src="room.image" :alt="room.name" class="w-full h-full object-cover">
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2">{{ room.name }}</h3>
                <p class="text-gray-600 mb-4">{{ room.description }}</p>
                
                <!-- Room Features -->
                <div class="grid grid-cols-2 gap-2 mb-4">
                  <div v-for="(feature, index) in room.features" :key="index" class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                
                <!-- Amenities -->
                <div class="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm text-gray-600">Amenities: Air conditioning, TV, Hairdryer, Bathroom, Kitchen + 6 more</span>
                </div>
                
                <!-- Pricing and Booking -->
                <div class="flex justify-between items-center mt-4">
                  <div>
                    <span class="text-2xl font-bold">${{ room.price }}</span>
                    <span class="text-gray-600 text-sm">/night (Taxes and Fees)</span>
                    <div class="text-sm text-gray-600 mt-1">
                      <span class="font-medium">Total: ${{ calculateTotalPrice(room) }}</span> for {{ totalNights }} nights
                    </div>
                  </div>
                  <button 
                    @click="selectRoom(room.id)" 
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition duration-300"
                  >
                    Book Now
                  </button>
                </div>
                <div class="mt-2">
                  <button 
                    @click="viewRoomDetails(room.id)" 
                    class="text-blue-600 text-sm hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar Filters (1/3 width) -->
        <div class="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 class="text-lg font-bold mb-4">Filter Results</h3>
          
          <!-- Price Range -->
          <div class="mb-6">
            <h4 class="font-semibold mb-2">Price Range</h4>
            <div class="flex items-center justify-between">
              <select 
                v-model="filters.priceRange" 
                class="border border-gray-300 rounded p-2 w-full"
              >
                <option>Any Price</option>
                <option>$0 - $200</option>
                <option>$200 - $400</option>
                <option>$400 - $600</option>
                <option>$600+</option>
              </select>
            </div>
          </div>
          
          <!-- Room Type -->
          <div class="mb-6">
            <h4 class="font-semibold mb-2">Room Type</h4>
            <div class="space-y-2">
              <div v-for="(type, index) in roomTypes" :key="index" class="flex items-center">
                <input 
                  type="checkbox" 
                  :id="'type-' + index" 
                  :checked="filters.roomTypes.includes(type)" 
                  @change="toggleRoomType(type)" 
                  class="mr-2"
                >
                <label :for="'type-' + index">{{ type }}</label>
              </div>
            </div>
          </div>
          
          <!-- Amenities -->
          <div class="mb-6">
            <h4 class="font-semibold mb-2">Amenities</h4>
            <div class="space-y-2">
              <div v-for="(amenity, index) in amenities" :key="index" class="flex items-center">
                <input 
                  type="checkbox" 
                  :id="'amenity-' + index" 
                  :checked="filters.amenities.includes(amenity)" 
                  @change="toggleAmenity(amenity)" 
                  class="mr-2"
                >
                <label :for="'amenity-' + index">{{ amenity }}</label>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="applyAllFilters" 
              class="bg-yellow-500 hover:bg-yellow-600 text-white flex-1 py-2 rounded-full transition duration-300"
            >
              Apply Filters
            </button>
            <button 
              @click="resetFilters" 
              class="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition duration-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Payment Methods Section -->

    
    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{ selectedRoom ? 'Book ' + selectedRoom.name : 'Book Room' }}</h3>
          <button @click="closeBookingModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Booking Success/Error Message -->
        <div v-if="bookingResult" class="mb-4">
          <div v-if="bookingResult.success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p class="font-bold">Booking Confirmed!</p>
            <p>Your booking ID is: {{ bookingResult.bookingId }}</p>
          </div>
          <div v-else class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p class="font-bold">Booking Failed</p>
            <p>{{ bookingResult.message }}</p>
            
            <!-- Alternative Rooms Suggestions -->
            <div v-if="bookingResult.alternativeRooms && bookingResult.alternativeRooms.length > 0" class="mt-4">
              <p class="font-medium text-gray-800 mb-2">We have some alternative rooms available:</p>
              <div class="space-y-3">
                <div 
                  v-for="room in bookingResult.alternativeRooms" 
                  :key="room.id"
                  class="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  @click="selectAlternativeRoom(room.id)"
                >
                  <div class="flex items-center">
                    <div class="h-12 w-12 rounded-md overflow-hidden mr-3">
                      <img :src="room.image" :alt="room.name" class="h-full w-full object-cover">
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">{{ room.name }}</h4>
                      <p class="text-sm text-gray-600">${{ room.price }} per night</p>
                    </div>
                  </div>
                  <button class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Booking Form -->
        <div v-if="!bookingResult">
          <!-- Room Options Section -->
          <div class="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Room Options
            </h3>
            
            <div class="mb-4 p-4 bg-white rounded-lg shadow-sm">
              <div class="flex items-center mb-3">
                <span class="text-lg font-medium">{{ selectedRoom ? selectedRoom.name : 'Selected Room' }}</span>
                <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Selected</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-gray-700">{{ selectedRoom && selectedRoom.capacity ? selectedRoom.capacity : '2' }} Guests</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-gray-700">${{ selectedRoom ? selectedRoom.price : '0' }} per night</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Booking Details Section -->
          <div class="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Booking Details
            </h3>
            
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Check In Date</label>
                  <input 
                    type="date" 
                    v-model="bookingDetails.checkInDate"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Check Out Date</label>
                  <input 
                    type="date" 
                    v-model="bookingDetails.checkOutDate"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-medium mb-2">Guests</label>
                <select 
                  v-model="bookingDetails.guests"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults, 1 Child</option>
                  <option>2 Adults, 2 Children</option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-medium mb-2">Special Requests</label>
                <textarea 
                  v-model="bookingDetails.specialRequests"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Any special requests or requirements?"
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- Price Summary Section -->
          <div class="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Price Summary
            </h3>
            
            <div class="bg-white rounded-lg shadow-sm p-4">
              <div class="border-b border-gray-100 pb-4 mb-4">
                <div class="flex justify-between py-2">
                  <span class="text-gray-600">Room Rate ({{ totalNights }} nights)</span>
                  <span class="font-medium">${{ selectedRoom ? selectedRoom.price : 0 }} × {{ totalNights }} = ${{ selectedRoom ? (selectedRoom.price * totalNights).toFixed(2) : '0.00' }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-t border-dashed border-gray-100">
                  <span class="text-gray-600">Taxes and Fees (10%)</span>
                  <span class="font-medium">${{ selectedRoom ? (selectedRoom.price * totalNights * 0.1).toFixed(2) : '0.00' }}</span>
                </div>
              </div>
              
              <div class="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                <span class="font-bold text-gray-800">Total Amount</span>
                <span class="text-xl font-bold text-blue-700">${{ selectedRoom ? calculateTotalPrice(selectedRoom) : '0.00' }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex gap-4">
            <button 
              @click="closeBookingModal" 
              class="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition duration-300"
            >
              Cancel
            </button>
            <button 
              @click="bookRoom" 
              :disabled="bookingInProgress || !bookingDetails.checkInDate || !bookingDetails.checkOutDate"
              class="flex-1 py-2 px-4 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span v-if="!bookingInProgress">Confirm Booking</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            </button>
          </div>
        </div>
        
        <!-- Booking Result Actions -->
        <div v-if="bookingResult" class="mt-6">
          <button 
            v-if="bookingResult.success"
            @click="closeBookingModal" 
            class="w-full py-2 px-4 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
          >
            Done
          </button>
          <div v-else class="flex gap-4">
            <button 
              @click="bookingResult = null" 
              class="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition duration-300"
            >
              Try Again
            </button>
            <button 
              @click="closeBookingModal" 
              class="flex-1 py-2 px-4 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoomsStore } from '../stores/rooms'
import { useBookingStore } from '../stores/booking'

export default {
  name: 'SearchResults',
  data() {
    return {
      loading: false,
      selectedRoomId: null,
      showBookingModal: false,
      bookingInProgress: false,
      bookingResult: null,
      filters: {
        priceRange: 'Any Price',
        roomTypes: [],
        amenities: []
      },
      roomTypes: ['Single Room', 'Double Room', 'Triple Room', 'Suite'],
      amenities: ['Air Conditioning', 'Free WiFi', 'TV', 'Mini Bar', 'Room Service', 'Swimming Pool', 'Gym'],
      sortOrder: null,
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
      return this.roomsStore.availableRooms
    },
    filteredRooms() {
      return this.applyFilters(this.rooms)
    },
    selectedRoom() {
      return this.selectedRoomId ? this.roomsStore.roomById(this.selectedRoomId) : null
    },
    formattedCheckInDate() {
      return this.formatDate(this.bookingStore.checkInDate)
    },
    formattedCheckOutDate() {
      return this.formatDate(this.bookingStore.checkOutDate)
    },
    totalNights() {
      if (!this.bookingStore.checkInDate || !this.bookingStore.checkOutDate) {
        return 0
      }
      
      const checkIn = new Date(this.bookingStore.checkInDate)
      const checkOut = new Date(this.bookingStore.checkOutDate)
      
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        return 0
      }
      
      const timeDiff = checkOut.getTime() - checkIn.getTime()
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      return nights > 0 ? nights : 0
    }
  },
  created() {
    // Initialize booking details from booking store
    this.bookingDetails.checkInDate = this.bookingStore.checkInDate || ''
    this.bookingDetails.checkOutDate = this.bookingStore.checkOutDate || ''
    this.bookingDetails.guests = this.bookingStore.guests || '1 Adult'
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      
      const options = { month: 'short', day: 'numeric', year: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    },
    
    applyFilters(rooms) {
      if (!rooms) return []
      
      return rooms.filter(room => {
        // Filter by price range
        if (this.filters.priceRange !== 'Any Price') {
          const [min, max] = this.getPriceRange(this.filters.priceRange)
          if (room.price < min || (max && room.price > max)) {
            return false
          }
        }
        
        // Filter by room type
        if (this.filters.roomTypes.length > 0) {
          const roomTypeMatches = this.filters.roomTypes.some(type => {
            if (type === 'Single Room' && room.name.includes('Single')) return true
            if (type === 'Double Room' && room.name.includes('Double')) return true
            if (type === 'Triple Room' && room.name.includes('Triple')) return true
            if (type === 'Suite' && room.name.includes('Suite')) return true
            return false
          })
          
          if (!roomTypeMatches) return false
        }
        
        // Filter by amenities
        if (this.filters.amenities.length > 0) {
          const amenityMatches = this.filters.amenities.every(amenity => {
            return room.features.some(feature => feature.includes(amenity))
          })
          
          if (!amenityMatches) return false
        }
        
        return true
      })
    },
    
    getPriceRange(rangeString) {
      switch (rangeString) {
        case '$0 - $200': return [0, 200]
        case '$200 - $400': return [200, 400]
        case '$400 - $600': return [400, 600]
        case '$600+': return [600, null]
        default: return [0, null]
      }
    },
    
    toggleRoomType(type) {
      const index = this.filters.roomTypes.indexOf(type)
      if (index === -1) {
        this.filters.roomTypes.push(type)
      } else {
        this.filters.roomTypes.splice(index, 1)
      }
    },
    
    toggleAmenity(amenity) {
      const index = this.filters.amenities.indexOf(amenity)
      if (index === -1) {
        this.filters.amenities.push(amenity)
      } else {
        this.filters.amenities.splice(index, 1)
      }
    },
    
    applyAllFilters() {
      // In a real app, this might make an API call with the filters
      console.log('Applying filters:', this.filters)
    },
    
    resetFilters() {
      this.filters = {
        priceRange: 'Any Price',
        roomTypes: [],
        amenities: []
      }
    },
    
    modifySearch() {
      // Navigate back to the search form or open a modal to modify search
      this.$router.push('/')
    },
    
    selectRoom(roomId) {
      this.selectedRoomId = roomId
      this.showBookingModal = true
      
      // Initialize booking details
      this.bookingDetails.checkInDate = this.bookingStore.checkInDate
      this.bookingDetails.checkOutDate = this.bookingStore.checkOutDate
      this.bookingDetails.guests = this.bookingStore.guests
    },
    
    async bookRoom() {
      this.bookingInProgress = true
      try {
        // Update booking store with latest details
        this.bookingStore.setCheckInDate(this.bookingDetails.checkInDate)
        this.bookingStore.setCheckOutDate(this.bookingDetails.checkOutDate)
        this.bookingStore.setGuests(this.bookingDetails.guests)
        
        // Book the room using the rooms store
        const result = await this.roomsStore.bookRoom(this.selectedRoomId, this.bookingDetails)
        this.bookingResult = result
        
        if (result.success) {
          // Select the room in the booking store
          this.bookingStore.selectRoom(result.room)
        }
      } catch (error) {
        console.error('Error booking room:', error)
        this.bookingResult = {
          success: false,
          message: error.message || 'An error occurred while booking the room'
        }
      } finally {
        this.bookingInProgress = false
      }
    },
    
    closeBookingModal() {
      this.showBookingModal = false
      this.selectedRoomId = null
      this.bookingResult = null
    },
    
    selectAlternativeRoom(roomId) {
      // Reset booking result
      this.bookingResult = null
      
      // Select the alternative room
      this.selectedRoomId = roomId
      
      // Get the room details from the store
      const room = this.roomsStore.selectRoom(roomId)
      
      if (!room) {
        console.error('Failed to select alternative room with ID:', roomId)
        return
      }
      
      console.log('Selected alternative room:', room.name)
      
      // Keep the same booking details (dates, guests, etc.)
      // but update the selected room
    },
    
    sortRoomsByPrice(order) {
      this.sortOrder = order
      // Sorting is handled in the computed property
    },
    
    calculateTotalPrice(room) {
      return (room.price * this.totalNights).toFixed(2)
    },
    
    viewRoomDetails(roomId) {
      // Navigate to room details page
      this.$router.push(`/room/${roomId}`)
    }
  }
}
</script>

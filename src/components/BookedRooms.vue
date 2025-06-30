<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Your Bookings</h1>
          <p class="text-gray-600">View and manage all your room bookings</p>
        </div>
        
        <!-- Success Message (shown when redirected from booking) -->
        <div v-if="showSuccessMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <div class="bg-green-100 rounded-full p-2 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Booking Confirmed!</h3>
            <p class="text-gray-600">Your room has been successfully booked.</p>
          </div>
          <button @click="showSuccessMessage = false" class="ml-auto text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- No Bookings State -->
        <div v-if="!bookings.length" class="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 class="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h2>
          <p class="text-gray-500 mb-6">You haven't made any bookings yet. Explore our rooms and book your stay!</p>
          <button @click="goToRooms" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Browse Rooms
          </button>
        </div>
        
        <!-- Bookings List -->
        <div v-else>
          <!-- Filter Controls -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
            <div class="flex-grow">
              <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select 
                id="status-filter"
                v-model="statusFilter"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="flex-grow">
              <label for="sort-by" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select 
                id="sort-by"
                v-model="sortBy"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="checkin-asc">Check-in Date (Ascending)</option>
                <option value="checkin-desc">Check-in Date (Descending)</option>
              </select>
            </div>
          </div>
          
          <!-- Bookings Cards -->
          <div class="space-y-6">
            <div 
              v-for="booking in filteredBookings" 
              :key="booking.bookingId" 
              class="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div class="p-6 flex flex-col md:flex-row gap-6">
                <!-- Room Image -->
                <div class="md:w-1/4">
                  <img 
                    :src="getRoomImage(booking.roomId)" 
                    :alt="getRoomName(booking.roomId)" 
                    class="w-full h-48 object-cover rounded-lg"
                  >
                </div>
                
                <!-- Booking Details -->
                <div class="md:w-3/4">
                  <div class="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h2 class="text-xl font-bold text-gray-800">{{ getRoomName(booking.roomId) }}</h2>
                      <p class="text-gray-600">Booking ID: {{ booking.bookingId }}</p>
                    </div>
                    <div>
                      <span 
                        :class="{
                          'bg-green-100 text-green-800': booking.status === 'confirmed',
                          'bg-blue-100 text-blue-800': booking.status === 'completed',
                          'bg-red-100 text-red-800': booking.status === 'cancelled'
                        }"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ booking.status }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Check-in</h3>
                      <p class="text-gray-800">{{ formatDate(booking.checkInDate) }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Check-out</h3>
                      <p class="text-gray-800">{{ formatDate(booking.checkOutDate) }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Guests</h3>
                      <p class="text-gray-800">{{ booking.guests }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Booking Date</h3>
                      <p class="text-gray-800">{{ formatDate(booking.bookingDate) }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Total Amount</h3>
                      <p class="text-gray-800 font-semibold">${{ calculateTotalPrice(booking) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap gap-3 mt-4">
                    <button 
                      v-if="booking.status === 'confirmed'"
                      @click="cancelBooking(booking)" 
                      class="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomsStore } from '../stores/rooms'

export default {
  name: 'BookedRooms',
  setup() {
    const router = useRouter()
    const roomsStore = useRoomsStore()
    
    const bookings = ref([])
    const statusFilter = ref('all')
    const sortBy = ref('date-desc')
    const showSuccessMessage = ref(false)
    
    onMounted(() => {
      loadBookings()
      
      // Check if we're coming from a new booking
      const fromBooking = router.currentRoute.value.query.newBooking === 'true'
      if (fromBooking) {
        showSuccessMessage.value = true
        // Auto-hide the message after 5 seconds
        setTimeout(() => {
          showSuccessMessage.value = false
        }, 5000)
      }
    })
    
    const loadBookings = () => {
      try {
        const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
        bookings.value = bookingHistory
      } catch (error) {
        console.error('Error loading bookings:', error)
        bookings.value = []
      }
    }
    
    const filteredBookings = computed(() => {
      let result = [...bookings.value]
      
      // Apply status filter
      if (statusFilter.value !== 'all') {
        result = result.filter(booking => booking.status === statusFilter.value)
      }
      
      // Apply sorting
      switch (sortBy.value) {
        case 'date-asc':
          result.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
          break
        case 'date-desc':
          result.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
          break
        case 'checkin-asc':
          result.sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate))
          break
        case 'checkin-desc':
          result.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
          break
      }
      
      return result
    })
    
    const getRoomName = (roomId) => {
      const room = roomsStore.roomById(parseInt(roomId))
      return room ? room.name : 'Unknown Room'
    }
    
    const getRoomImage = (roomId) => {
      const room = roomsStore.roomById(parseInt(roomId))
      return room ? room.image : 'https://via.placeholder.com/300x200?text=Room+Image+Not+Available'
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    
    const calculateTotalPrice = (booking) => {
      if (!booking || !booking.roomId) return '0.00'
      
      const room = roomsStore.roomById(parseInt(booking.roomId))
      if (!room) return '0.00'
      
      // Calculate nights
      const checkIn = new Date(booking.checkInDate)
      const checkOut = new Date(booking.checkOutDate)
      
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        return '0.00'
      }
      
      const timeDiff = checkOut.getTime() - checkIn.getTime()
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      if (nights <= 0) return '0.00'
      
      // Calculate room price + 10% tax
      const total = room.price * nights * 1.1
      return total.toFixed(2)
    }
    
    const viewBookingDetails = (booking) => {
      // Show details of the selected booking in a modal or expand the current row
      // For now, we'll just update the booking in localStorage
      const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
      const updatedHistory = bookingHistory.map(b => 
        b.bookingId === booking.bookingId ? booking : b
      )
      localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory))
      
      // Show details in an alert for now (this could be improved with a modal)
      alert(`Booking Details:\n\nBooking ID: ${booking.bookingId}\nRoom: ${getRoomName(booking.roomId)}\nCheck-in: ${formatDate(booking.checkInDate)}\nCheck-out: ${formatDate(booking.checkOutDate)}\nGuests: ${booking.guests}\nStatus: ${booking.status}\nTotal: $${calculateTotalPrice(booking)}`)
    }
    
    const cancelBooking = (booking) => {
      if (confirm('Are you sure you want to cancel this booking?')) {
        // Update booking status in localStorage
        const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
        const updatedHistory = bookingHistory.map(b => {
          if (b.bookingId === booking.bookingId) {
            return { ...b, status: 'cancelled' }
          }
          return b
        })
        
        localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory))
        
        // Make the room available again
        const room = roomsStore.roomById(parseInt(booking.roomId))
        if (room) {
          roomsStore.updateRoom(room.id, { available: true })
        }
        
        // Reload bookings
        loadBookings()
        
        alert('Booking cancelled successfully.')
      }
    }
    
    const goToRooms = () => {
      router.push('/rooms')
    }
    
    return {
      bookings,
      filteredBookings,
      statusFilter,
      sortBy,
      showSuccessMessage,
      getRoomName,
      getRoomImage,
      formatDate,
      calculateTotalPrice,
      viewBookingDetails,
      cancelBooking,
      goToRooms
    }
  }
}
</script>

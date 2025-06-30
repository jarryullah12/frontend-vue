<template>
  <div class="bg-white min-h-screen">
    <div class="container mx-auto px-4 py-12">
      <!-- Success Message -->
      <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 bg-green-50 border-b border-green-100">
          <div class="flex items-center">
            <div class="bg-green-100 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Booking Confirmed!</h1>
              <p class="text-gray-600">Your reservation has been successfully booked.</p>
            </div>
          </div>
        </div>
        
        <!-- Booking Details -->
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Booking Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Booking ID</h3>
              <p class="text-gray-800 font-semibold">{{ booking.bookingId }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Booking Date</h3>
              <p class="text-gray-800">{{ formatDate(booking.bookingDate) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Check-in Date</h3>
              <p class="text-gray-800">{{ formatDate(booking.checkInDate) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Check-out Date</h3>
              <p class="text-gray-800">{{ formatDate(booking.checkOutDate) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Guests</h3>
              <p class="text-gray-800">{{ booking.guests }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {{ booking.status }}
              </span>
            </div>
          </div>
          
          <!-- Room Details -->
          <div class="border-t border-gray-200 pt-6 mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Room Details</h2>
            
            <div v-if="room" class="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden">
              <div class="md:w-1/3">
                <img :src="room.image" :alt="room.name" class="w-full h-full object-cover">
              </div>
              <div class="p-6 md:w-2/3">
                <h3 class="text-lg font-bold text-gray-800 mb-2">{{ room.name }}</h3>
                <p class="text-gray-600 mb-4">{{ room.description }}</p>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Room Type</h4>
                    <p class="text-gray-800">{{ room.name }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Price per Night</h4>
                    <p class="text-gray-800">${{ room.price }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Capacity</h4>
                    <p class="text-gray-800">{{ room.capacity }} {{ room.capacity > 1 ? 'Persons' : 'Person' }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Bed Configuration</h4>
                    <p class="text-gray-800">{{ room.beds }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Payment Information -->
          <div class="border-t border-gray-200 pt-6 mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
            
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Room Charge ({{ booking.nights }} nights)</span>
                <span class="text-gray-800">${{ (room?.price * booking.nights).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Taxes & Fees (10%)</span>
                <span class="text-gray-800">${{ (room?.price * booking.nights * 0.1).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-bold pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span class="text-blue-600">${{ (room?.price * booking.nights * 1.1).toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm text-gray-700">Payment will be collected upon arrival. Please have your booking ID ready.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div class="border-t border-gray-200 pt-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p class="text-gray-800">{{ booking.invoiceEmail }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Billing Address</h3>
                <p class="text-gray-800">{{ booking.billingAddress || 'Not provided' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="p-6 bg-gray-50 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <button @click="printConfirmation" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Confirmation
            </button>
            <button @click="viewAllBookings" class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Bookings
            </button>
            <button @click="goHome" class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return to Home
            </button>
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
  name: 'BookingConfirmation',
  setup() {
    const router = useRouter()
    const roomsStore = useRoomsStore()
    
    const booking = ref(null)
    const room = ref(null)
    
    onMounted(() => {
      // Get the latest booking from localStorage
      try {
        const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
        if (bookingHistory.length > 0) {
          booking.value = bookingHistory[bookingHistory.length - 1]
          
          // Get room details
          if (booking.value && booking.value.roomId) {
            room.value = roomsStore.roomById(parseInt(booking.value.roomId))
          }
          
          // Calculate nights
          if (booking.value.checkInDate && booking.value.checkOutDate) {
            const checkIn = new Date(booking.value.checkInDate)
            const checkOut = new Date(booking.value.checkOutDate)
            const timeDiff = checkOut.getTime() - checkIn.getTime()
            booking.value.nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
          } else {
            booking.value.nights = 1
          }
        } else {
          // No booking found, redirect to home
          router.push('/')
        }
      } catch (error) {
        console.error('Error loading booking data:', error)
        router.push('/')
      }
    })
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    
    const printConfirmation = () => {
      window.print()
    }
    
    const viewAllBookings = () => {
      router.push('/booked-rooms')
    }
    
    const goHome = () => {
      router.push('/')
    }
    
    return {
      booking,
      room,
      formatDate,
      printConfirmation,
      viewAllBookings,
      goHome
    }
  }
}
</script>

<style>
@media print {
  button {
    display: none !important;
  }
}
</style>

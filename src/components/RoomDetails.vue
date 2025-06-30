<template>
  <div class="bg-white">
    <!-- Back Button -->
    <div class="container mx-auto px-4 py-6">
      <button @click="goBack" class="flex items-center text-blue-600 hover:text-blue-800 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Rooms
      </button>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-4 text-gray-600">Loading room details...</p>
    </div>
    
    <!-- Room Not Found -->
    <div v-else-if="!room" class="container mx-auto px-4 py-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-2xl font-bold text-gray-700 mt-4">Room Not Found</h2>
      <p class="text-gray-600 mt-2">Sorry, we couldn't find the room you're looking for.</p>
      <button @click="goBack" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Return to Rooms
      </button>
    </div>
    
    <!-- Room Details -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Room Header -->
      <div class="mb-8">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <h1 class="text-3xl font-bold text-gray-800">{{ room.name }}</h1>
          <div class="flex items-center">
            <span v-if="room.available" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Available</span>
            <span v-else class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Unavailable</span>
            <span class="ml-4 text-2xl font-bold text-blue-600">${{ room.price }}</span>
            <span class="text-gray-500 text-sm">/night</span>
          </div>
        </div>
        <div class="flex flex-wrap items-center text-gray-600 text-sm">
          <div class="flex items-center mr-6 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Hotel Center</span>
          </div>
          <div class="flex items-center mr-6 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ room.capacity || 2 }} Guests</span>
          </div>
          <div class="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{{ room.beds }}</span>
          </div>
        </div>
      </div>
      
      <!-- Room Images -->
      <div class="mb-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <img :src="room.image" :alt="room.name" class="w-full h-96 object-cover rounded-lg shadow-md">
          </div>
          <div v-for="(image, index) in additionalImages" :key="index" class="h-48">
            <img :src="image" :alt="`${room.name} - Image ${index + 2}`" class="w-full h-full object-cover rounded-lg shadow-sm">
          </div>
        </div>
      </div>
      
      <!-- Room Description and Features -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Room Description</h2>
            <p class="text-gray-600">{{ room.description }}</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Room Amenities</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(amenity, index) in room.amenities" :key="index" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">{{ amenity }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Booking Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Book This Room</h2>
            
            <div class="border-b border-gray-200 pb-4 mb-4">
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Price per night</span>
                <span class="font-semibold">${{ room.price }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Taxes & fees</span>
                <span class="font-semibold">${{ (room.price * 0.1).toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="mb-6">
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Check In</label>
                  <input 
                    type="date" 
                    v-model="bookingDetails.checkInDate"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Check Out</label>
                  <input 
                    type="date" 
                    v-model="bookingDetails.checkOutDate"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-medium mb-2">Guests</label>
                <select 
                  v-model="bookingDetails.guests"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults, 1 Child</option>
                  <option>2 Adults, 2 Children</option>
                </select>
              </div>
              
              <!-- Invoice Information -->
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-medium mb-2">Invoice Details</label>
                <div class="border border-gray-200 rounded-md p-3 hover:border-blue-300 transition duration-200">
                  <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email for Invoice*</label>
                    <input 
                      type="email" 
                      v-model="bookingDetails.invoiceEmail"
                      placeholder="your.email@example.com"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      v-model="bookingDetails.phoneNumber"
                      placeholder="Enter your phone number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-between items-center bg-blue-50 p-4 rounded-lg mb-6">
              <span class="font-bold text-gray-800">Total</span>
              <span class="text-xl font-bold text-blue-600">${{ calculateTotalPrice() }}</span>
            </div>
            
            <button 
              @click="bookNow" 
              :disabled="!room.available || !bookingDetails.checkInDate || !bookingDetails.checkOutDate"
              class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Book Now
            </button>
            
            <p v-if="!room.available" class="text-red-600 text-sm mt-2 text-center">
              This room is currently unavailable. Please check back later or select another room.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Room Policies -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-10">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Room Policies</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Check-in & Check-out</h3>
            <ul class="text-gray-600 space-y-2">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Check-in time: 2:00 PM - 12:00 AM</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Check-out time: 12:00 PM</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Early check-in and late check-out available upon request (additional charges may apply)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Cancellation Policy</h3>
            <ul class="text-gray-600 space-y-2">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Free cancellation up to 24 hours before check-in</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Cancellations made less than 24 hours before check-in are subject to a one-night charge</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No-shows will be charged the full amount of the reservation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Similar Rooms -->
      <div class="mb-10">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Similar Rooms You May Like</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="similarRoom in similarRooms" :key="similarRoom.id" class="bg-white rounded-lg shadow-sm overflow-hidden">
            <img :src="similarRoom.image" :alt="similarRoom.name" class="w-full h-48 object-cover">
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ similarRoom.name }}</h3>
              <div class="flex items-center text-gray-600 text-sm mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ similarRoom.capacity || 2 }} Guests</span>
                <span class="mx-2">•</span>
                <span>{{ similarRoom.beds }}</span>
              </div>
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-lg font-bold text-blue-600">${{ similarRoom.price }}</span>
                  <span class="text-gray-500 text-sm">/night</span>
                </div>
                <button 
                  @click="viewRoom(similarRoom.id)" 
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useRoomsStore } from '../stores/rooms'
import { useBookingStore } from '../stores/booking'

export default {
  name: 'RoomDetails',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const roomsStore = useRoomsStore()
    const bookingStore = useBookingStore()
    
    const loading = ref(true)
    const roomId = parseInt(route.params.id)
    
    const bookingDetails = ref({
      checkInDate: '',
      checkOutDate: '',
      guests: '2 Adults',
      specialRequests: '',
      invoiceEmail: '',
      phoneNumber: ''
    })
    
    // Get room details
    const room = computed(() => {
      return roomsStore.roomById(roomId)
    })
    
    // Get similar rooms
    const similarRooms = computed(() => {
      if (!room.value) return []
      
      return roomsStore.rooms
        .filter(r => r.id !== roomId && r.available)
        .sort((a, b) => {
          // Sort by price similarity
          return Math.abs(a.price - room.value.price) - Math.abs(b.price - room.value.price)
        })
        .slice(0, 3)
    })
    
    // Additional room images
    const additionalImages = computed(() => {
      if (!room.value) return []
      
      const images = []
      
      // Add imageTwo if it exists
      if (room.value.imageTwo && room.value.imageTwo.trim() !== '') {
        images.push(room.value.imageTwo)
      }
      
      // Add imageThree if it exists
      if (room.value.imageThree && room.value.imageThree.trim() !== '') {
        images.push(room.value.imageThree)
      }
      
      // If no additional images are found, use the default image with different crop parameters
      if (images.length === 0) {
        const baseImage = room.value.image.split('?')[0]
        return [
          `${baseImage}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80`,
          `${baseImage}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80`
        ]
      }
      
      return images
    })
    
    onMounted(() => {
      // Initialize booking details from booking store if available
      if (bookingStore.checkInDate) {
        bookingDetails.value.checkInDate = bookingStore.checkInDate
      } else {
        // Set default check-in date to tomorrow
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        bookingDetails.value.checkInDate = formatDateForInput(tomorrow)
      }
      
      if (bookingStore.checkOutDate) {
        bookingDetails.value.checkOutDate = bookingStore.checkOutDate
      } else {
        // Set default check-out date to 3 days from tomorrow
        const checkoutDate = new Date()
        checkoutDate.setDate(checkoutDate.getDate() + 3)
        bookingDetails.value.checkOutDate = formatDateForInput(checkoutDate)
      }
      
      if (bookingStore.guests) {
        bookingDetails.value.guests = bookingStore.guests
      }
      
      // Simulate loading
      setTimeout(() => {
        loading.value = false
      }, 500)
    })
    
    const calculateTotalPrice = () => {
      if (!room.value || !bookingDetails.value.checkInDate || !bookingDetails.value.checkOutDate) {
        return '0.00'
      }
      
      const checkIn = new Date(bookingDetails.value.checkInDate)
      const checkOut = new Date(bookingDetails.value.checkOutDate)
      
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        return '0.00'
      }
      
      const timeDiff = checkOut.getTime() - checkIn.getTime()
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      if (nights <= 0) return '0.00'
      
      // Calculate room price + 10% tax
      const total = room.value.price * nights * 1.1
      return total.toFixed(2)
    }
    
    const formatDateForInput = (date) => {
      return date.toISOString().split('T')[0]
    }
    
    // Cash on Arrival is the only payment method now
    
    const bookNow = async () => {
      if (!room.value || !room.value.available) return
      
      // Update booking store with latest details
      bookingStore.setCheckInDate(bookingDetails.value.checkInDate)
      bookingStore.setCheckOutDate(bookingDetails.value.checkOutDate)
      bookingStore.setGuests(bookingDetails.value.guests)
      
      // Save invoice information
      bookingStore.setInvoiceDetails({
        invoiceEmail: bookingDetails.value.invoiceEmail,
        phoneNumber: bookingDetails.value.phoneNumber
      })
      
      // Create booking data object
      const bookingData = {
        roomId: roomId,
        checkInDate: bookingDetails.value.checkInDate,
        checkOutDate: bookingDetails.value.checkOutDate,
        guests: bookingDetails.value.guests,
        invoiceEmail: bookingDetails.value.invoiceEmail,
        phoneNumber: bookingDetails.value.phoneNumber,
        specialRequests: bookingDetails.value.specialRequests || ''
      }
      
      // Confirm booking using the rooms store
      const result = await roomsStore.confirmBooking(bookingData)
      
      if (result.success) {
        // Redirect to booked rooms page with query parameter to show success message
        router.push({ path: '/booked-rooms', query: { newBooking: 'true' } })
      } else {
        // Show error message
        alert(`Booking failed: ${result.message}`)
      }
    }
    
    const viewRoom = (id) => {
      router.push(`/room/${id}`)
    }
    
    const goBack = () => {
      router.back()
    }
    
    return {
      room,
      loading,
      bookingDetails,
      similarRooms,
      additionalImages,
      calculateTotalPrice,
      formatDateForInput,
      bookNow,
      viewRoom,
      goBack
    }
  }
}
</script>

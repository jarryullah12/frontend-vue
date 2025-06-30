<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-screen bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80');">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-800/50"></div>
      <div class="absolute inset-0 flex flex-col justify-center px-4 md:px-12">
        <div class="container mx-auto">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Experience Luxury <br>Like Never Before</h1>
          <p class="text-xl text-white mb-8">Discover the perfect blend of comfort, elegance, and exceptional service.</p>
          <div class="flex flex-wrap gap-4">
            <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full transition duration-300">Book Your Stay</button>
            <button class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-blue-800 transition duration-300">Explore Rooms</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking Form -->
    <section class="relative z-10 bg-white shadow-lg rounded-lg mx-4 md:mx-auto -mt-20 max-w-6xl">
      <div class="grid grid-cols-1 md:grid-cols-4">
        <div class="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
          <h3 class="font-semibold mb-2">Check In</h3>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input type="date" class="w-full outline-none" v-model="checkInDate">
          </div>
        </div>
        <div class="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
          <h3 class="font-semibold mb-2">Check Out</h3>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input type="date" class="w-full outline-none" v-model="checkOutDate">
          </div>
        </div>
        <div class="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
          <h3 class="font-semibold mb-2">Guests</h3>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <select class="w-full outline-none" v-model="guests">
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>2 Adults, 1 Child</option>
              <option>2 Adults, 2 Children</option>
            </select>
          </div>
        </div>
        <div @click="checkAvailability" class="p-4 md:p-6 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 cursor-pointer transition duration-300">
          <span class="font-semibold">{{ loading ? 'Checking...' : 'Check Availability' }}</span>
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="animate-spin h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>
    </section>

    <!-- Availability Results Section -->
    <section v-if="showAvailabilityResults" class="py-8 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold mb-2">Available Rooms</h2>
          <p class="text-gray-600">For {{ guests }} • {{ numberOfNights }} {{ numberOfNights === 1 ? 'night' : 'nights' }} • {{ checkInDate }} to {{ checkOutDate }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="room in availableRooms" :key="room.id" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <img :src="`https://source.unsplash.com/random/300x200/?hotel,room,${room.id}`" alt="Room Image" class="w-full h-48 object-cover">
              <div v-if="!room.available" class="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">Not Available</div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ room.name }}</h3>
              <p class="text-gray-600 mb-4">Experience comfort and luxury in our beautifully designed room.</p>
              
              <div class="flex justify-between items-center mb-4">
                <div class="text-2xl font-bold text-blue-600">${{ room.price }}<span class="text-sm text-gray-500">/night</span></div>
                <div class="text-lg font-semibold">${{ room.price * numberOfNights }} total</div>
              </div>
              
              <button 
                @click="selectRoom(room)" 
                :disabled="!room.available" 
                :class="{
                  'w-full py-2 px-4 rounded-lg font-semibold': true,
                  'bg-blue-600 text-white hover:bg-blue-700': room.available,
                  'bg-gray-300 text-gray-500 cursor-not-allowed': !room.available
                }">
                {{ room.available ? 'Select Room' : 'Unavailable' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-8 text-center">
          <button @click="resetBooking" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-300">
            Reset Search
          </button>
        </div>
      </div>
    </section>

    <!-- Welcome Section -->
    <section class="py-16 mt-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold mb-6">Welcome to Luxury Hotel Resort</h2>
            <p class="text-gray-600 mb-6">Experience the ultimate in comfort and luxury at our 5-star hotel. Nestled in a prime location, our hotel offers breathtaking views, world-class amenities, and exceptional service that will make your stay truly unforgettable.</p>
            <p class="text-gray-600 mb-6">Whether you're traveling for business or pleasure, our dedicated staff is committed to ensuring your complete satisfaction. From our elegant rooms and suites to our gourmet restaurants and spa facilities, every aspect of our hotel is designed to provide you with an extraordinary experience.</p>
            <div class="flex space-x-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600">150+</div>
                <div class="text-gray-600">Luxury Rooms</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600">15+</div>
                <div class="text-gray-600">Years Experience</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600">24/7</div>
                <div class="text-gray-600">Customer Service</div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Lobby" class="rounded-lg w-full h-48 object-cover">
            <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Room" class="rounded-lg w-full h-48 object-cover">
            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Pool" class="rounded-lg w-full h-48 object-cover">
            <img src="https://images.unsplash.com/photo-1534679541758-8dc76ff8081d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt="Hotel Restaurant" class="rounded-lg w-full h-48 object-cover">
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-blue-500 text-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-2">Why Choose Us</h2>
          <p class="text-blue-100">Discover the amazing features that set us apart</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div class="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-center mb-2">Luxury Rooms</h3>
            <p class="text-center text-blue-100">Experience the epitome of luxury in our meticulously designed rooms and suites, featuring premium amenities and stunning views.</p>
          </div>
          
          <div class="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div class="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-center mb-2">Fine Dining</h3>
            <p class="text-center text-blue-100">Indulge in exquisite culinary delights at our award-winning restaurants, offering a diverse range of international cuisines prepared by top chefs.</p>
          </div>
          
          <div class="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div class="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-center mb-2">Exceptional Service</h3>
            <p class="text-center text-blue-100">Our dedicated staff is committed to providing personalized service that exceeds expectations, ensuring a memorable stay for every guest.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Available Rooms Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <div class="flex justify-center items-center gap-1 mb-2">
            <div class="w-1 h-1 rounded-full bg-blue-600"></div>
            <div class="w-1 h-1 rounded-full bg-blue-600"></div>
            <div class="w-1 h-1 rounded-full bg-blue-600"></div>
            <div class="w-1 h-1 rounded-full bg-blue-600"></div>
            <div class="w-1 h-1 rounded-full bg-blue-600"></div>
          </div>
          <h2 class="text-3xl font-bold mb-2">Rooms & Suites</h2>
          <p class="text-gray-600">Experience luxury accommodations with stunning views and premium amenities</p>
          <div class="w-16 h-1 bg-blue-600 mx-auto mt-4"></div>
        </div>
        
        <!-- Room Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div class="overflow-hidden rounded-lg">
            <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt="Standard Single Room" class="w-full h-full object-cover">
          </div>
          
          <div class="flex flex-col justify-between">
            <div>
              <h3 class="text-2xl font-bold mb-2">Standard Single Room</h3>
              <p class="text-gray-600 mb-4">Cozy single room that's perfect for solo travelers. Large bright space with a beautiful view.</p>
              
              <div class="grid grid-cols-2 gap-2 mb-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sleeps 1</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Single Bed</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>15m²</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free WiFi</span>
                </div>
              </div>
              
              <div class="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-600">Amenities: Air conditioning, TV, Hairdryer, Safe, Mini-fridge</span>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <div>
                  <span class="text-2xl font-bold">$99</span>
                  <span class="text-gray-600">/night (Taxes and Fees)</span>
                </div>
                <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition duration-300">
                  Book Now
                </button>
              </div>
              <a href="#" class="text-blue-600 text-sm hover:underline">View Details</a>
            </div>
          </div>
        </div>
        
        <!-- More room cards would go here -->
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 bg-gray-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-2">What Our Guests Say</h2>
          <p class="text-gray-600">Read testimonials from our satisfied guests</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Testimonials would go here -->
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-2">Our Location</h2>
          <p class="text-gray-600">Find us at the heart of the city</p>
        </div>
        
        <div class="bg-gray-200 h-96 rounded-lg overflow-hidden">
          <!-- Map would go here -->
          <div class="h-full w-full flex items-center justify-center">
            <p class="text-gray-500">Interactive Map Loading...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking Confirmation Modal -->
    <div v-if="bookingStore.selectedRoom" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Confirm Your Booking</h3>
          <button @click="resetBooking" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border-t border-b border-gray-200 py-4 mb-4">
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Room:</span>
            <span class="font-semibold">{{ bookingStore.selectedRoom.name }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Check-in:</span>
            <span class="font-semibold">{{ checkInDate }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Check-out:</span>
            <span class="font-semibold">{{ checkOutDate }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Guests:</span>
            <span class="font-semibold">{{ guests }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Nights:</span>
            <span class="font-semibold">{{ numberOfNights }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold mt-4">
            <span>Total:</span>
            <span>${{ bookingStore.selectedRoom.price * numberOfNights }}</span>
          </div>
        </div>
        
        <div class="flex gap-4">
          <button @click="resetBooking" class="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition duration-300">
            Cancel
          </button>
          <button @click="confirmBooking" class="flex-1 py-2 px-4 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300">
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useBookingStore } from '../stores/booking'

export default {
  name: 'HomePage',
  data() {
    return {
      loading: false,
      availableRooms: [],
      showAvailabilityResults: false
    }
  },
  computed: {
    bookingStore() {
      return useBookingStore()
    },
    checkInDate: {
      get() {
        return this.bookingStore.checkInDate
      },
      set(value) {
        this.bookingStore.setCheckInDate(value)
      }
    },
    checkOutDate: {
      get() {
        return this.bookingStore.checkOutDate
      },
      set(value) {
        this.bookingStore.setCheckOutDate(value)
      }
    },
    guests: {
      get() {
        return this.bookingStore.guests
      },
      set(value) {
        this.bookingStore.setGuests(value)
      }
    },
    numberOfNights() {
      return this.bookingStore.numberOfNights
    }
  },
  methods: {
    async checkAvailability() {
      this.loading = true
      try {
        const result = await this.bookingStore.checkAvailability()
        this.availableRooms = result.rooms
        this.showAvailabilityResults = true
        console.log('Available rooms:', this.availableRooms)
      } catch (error) {
        console.error('Error checking availability:', error)
      } finally {
        this.loading = false
      }
    },
    selectRoom(room) {
      this.bookingStore.selectRoom(room)
      console.log('Selected room:', room)
    },
    async confirmBooking() {
      try {
        const booking = await this.bookingStore.confirmBooking()
        alert(`Booking confirmed! Booking ID: ${booking.id}`)
        console.log('Booking confirmed:', booking)
      } catch (error) {
        alert(error.message || 'Error confirming booking')
        console.error('Error confirming booking:', error)
      }
    },
    resetBooking() {
      this.bookingStore.resetBooking()
      this.showAvailabilityResults = false
    }
  }
}
</script>

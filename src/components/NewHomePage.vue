<template>
  <div class="bg-white">
    <!-- Hero Section with Booking Form -->
    <div class="relative h-screen bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80');">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
        <h1 class="text-4xl md:text-6xl font-bold mb-4 text-center">Experience Luxury and Comfort</h1>
        <p class="text-xl md:text-2xl mb-8 text-center max-w-3xl">Discover the perfect blend of elegance and relaxation at our premium hotel</p>
        
        <!-- Booking Form -->
        <div class="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <div class="flex flex-col md:flex-row md:space-x-4">
            <div class="mb-4 md:mb-0 md:w-1/4">
              <label class="block text-gray-700 text-sm font-medium mb-2">Check In</label>
              <div class="relative">
                <input 
                  type="date" 
                  v-model="checkInDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
              </div>
            </div>
            <div class="mb-4 md:mb-0 md:w-1/4">
              <label class="block text-gray-700 text-sm font-medium mb-2">Check Out</label>
              <div class="relative">
                <input 
                  type="date" 
                  v-model="checkOutDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
              </div>
            </div>
            <div class="mb-4 md:mb-0 md:w-1/4">
              <label class="block text-gray-700 text-sm font-medium mb-2">Guests</label>
              <select 
                v-model="guests"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults, 1 Child</option>
                <option>2 Adults, 2 Children</option>
              </select>
            </div>
            <div class="md:w-1/4 flex items-end">
              <button 
                @click="checkAvailability"
                :disabled="loading"
                class="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
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
          
          <!-- Booking Summary (only shown when dates are selected) -->
          <div v-if="checkInDate && checkOutDate" class="mt-4 text-gray-700 text-sm">
            <p>Stay duration: <span class="font-semibold">{{ numberOfNights }} {{ numberOfNights === 1 ? 'night' : 'nights' }}</span></p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Welcome Section -->
    <div class="py-16 px-4">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <div class="flex items-center mb-2">
              <div class="w-12 h-0.5 bg-blue-800 mr-4"></div>
              <span class="text-blue-800 uppercase text-sm font-semibold tracking-wider">ABOUT OUR HOTEL</span>
            </div>
            <h2 class="text-3xl font-bold mb-6">Welcome to Luxury Hotel</h2>
            <p class="text-gray-600 mb-4">
              Nestled in the heart of the city, our hotel offers an unparalleled blend of elegance, comfort, and world-class service. With stunning views and meticulously designed spaces, we provide the perfect setting for both business and leisure travelers.
            </p>
            <p class="text-gray-600 mb-4">
              Our commitment to excellence is reflected in every detail, from the luxurious accommodations to the exquisite dining options and state-of-the-art facilities. Experience the epitome of hospitality as our dedicated staff ensures your stay exceeds all expectations.
            </p>
            <p class="text-gray-600">
              Whether you're visiting for a weekend getaway, a business trip, or a special celebration, Luxury Hotel promises an unforgettable experience that combines modern amenities with timeless sophistication.
            </p>
          </div>
          <div class="md:w-1/2 md:pl-12">
            <p class="text-gray-600 mb-4">
              At Luxury Hotel, we believe that true luxury lies in the details. Our rooms and suites are thoughtfully designed with premium furnishings, plush bedding, and cutting-edge technology to create a sanctuary of comfort and style.
            </p>
            <p class="text-gray-600 mb-4">
              Indulge in culinary delights at our award-winning restaurants, where our talented chefs craft exquisite dishes using the finest local and international ingredients. Unwind at our spa, where a range of treatments and therapies await to rejuvenate your body and mind.
            </p>
            <p class="text-gray-600 mb-4">
              Our prime location puts you within easy reach of the city's most iconic attractions, shopping districts, and business centers. Whether you're exploring the vibrant culture or attending important meetings, our concierge team is always ready to assist you in making the most of your stay.
            </p>
            <p class="text-gray-600">
              Experience the perfect blend of luxury, comfort, and convenience at Luxury Hotel – where every moment is crafted to create lasting memories.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Image Gallery Section -->
    <div class="py-16 px-4 bg-gray-50">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Luxury Pool" class="w-full h-96 object-cover rounded-lg shadow-md">
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Luxury Restaurant" class="w-full h-96 object-cover rounded-lg shadow-md">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Luxury Suites Section -->
    <div class="py-16 px-4">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <div class="flex items-center mb-2">
              <div class="w-12 h-0.5 bg-blue-800 mr-4"></div>
              <span class="text-blue-800 uppercase text-sm font-semibold tracking-wider">ACCOMMODATION</span>
            </div>
            <h2 class="text-3xl font-bold mb-6">Rooms & Luxury Suites</h2>
            <p class="text-gray-600 mb-4">
              Our elegant rooms and suites are designed with your comfort in mind, offering a perfect retreat after a day of exploration or business. Each space is thoughtfully appointed with premium amenities and stylish décor to ensure a memorable stay.
            </p>
            <p class="text-gray-600 mb-4">
              From cozy standard rooms to expansive luxury suites, we offer accommodations to suit every need and preference. Enjoy plush bedding, spacious bathrooms, and modern technology, all complemented by breathtaking views and impeccable service.
            </p>
            <p class="text-gray-600">
              Experience the perfect blend of comfort and sophistication in our meticulously designed spaces, where every detail has been carefully considered to enhance your stay and exceed your expectations.
            </p>
          </div>
          <div class="md:w-1/2 md:pl-12">
            <div class="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Room 1" class="w-full h-40 object-cover rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt="Room 2" class="w-full h-40 object-cover rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt="Room 3" class="w-full h-40 object-cover rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Room 4" class="w-full h-40 object-cover rounded-lg shadow-md">
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Room 5" class="w-full h-40 object-cover rounded-lg shadow-md">
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- History Section -->
    <div class="py-16 px-4 bg-gray-50">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <div class="flex items-center mb-2">
              <div class="w-12 h-0.5 bg-blue-800 mr-4"></div>
              <span class="text-blue-800 uppercase text-sm font-semibold tracking-wider">OUR STORY</span>
            </div>
            <h2 class="text-3xl font-bold mb-6">History of Luxury Hotel</h2>
            <p class="text-gray-600 mb-4">
              Founded in 1985, Luxury Hotel began as a visionary project to create an unparalleled hospitality experience in the heart of the city. What started as a boutique establishment has evolved into an iconic destination known for its exceptional service and timeless elegance.
            </p>
            <p class="text-gray-600 mb-4">
              Over the decades, we have welcomed distinguished guests from around the world, from business leaders and celebrities to families seeking a memorable getaway. Our commitment to excellence has earned us numerous accolades and the loyalty of guests who return year after year.
            </p>
            <button class="bg-blue-800 hover:bg-blue-900 text-white py-2 px-6 rounded-full transition duration-300 mt-4">
              Read More
            </button>
          </div>
          <div class="md:w-1/2 md:pl-12">
            <p class="text-gray-600 mb-4">
              The architecture of Luxury Hotel pays homage to the rich cultural heritage of the region while incorporating contemporary design elements. The original structure, designed by renowned architect James Wilson, has been thoughtfully expanded and renovated over the years to enhance its grandeur while preserving its historic charm.
            </p>
            <p class="text-gray-600 mb-4">
              Each renovation has been guided by our commitment to sustainability and innovation, ensuring that Luxury Hotel remains at the forefront of the hospitality industry while minimizing our environmental footprint. From energy-efficient systems to locally sourced materials, we strive to be responsible stewards of our resources.
            </p>
            <p class="text-gray-600 mb-4">
              Today, Luxury Hotel stands as a testament to our enduring dedication to creating exceptional experiences. As we look to the future, we remain committed to honoring our rich heritage while embracing new opportunities to elevate the art of hospitality.
            </p>
            <p class="text-gray-600">
              We invite you to become part of our continuing story and experience the legacy of luxury that defines our hotel.
            </p>
          </div>
        </div>
      </div>
    </div>
    

    

  </div>
</template>

<script>
import { useBookingStore } from '../stores/booking'

export default {
  name: 'NewHomePage',
  data() {
    return {
      loading: false,
      showResults: false
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
        // Call the Pinia store action to check availability
        const result = await this.bookingStore.checkAvailability()
        this.showResults = true
        
        // Navigate to search results page with query parameters
        this.$router.push({
          path: '/search',
          query: {
            checkIn: this.checkInDate,
            checkOut: this.checkOutDate,
            guests: this.guests
          }
        })
      } catch (error) {
        console.error('Error checking availability:', error)
      } finally {
        this.loading = false
      }
    },
    selectRoom(room) {
      this.bookingStore.selectRoom(room)
    },
    resetBookingForm() {
      // Reset only the form values, not the entire booking
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      this.bookingStore.setCheckInDate(today.toISOString().split('T')[0])
      this.bookingStore.setCheckOutDate(tomorrow.toISOString().split('T')[0])
      this.bookingStore.setGuests('1 Adult')
    }
  }
}
</script>

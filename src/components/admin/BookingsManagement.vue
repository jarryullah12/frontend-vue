<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Manage Bookings</h2>
      <div>
        <select 
          v-model="statusFilter" 
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Checked In">Checked In</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
    
    <!-- Bookings Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="booking in filteredBookings" :key="booking.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ booking.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ booking.guestName }}</div>
                <div class="text-sm text-gray-500">{{ booking.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ booking.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ booking.roomType }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(booking.checkIn) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(booking.checkOut) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ booking.total }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="getStatusClass(booking.status)" 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ booking.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewBookingDetails(booking)" 
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  View
                </button>
                <button 
                  v-if="booking.status === 'Pending' || booking.status === 'Confirmed'"
                  @click="confirmCancelBooking(booking)" 
                  class="text-red-600 hover:text-red-900"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty state -->
      <div v-if="filteredBookings.length === 0" class="text-center py-6 text-gray-500">
        No bookings found matching the selected filter
      </div>
    </div>
    
    <!-- Booking Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-700">Booking Details</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="selectedBooking" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Booking Information</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-gray-500 w-32">Booking ID:</span>
                  <span class="font-medium">{{ selectedBooking.id }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-500 w-32">Status:</span>
                  <span 
                    :class="getStatusClass(selectedBooking.status)" 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ selectedBooking.status }}
                  </span>
                </div>
                <div class="flex">
                  <span class="text-gray-500 w-32">Created:</span>
                  <span>{{ formatDate(selectedBooking.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Guest Information</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-gray-500 w-32">Name:</span>
                  <span>{{ selectedBooking.guestName }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-500 w-32">Email:</span>
                  <span>{{ selectedBooking.email }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-500 w-32">Phone:</span>
                  <span class="font-medium">{{ selectedBooking.phone }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Room Information</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-gray-500 w-32">Room Type:</span>
                  <span>{{ selectedBooking.roomType }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-500 w-32">Room ID:</span>
                  <span>{{ selectedBooking.roomId }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Stay Information</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-gray-500 w-32">Check-in:</span>
                  <span>{{ formatDate(selectedBooking.checkIn) }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-500 w-32">Check-out:</span>
                  <span>{{ formatDate(selectedBooking.checkOut) }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-500 w-32">Nights:</span>
                  <span>{{ calculateNights(selectedBooking.checkIn, selectedBooking.checkOut) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <h4 class="font-medium text-gray-700 mb-2">Payment Information</h4>
            <div class="bg-gray-50 p-4 rounded">
              <div class="flex justify-between mb-2">
                <span>Room Rate (per night)</span>
                <span>${{ selectedBooking.roomRate }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Nights</span>
                <span>{{ calculateNights(selectedBooking.checkIn, selectedBooking.checkOut) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${{ selectedBooking.subtotal }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Tax</span>
                <span>${{ selectedBooking.tax }}</span>
              </div>
              <div class="flex justify-between font-medium">
                <span>Total</span>
                <span>${{ selectedBooking.total }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              v-if="selectedBooking.status === 'Confirmed'"
              @click="updateBookingStatus(selectedBooking.id, 'Checked In')" 
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Check In
            </button>
            <button 
              v-if="selectedBooking.status === 'Checked In'"
              @click="updateBookingStatus(selectedBooking.id, 'Completed')" 
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Check Out
            </button>
            <button 
              v-if="selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed'"
              @click="confirmCancelBooking(selectedBooking)" 
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Cancel Confirmation Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Confirm Cancellation</h3>
          <p class="text-gray-600">
            Are you sure you want to cancel booking #{{ bookingToCancel?.id }} for {{ bookingToCancel?.guestName }}?
            This action cannot be undone.
          </p>
        </div>
        <div class="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button 
            @click="showCancelModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            No, Keep Booking
          </button>
          <button 
            @click="cancelBooking" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoomsStore } from '../../stores/rooms';

// Bookings data
const bookings = ref([]);
const isLoading = ref(false);
const statusFilter = ref('all');

// Modal states
const showDetailsModal = ref(false);
const showCancelModal = ref(false);
const selectedBooking = ref(null);
const cancelReason = ref('');

// Get rooms store
const roomsStore = useRoomsStore();

// Helper function to get room by ID
function getRoomById(roomId) {
  return roomsStore.roomById(parseInt(roomId));
}

// Helper function to calculate nights between dates
function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return 1;
  }
  
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
}

// Helper function to calculate subtotal
function calculateSubtotal(booking, room) {
  if (!room) return 0;
  const nights = getNights(booking.checkInDate, booking.checkOutDate);
  return room.price * nights;
}

// Helper function to calculate tax (10%)
function calculateTax(booking, room) {
  const subtotal = calculateSubtotal(booking, room);
  return subtotal * 0.1;
}

// Helper function to calculate total
function calculateTotal(booking, room) {
  const subtotal = calculateSubtotal(booking, room);
  const tax = calculateTax(booking, room);
  return subtotal + tax;
}

// Load bookings on component mount
onMounted(() => {
  fetchBookings();
});

// Function to fetch bookings from localStorage
function fetchBookings() {
  isLoading.value = true;
  
  try {
    // First try to get bookings from bookingHistory (user bookings)
    let bookingHistory = localStorage.getItem('bookingHistory');
    
    if (bookingHistory) {
      // Parse booking history
      const parsedBookings = JSON.parse(bookingHistory);
      
      // Map the booking history to the format expected by the admin panel
      bookings.value = parsedBookings.map(booking => {
        // Get room details
        const room = getRoomById(booking.roomId);
        
        return {
          id: booking.bookingId || `BK-${Date.now()}`,
          guestName: booking.invoiceEmail ? booking.invoiceEmail.split('@')[0] : 'Guest',
          email: booking.invoiceEmail || 'guest@example.com',
          phone: booking.phoneNumber || 'Not provided',
          roomId: booking.roomId,
          roomType: room ? room.name : 'Unknown Room',
          roomRate: room ? room.price : 0,
          checkIn: new Date(booking.checkInDate),
          checkOut: new Date(booking.checkOutDate),
          createdAt: new Date(booking.bookingDate || Date.now()),
          subtotal: calculateSubtotal(booking, room),
          tax: calculateTax(booking, room),
          total: calculateTotal(booking, room),
          status: booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Confirmed'
        };
      });
    } else {
      // Fall back to the original bookings storage
      let storedBookings = localStorage.getItem('bookings');
      
      if (storedBookings) {
        // Parse stored bookings and convert date strings to Date objects
        const parsedBookings = JSON.parse(storedBookings);
        bookings.value = parsedBookings.map(booking => ({
          ...booking,
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
          createdAt: new Date(booking.createdAt || Date.now())
        }));
      } else {
        // Default bookings data if none in localStorage
        const defaultBookings = [
          {
            id: 'BK1683921',
            guestName: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1 (555) 123-4567',
            roomId: 2,
            roomType: 'Superior Double Room',
            roomRate: 149,
            checkIn: new Date('2025-05-15'),
            checkOut: new Date('2025-05-18'),
            createdAt: new Date('2025-05-01'),
            subtotal: 447,
            tax: 44.7,
            total: 491.7,
            status: 'Confirmed'
          }
        ];
        
        bookings.value = defaultBookings;
        
        // Save default bookings to localStorage
        saveBookingsToLocalStorage();
      }
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    bookings.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Save bookings to localStorage
function saveBookingsToLocalStorage() {
  localStorage.setItem('bookings', JSON.stringify(bookings.value));
}

// Filtered bookings based on status filter
const filteredBookings = computed(() => {
  if (statusFilter.value === 'all') {
    return bookings.value;
  }
  return bookings.value.filter(booking => booking.status === statusFilter.value);
});

// Format date to display
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Calculate number of nights between check-in and check-out
function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Get status badge class based on status
function getStatusClass(status) {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Checked In':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-gray-100 text-gray-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// View booking details
function viewBookingDetails(booking) {
  selectedBooking.value = booking;
  showDetailsModal.value = true;
}

// Confirm cancel booking
function confirmCancelBooking(booking) {
  bookingToCancel.value = booking;
  showCancelModal.value = true;
  
  // If details modal is open, close it
  if (showDetailsModal.value) {
    showDetailsModal.value = false;
  }
}

// Cancel booking
function cancelBooking() {
  if (!bookingToCancel.value) return;
  
  // Find booking in array and update status
  const index = bookings.value.findIndex(booking => booking.id === bookingToCancel.value.id);
  if (index !== -1) {
    bookings.value[index].status = 'Cancelled';
    
    // Save to localStorage
    saveBookingsToLocalStorage();
  }
  
  // Close modal
  showCancelModal.value = false;
  bookingToCancel.value = null;
}

// Update booking status
function updateBookingStatus(bookingId, newStatus) {
  // Find booking in array and update status
  const index = bookings.value.findIndex(booking => booking.id === bookingId);
  if (index !== -1) {
    bookings.value[index].status = newStatus;
    
    // Save to localStorage
    saveBookingsToLocalStorage();
  }
  
  // Close details modal
  showDetailsModal.value = false;
}


</script>

import { defineStore } from '../lib/pinia'

// Default rooms data to use if localStorage is empty
const defaultRooms = [
  {
    id: 1,
    name: 'Standard Single Room',
    description: 'Cozy single room perfect for solo travelers.',
    price: 99,
    capacity: 1,
    beds: '1 Single Bed',
    amenities: [
      'Free Wifi',
      'Room Service',
      'Complimentary Breakfast',
      'Air conditioning',
      'TV',
      'Hairdryer'
    ],
    features: [
      'City View',
      'Non-smoking',
      'Private Bathroom'
    ],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    available: true
  },
  {
    id: 2,
    name: 'Superior Double Room',
    description: 'Spacious room with a comfortable double bed.',
    price: 149,
    capacity: 2,
    beds: '1 Double Bed',
    amenities: [
      'Free Wifi',
      'Room Service',
      'Complimentary Breakfast',
      'Air conditioning',
      'TV',
      'Minibar',
      'Hairdryer'
    ],
    features: [
      'City View',
      'Non-smoking',
      'Private Bathroom',
      'Sitting Area'
    ],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    available: true
  },
  {
    id: 3,
    name: 'Classic Double Room',
    description: 'Elegant room with a comfortable double bed.',
    price: 129,
    capacity: 2,
    beds: '1 Double Bed',
    amenities: [
      'Free Wifi',
      'Room Service',
      'Complimentary Breakfast',
      'Air conditioning',
      'TV',
      'Hairdryer'
    ],
    features: [
      'Garden View',
      'Non-smoking',
      'Private Bathroom'
    ],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    available: true
  },
  {
    id: 4,
    name: 'Comfort Triple Room',
    description: 'Spacious room perfect for families or small groups.',
    price: 199,
    capacity: 3,
    beds: '1 Double Bed + 1 Single Bed',
    amenities: [
      'Free Wifi',
      'Room Service',
      'Complimentary Breakfast',
      'Air conditioning',
      'TV',
      'Minibar',
      'Hairdryer'
    ],
    features: [
      'City View',
      'Non-smoking',
      'Private Bathroom',
      'Sitting Area'
    ],
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1157&q=80',
    available: true
  }
];

// Function to get rooms from localStorage or use default data
function getRoomsFromLocalStorage() {
  try {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      return JSON.parse(storedRooms);
    }
    // If no rooms in localStorage, use default data and save it
    localStorage.setItem('rooms', JSON.stringify(defaultRooms));
    return defaultRooms;
  } catch (error) {
    console.error('Error loading rooms from localStorage:', error);
    return defaultRooms;
  }
}

// Function to save rooms to localStorage
function saveRoomsToLocalStorage(rooms) {
  try {
    localStorage.setItem('rooms', JSON.stringify(rooms));
    console.log('Rooms saved to localStorage');
    return true;
  } catch (error) {
    console.error('Error saving rooms to localStorage:', error);
    return false;
  }
}

export const useRoomsStore = defineStore('rooms', {
  // State
  state: () => ({
    bookingDetails: null,
    rooms: getRoomsFromLocalStorage(),
    selectedRoom: null,
    filters: {
      capacity: null,
      priceRange: { min: 0, max: 500 }
    }
  }),
  
  // Getters
  getters: {
    filteredRooms: (state) => {
      return state.rooms.filter(room => {
        // Filter by capacity
        if (state.filters.capacity && room.capacity < state.filters.capacity) {
          return false
        }
        
        // Filter by price range
        if (room.price < state.filters.priceRange.min || room.price > state.filters.priceRange.max) {
          return false
        }
        
        return true
      })
    },
    
    availableRooms: (state) => {
      return state.rooms.filter(room => room.available)
    },
    
    roomById: (state) => (id) => {
      return state.rooms.find(room => room.id === id)
    }
  },
  
  // Actions
  actions: {
    selectRoom(roomId) {
      const room = this.roomById(roomId)
      if (room) {
        this.selectedRoom = room
        return room
      }
      return null
    },
    
    bookRoom(roomId, bookingDetails) {
      const roomIndex = this.rooms.findIndex(room => room.id === roomId)
      
      // Check if room exists
      if (roomIndex === -1) {
        return {
          success: false,
          message: 'Room not found',
          errorCode: 'ROOM_NOT_FOUND'
        }
      }
      
      // Check if room is available
      if (!this.rooms[roomIndex].available) {
        // Find alternative rooms that are available
        const alternativeRooms = this.rooms
          .filter(room => room.id !== roomId && room.available)
          .sort((a, b) => {
            // Sort by price similarity to the requested room
            return Math.abs(a.price - this.rooms[roomIndex].price) - 
                   Math.abs(b.price - this.rooms[roomIndex].price)
          })
          .slice(0, 3) // Get top 3 alternatives
        
        return {
          success: false,
          message: 'This room is no longer available. Please select another room.',
          errorCode: 'ROOM_UNAVAILABLE',
          alternativeRooms: alternativeRooms.length > 0 ? alternativeRooms : null
        }
      }
      
      // In a real application, this would make an API call to book the room
      console.log('Booking room:', {
        room: this.rooms[roomIndex],
        details: bookingDetails
      })
      
      // Store the booking details in the state for the confirmation page
      this.bookingDetails = {
        ...bookingDetails,
        roomId: roomId,
        roomType: this.rooms[roomIndex].name,
        price: this.rooms[roomIndex].price
      }
      
      // For demo purposes, we'll mark the room as unavailable
      this.rooms[roomIndex].available = false
      
      // Save updated rooms to localStorage
      saveRoomsToLocalStorage(this.rooms)
      
      return {
        success: true,
        bookingId: 'BK' + Date.now(),
        room: this.rooms[roomIndex]
      }
    },
    
    // Add a new room to the store
    addRoom(roomData) {
      // Generate a new ID (in a real app, this would come from the backend)
      const newId = Math.max(...this.rooms.map(room => room.id)) + 1
      
      const newRoom = {
        id: newId,
        ...roomData,
        available: true
      }
      
      this.rooms.push(newRoom)
      
      // Save updated rooms to localStorage
      saveRoomsToLocalStorage(this.rooms)
      
      return newRoom
    },
    
    // Update an existing room
    updateRoom(roomId, updatedData) {
      const roomIndex = this.rooms.findIndex(room => room.id === roomId)
      
      if (roomIndex === -1) {
        return {
          success: false,
          message: 'Room not found'
        }
      }
      
      // Update the room data
      this.rooms[roomIndex] = {
        ...this.rooms[roomIndex],
        ...updatedData
      }
      
      // Save updated rooms to localStorage
      saveRoomsToLocalStorage(this.rooms)
      
      return {
        success: true,
        room: this.rooms[roomIndex]
      }
    },
    
    // Delete a room
    deleteRoom(roomId) {
      const roomIndex = this.rooms.findIndex(room => room.id === roomId)
      
      if (roomIndex === -1) {
        return {
          success: false,
          message: 'Room not found'
        }
      }
      
      // Remove the room
      this.rooms.splice(roomIndex, 1)
      
      // Save updated rooms to localStorage
      saveRoomsToLocalStorage(this.rooms)
      
      return {
        success: true
      }
    },
    
    setCapacityFilter(capacity) {
      this.filters.capacity = capacity
    },
    
    setPriceRangeFilter(min, max) {
      this.filters.priceRange.min = min
      this.filters.priceRange.max = max
    },
    
    resetFilters() {
      this.filters = {
        capacity: null,
        priceRange: { min: 0, max: 500 }
      }
    },
    
    // Initialize rooms in localStorage if not already present
    initializeRooms() {
      if (!localStorage.getItem('rooms')) {
        saveRoomsToLocalStorage(defaultRooms)
        this.rooms = defaultRooms
      }
    },
    
    async confirmBooking(bookingData) {
      try {
        // In a real application, this would be an API call to confirm the booking
        console.log('Confirming booking:', bookingData)
        
        // Validate booking data
        if (!bookingData || !bookingData.roomId) {
          throw new Error('Invalid booking data: Room ID is required')
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Find the room in our store
        const roomIndex = this.rooms.findIndex(room => room.id == bookingData.roomId)
        if (roomIndex === -1) {
          throw new Error(`Room with ID ${bookingData.roomId} not found`)
        }
        
        // Check if room is available
        if (!this.rooms[roomIndex].available) {
          throw new Error('This room is no longer available. Please select another room.')
        }
        
        // For demo purposes, mark the room as unavailable
        this.rooms[roomIndex].available = false
        
        // Generate a booking ID
        const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000)
        
        // Store the confirmed booking data
        const confirmedBooking = {
          ...bookingData,
          bookingId,
          bookingDate: new Date().toISOString(),
          status: 'confirmed'
        }
        
        // Save to booking history
        this.saveBookingToHistory(confirmedBooking)
        
        return {
          success: true,
          message: 'Booking confirmed successfully',
          bookingId
        }
      } catch (error) {
        console.error('Error confirming booking:', error)
        return {
          success: false,
          message: error.message || 'Failed to confirm booking'
        }
      }
    },
    
    async saveBookingToHistory(bookingData) {
      try {
        // In a real application, this would save to a database
        // For now, we'll save to localStorage
        const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
        bookingHistory.push(bookingData)
        localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory))
        
        console.log('Booking saved to history:', bookingData)
        return true
      } catch (error) {
        console.error('Error saving booking history:', error)
        return false
      }
    }
  }
})

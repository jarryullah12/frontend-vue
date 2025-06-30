import { defineStore } from '../lib/pinia'

export const useBookingStore = defineStore('booking', {
  // State
  state: () => ({
    checkInDate: '2025-04-15',
    checkOutDate: '2025-04-18',
    guests: '2 Adults',
    selectedRoom: null,
    invoiceDetails: {
      invoiceEmail: '',
      phoneNumber: ''
    },
    bookingHistory: [],
    isBookingConfirmed: false
  }),
  
  // Getters
  getters: {
    numberOfNights: (state) => {
      if (!state.checkInDate || !state.checkOutDate) return 0
      
      const checkIn = new Date(state.checkInDate)
      const checkOut = new Date(state.checkOutDate)
      
      const diffTime = Math.abs(checkOut - checkIn)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return diffDays
    },
    
    bookingSummary: (state) => {
      return {
        checkIn: state.checkInDate,
        checkOut: state.checkOutDate,
        guests: state.guests,
        room: state.selectedRoom,
        invoiceDetails: state.invoiceDetails,
        nights: state.numberOfNights
      }
    }
  },
  
  // Actions
  actions: {
    setCheckInDate(date) {
      this.checkInDate = date
    },
    
    setCheckOutDate(date) {
      this.checkOutDate = date
    },
    
    setGuests(guestCount) {
      this.guests = guestCount
    },
    

    
    setInvoiceDetails(details) {
      this.invoiceDetails = details
    },
    
    selectRoom(room) {
      this.selectedRoom = room
    },
    
    checkAvailability() {
      // In a real application, this would make an API call to check room availability
      console.log('Checking availability for:', {
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests
      })
      
      // For demo purposes, we'll just return a simulated response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            available: true,
            rooms: [
              { id: 1, name: 'Standard Single Room', price: 99, available: true },
              { id: 2, name: 'Deluxe Double Room', price: 149, available: true },
              { id: 3, name: 'Executive Suite', price: 249, available: false }
            ]
          })
        }, 1000)
      })
    },
    
    confirmBooking() {
      if (!this.selectedRoom) {
        throw new Error('Please select a room before confirming')
      }
      
      // In a real application, this would make an API call to confirm the booking
      console.log('Confirming booking for:', {
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests,
        room: this.selectedRoom,
        invoiceDetails: this.invoiceDetails
      })
      
      const booking = {
        id: Date.now(),
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests,
        room: this.selectedRoom,
        invoiceDetails: this.invoiceDetails,
        bookedAt: new Date().toISOString()
      }
      
      this.bookingHistory.push(booking)
      this.isBookingConfirmed = true
      
      return booking
    },
    
    resetBooking() {
      this.selectedRoom = null
      this.isBookingConfirmed = false
    }
  }
})

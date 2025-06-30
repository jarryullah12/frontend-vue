import { defineStore } from '../lib/pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    // Bookings data
    bookings: [
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
      },
      {
        id: 'BK1683922',
        guestName: 'Emma Johnson',
        email: 'emma.johnson@example.com',
        phone: '+1 (555) 987-6543',
        roomId: 3,
        roomType: 'Classic Double Room',
        roomRate: 129,
        checkIn: new Date('2025-05-12'),
        checkOut: new Date('2025-05-14'),
        createdAt: new Date('2025-04-28'),
        subtotal: 258,
        tax: 25.8,
        total: 283.8,
        status: 'Checked In'
      },
      {
        id: 'BK1683923',
        guestName: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 456-7890',
        roomId: 4,
        roomType: 'Comfort Triple Room',
        roomRate: 199,
        checkIn: new Date('2025-05-20'),
        checkOut: new Date('2025-05-25'),
        createdAt: new Date('2025-05-05'),
        subtotal: 995,
        tax: 99.5,
        total: 1094.5,
        status: 'Pending'
      },
      {
        id: 'BK1683924',
        guestName: 'Sarah Davis',
        email: 'sarah.davis@example.com',
        phone: '+1 (555) 789-0123',
        roomId: 1,
        roomType: 'Standard Single Room',
        roomRate: 99,
        checkIn: new Date('2025-05-11'),
        checkOut: new Date('2025-05-13'),
        createdAt: new Date('2025-04-25'),
        subtotal: 198,
        tax: 19.8,
        total: 217.8,
        status: 'Completed'
      },
      {
        id: 'BK1683925',
        guestName: 'David Wilson',
        email: 'david.wilson@example.com',
        phone: '+1 (555) 234-5678',
        roomId: 2,
        roomType: 'Superior Double Room',
        roomRate: 149,
        checkIn: new Date('2025-05-08'),
        checkOut: new Date('2025-05-10'),
        createdAt: new Date('2025-04-20'),
        subtotal: 298,
        tax: 29.8,
        total: 327.8,
        status: 'Cancelled'
      }
    ],
    
    // Users data
    users: [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@luxuryhotel.com',
        role: 'Admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff',
        active: true,
        joinedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'John Manager',
        email: 'john@luxuryhotel.com',
        role: 'Admin',
        avatar: 'https://ui-avatars.com/api/?name=John+Manager&background=8b5cf6&color=fff',
        active: true,
        joinedAt: new Date('2024-02-15')
      },
      {
        id: 3,
        name: 'Sarah Staff',
        email: 'sarah@luxuryhotel.com',
        role: 'Staff',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Staff&background=ec4899&color=fff',
        active: true,
        joinedAt: new Date('2024-03-10')
      },
      {
        id: 4,
        name: 'Michael Reception',
        email: 'michael@luxuryhotel.com',
        role: 'Staff',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Reception&background=14b8a6&color=fff',
        active: true,
        joinedAt: new Date('2024-04-05')
      },
      {
        id: 5,
        name: 'Emily Housekeeping',
        email: 'emily@luxuryhotel.com',
        role: 'Staff',
        avatar: 'https://ui-avatars.com/api/?name=Emily+Housekeeping&background=f59e0b&color=fff',
        active: false,
        joinedAt: new Date('2024-02-20')
      }
    ],
    
    // Dashboard stats
    dashboardStats: {
      totalRooms: 0,
      availableRooms: 0,
      activeBookings: 0,
      pendingBookings: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0,
      registeredUsers: 0,
      newUsers: 0
    }
  }),
  
  getters: {
    // Booking getters
    getBookingById: (state) => (id) => {
      return state.bookings.find(booking => booking.id === id)
    },
    
    getBookingsByStatus: (state) => (status) => {
      if (status === 'all') return state.bookings
      return state.bookings.filter(booking => booking.status === status)
    },
    
    getActiveBookings: (state) => {
      return state.bookings.filter(booking => 
        booking.status === 'Confirmed' || booking.status === 'Checked In'
      )
    },
    
    getPendingBookings: (state) => {
      return state.bookings.filter(booking => booking.status === 'Pending')
    },
    
    // User getters
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    
    getActiveUsers: (state) => {
      return state.users.filter(user => user.active)
    },
    
    getAdminUsers: (state) => {
      return state.users.filter(user => user.role === 'Admin')
    },
    
    getStaffUsers: (state) => {
      return state.users.filter(user => user.role === 'Staff')
    }
  },
  
  actions: {
    // Initialize dashboard stats
    initDashboardStats(roomsStore) {
      this.dashboardStats.totalRooms = roomsStore.rooms.length
      this.dashboardStats.availableRooms = roomsStore.availableRooms.length
      this.dashboardStats.activeBookings = this.getActiveBookings.length
      this.dashboardStats.pendingBookings = this.getPendingBookings.length
      
      // Calculate monthly revenue from bookings in the current month
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const monthlyBookings = this.bookings.filter(booking => {
        const bookingMonth = new Date(booking.createdAt).getMonth()
        const bookingYear = new Date(booking.createdAt).getFullYear()
        return bookingMonth === currentMonth && bookingYear === currentYear
      })
      
      this.dashboardStats.monthlyRevenue = monthlyBookings.reduce(
        (total, booking) => total + booking.total, 0
      )
      
      // Mock revenue growth (in a real app, would compare with previous month)
      this.dashboardStats.revenueGrowth = 8
      
      // User stats
      this.dashboardStats.registeredUsers = this.users.length
      this.dashboardStats.newUsers = 3 // Mock value for new users this week
    },
    
    // Booking actions
    addBooking(bookingData) {
      // Generate booking ID
      const bookingId = 'BK' + Date.now()
      
      // Create new booking object
      const newBooking = {
        id: bookingId,
        ...bookingData,
        createdAt: new Date()
      }
      
      // Add to bookings array
      this.bookings.push(newBooking)
      
      return bookingId
    },
    
    updateBookingStatus(bookingId, newStatus) {
      const index = this.bookings.findIndex(booking => booking.id === bookingId)
      if (index !== -1) {
        this.bookings[index].status = newStatus
        return true
      }
      return false
    },
    
    deleteBooking(bookingId) {
      const index = this.bookings.findIndex(booking => booking.id === bookingId)
      if (index !== -1) {
        this.bookings.splice(index, 1)
        return true
      }
      return false
    },
    
    // User actions
    addUser(userData) {
      // Generate user ID
      const userId = this.users.length + 1
      
      // Create new user object
      const newUser = {
        id: userId,
        ...userData,
        joinedAt: new Date()
      }
      
      // Add to users array
      this.users.push(newUser)
      
      return userId
    },
    
    updateUser(userId, userData) {
      const index = this.users.findIndex(user => user.id === userId)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...userData }
        return true
      }
      return false
    },
    
    toggleUserStatus(userId) {
      const index = this.users.findIndex(user => user.id === userId)
      if (index !== -1) {
        this.users[index].active = !this.users[index].active
        return true
      }
      return false
    },
    
    deleteUser(userId) {
      const index = this.users.findIndex(user => user.id === userId)
      if (index !== -1) {
        this.users.splice(index, 1)
        return true
      }
      return false
    }
  }
})

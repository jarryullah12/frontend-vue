// Session management utility
import { useAuthStore } from '../stores/auth'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
let sessionTimer = null

// Create bound handler functions to ensure proper event listener removal
let boundResetTimer = null

export const sessionManager = {
  // Initialize session timeout
  initSession() {
    try {
      console.log('Initializing session management')
      
      // Create a bound version of resetTimer for event listeners
      boundResetTimer = this.resetTimer.bind(this)
      
      // Reset timer initially
      this.resetTimer()
      
      // Add event listeners to reset timer on user activity
      window.addEventListener('mousemove', boundResetTimer)
      window.addEventListener('mousedown', boundResetTimer)
      window.addEventListener('keypress', boundResetTimer)
      window.addEventListener('touchmove', boundResetTimer)
      window.addEventListener('scroll', boundResetTimer)
      
      // Initialize auth state from localStorage if needed
      this.checkAuthState()
      
      console.log('Session management initialized successfully')
    } catch (error) {
      console.error('Error initializing session:', error)
    }
  },

  // Check and initialize auth state from localStorage
  checkAuthState() {
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      const user = JSON.parse(localStorage.getItem('user'))
      
      if (isAuthenticated && user) {
        console.log('User session restored from localStorage')
      } else {
        console.log('No active user session found')
      }
    } catch (error) {
      console.error('Error checking auth state:', error)
    }
  },

  // Reset session timer
  resetTimer() {
    try {
      if (sessionTimer) {
        clearTimeout(sessionTimer)
      }
      
      sessionTimer = setTimeout(() => {
        this.endSession()
      }, SESSION_TIMEOUT)
    } catch (error) {
      console.error('Error resetting timer:', error)
    }
  },

  // End session and redirect to login
  endSession() {
    try {
      const authStore = useAuthStore()
      
      // Only logout if currently authenticated
      if (authStore.isAuthenticated) {
        console.log('Session timeout, logging out')
        authStore.logout()
        
        // Redirect to login page
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error ending session:', error)
    }
  },

  // Clean up event listeners
  cleanUp() {
    try {
      console.log('Cleaning up session management')
      
      if (boundResetTimer) {
        window.removeEventListener('mousemove', boundResetTimer)
        window.removeEventListener('mousedown', boundResetTimer)
        window.removeEventListener('keypress', boundResetTimer)
        window.removeEventListener('touchmove', boundResetTimer)
        window.removeEventListener('scroll', boundResetTimer)
      }
      
      if (sessionTimer) {
        clearTimeout(sessionTimer)
        sessionTimer = null
      }
      
      console.log('Session management cleaned up successfully')
    } catch (error) {
      console.error('Error cleaning up session:', error)
    }
  }
}

import { defineStore } from '../lib/pinia'

// Define a store
export const useCounterStore = defineStore('counter', {
  // State
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  // Getters (computed properties)
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  
  // Actions (methods)
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    },
    setCount(newCount) {
      this.count = newCount
    }
  }
})

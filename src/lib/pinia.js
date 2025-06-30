// A simplified version of Pinia for local use
// This is a temporary solution until you can properly install Pinia via npm/yarn

import { reactive, computed, inject, effectScope } from 'vue'

// Symbol to be used as injection key
const piniaSymbol = Symbol('pinia')

// Create a Pinia instance
export function createPinia() {
  const scope = effectScope(true)
  const state = scope.run(() => reactive({}))
  
  const pinia = {
    install(app) {
      app.provide(piniaSymbol, pinia)
      app.config.globalProperties.$pinia = pinia
    },
    state,
    _e: scope,
    _s: new Map()
  }
  
  return pinia
}

// Define a store
export function defineStore(id, options) {
  const { state, getters, actions } = options
  
  function useStore() {
    const pinia = inject(piniaSymbol)
    if (!pinia) throw new Error('Pinia not installed')
    
    if (!pinia._s.has(id)) {
      // Create a new store instance
      const localState = reactive(state ? state() : {})
      pinia.state[id] = localState
      
      // Process getters
      const computedGetters = {}
      const store = {
        $id: id,
        $state: localState
      }
      
      // Add getters as computed properties
      if (getters) {
        Object.keys(getters).forEach(key => {
          computedGetters[key] = computed(() => getters[key](localState))
          // Define getters on the store
          Object.defineProperty(store, key, {
            get: () => computedGetters[key].value,
            enumerable: true
          })
        })
      }
      
      // Add state properties to the store
      Object.keys(localState).forEach(key => {
        Object.defineProperty(store, key, {
          get: () => localState[key],
          set: (value) => { localState[key] = value },
          enumerable: true
        })
      })
      
      // Add actions to the store
      if (actions) {
        Object.keys(actions).forEach(key => {
          store[key] = function(...args) {
            return actions[key].apply(this, args)
          }.bind(store)
        })
      }
      
      pinia._s.set(id, store)
    }
    
    return pinia._s.get(id)
  }
  
  return useStore
}

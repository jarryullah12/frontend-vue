import { ref, computed } from 'vue'

const items = ref([])
const isOpen = ref(false)

const count = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0))
const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.price * item.qty, 0))

function add(product) {
  const existing = items.value.find((i) => i.id === product.id)
  if (existing) {
    existing.qty++
  } else {
    items.value.push({ ...product, qty: 1 })
  }
  isOpen.value = true
}

function remove(id) {
  items.value = items.value.filter((i) => i.id !== id)
}

function increment(id) {
  const item = items.value.find((i) => i.id === id)
  if (item) item.qty++
}

function decrement(id) {
  const item = items.value.find((i) => i.id === id)
  if (item) {
    item.qty--
    if (item.qty <= 0) remove(id)
  }
}

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

export function useCart() {
  return {
    items,
    isOpen,
    count,
    subtotal,
    add,
    remove,
    increment,
    decrement,
    open,
    close,
  }
}

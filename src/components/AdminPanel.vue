<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['navigate'])

const { profile } = useAuth()

const tab = ref('products')
const products = ref([])
const orders = ref([])
const loading = ref(true)
const editingProduct = ref(null)
const showProductForm = ref(false)

const emptyProduct = () => ({
  id: null,
  name: '',
  price: 0,
  tag: '',
  image: '',
  category: 'collection',
  sort_order: 0,
})

const form = ref(emptyProduct())
const formError = ref('')
const formSaving = ref(false)

const formatPrice = (n) => '$' + Number(n || 0).toLocaleString()

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

// ---------------------------------------
// Fake API / Local Storage
// ---------------------------------------

const defaultProducts = [
  {
    id: 1,
    name: 'Maison Noir Jacket',
    price: 249,
    tag: 'Outerwear',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    category: 'collection',
    sort_order: 1,
  },
  {
    id: 2,
    name: 'Classic Black Coat',
    price: 299,
    tag: 'Outerwear',
    image:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80',
    category: 'collection',
    sort_order: 2,
  },
  {
    id: 3,
    name: 'Maison White Shirt',
    price: 129,
    tag: 'Shirts',
    image:
      'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=600&q=80',
    category: 'collection',
    sort_order: 3,
  },
  {
    id: 4,
    name: 'Premium Trousers',
    price: 159,
    tag: 'Trousers',
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80',
    category: 'collection',
    sort_order: 4,
  },
  {
    id: 5,
    name: 'Leather Handbag',
    price: 189,
    tag: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    category: 'accessories',
    sort_order: 5,
  },
  {
    id: 6,
    name: 'Minimal Sunglasses',
    price: 99,
    tag: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    category: 'accessories',
    sort_order: 6,
  },
]

const getStoredProducts = () => {
  const stored = localStorage.getItem('mason_products')

  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return [...defaultProducts]
    }
  }

  localStorage.setItem(
    'mason_products',
    JSON.stringify(defaultProducts)
  )

  return [...defaultProducts]
}

const getStoredOrders = () => {
  const stored = localStorage.getItem('mason_orders')

  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }

  return []
}

// ---------------------------------------
// Load Data
// ---------------------------------------

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  loading.value = true

  await new Promise((resolve) => setTimeout(resolve, 300))

  products.value = getStoredProducts()
    .sort((a, b) => {
      if (a.category === b.category) {
        return Number(a.sort_order || 0) - Number(b.sort_order || 0)
      }

      return a.category.localeCompare(b.category)
    })

  orders.value = getStoredOrders().sort(
    (a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
  )

  loading.value = false
}

// ---------------------------------------
// Product Form
// ---------------------------------------

const openNewProduct = () => {
  form.value = emptyProduct()
  editingProduct.value = null
  showProductForm.value = true
  formError.value = ''
}

const openEditProduct = (product) => {
  form.value = { ...product }
  editingProduct.value = product.id
  showProductForm.value = true
  formError.value = ''
}

// ---------------------------------------
// Save Product
// ---------------------------------------

const saveProduct = async () => {
  formError.value = ''

  if (
    !form.value.name ||
    !form.value.image ||
    Number(form.value.price) <= 0
  ) {
    formError.value =
      'Name, price, and image URL are required'

    return
  }

  formSaving.value = true

  try {
    const currentProducts = getStoredProducts()

    if (editingProduct.value) {
      const index = currentProducts.findIndex(
        (product) => product.id === editingProduct.value
      )

      if (index !== -1) {
        currentProducts[index] = {
          ...currentProducts[index],
          name: form.value.name,
          price: Number(form.value.price),
          tag: form.value.tag,
          image: form.value.image,
          category: form.value.category,
          sort_order: Number(form.value.sort_order || 0),
        }
      }
    } else {
      const newProduct = {
        ...form.value,
        id: Date.now(),
        price: Number(form.value.price),
        sort_order: Number(form.value.sort_order || 0),
      }

      currentProducts.push(newProduct)
    }

    localStorage.setItem(
      'mason_products',
      JSON.stringify(currentProducts)
    )

    showProductForm.value = false

    await loadData()
  } catch (error) {
    formError.value =
      error.message || 'Unable to save product'
  } finally {
    formSaving.value = false
  }
}

// ---------------------------------------
// Delete Product
// ---------------------------------------

const deleteProduct = async (id) => {
  if (!confirm('Delete this product?')) return

  const currentProducts = getStoredProducts()

  const updatedProducts = currentProducts.filter(
    (product) => product.id !== id
  )

  localStorage.setItem(
    'mason_products',
    JSON.stringify(updatedProducts)
  )

  await loadData()
}

// ---------------------------------------
// Order Status
// ---------------------------------------

const updateOrderStatus = async (orderId, status) => {
  const currentOrders = getStoredOrders()

  const index = currentOrders.findIndex(
    (order) => order.id === orderId
  )

  if (index === -1) return

  currentOrders[index].status = status

  localStorage.setItem(
    'mason_orders',
    JSON.stringify(currentOrders)
  )

  await loadData()
}
</script>

<template>
  <section
    class="min-h-screen bg-ink-950 px-6 md:px-12 py-28 max-w-[1400px] mx-auto"
  >
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
    >
      <div>
        <p
          class="font-sans text-xs tracking-[0.3em] uppercase text-accent-400 mb-3"
        >
          Admin Panel
        </p>

        <h1
          class="font-display text-4xl md:text-6xl text-ink-50 leading-[0.9]"
        >
          Dashboard
        </h1>
      </div>

      <div class="flex gap-3">
        <button
          @click="emit('navigate', 'account')"
          class="px-6 py-3 border border-ink-700 text-ink-300 font-sans text-xs tracking-[0.2em] uppercase cursor-hover hover:text-ink-50 transition-colors"
        >
          My Account
        </button>

        <button
          @click="emit('navigate', 'home')"
          class="px-6 py-3 border border-ink-700 text-ink-300 font-sans text-xs tracking-[0.2em] uppercase cursor-hover hover:text-ink-50 transition-colors"
        >
          View Store
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-8 border-b border-ink-800">
      <button
        @click="tab = 'products'"
        class="px-6 py-3 font-sans text-xs tracking-[0.2em] uppercase transition-colors cursor-hover"
        :class="
          tab === 'products'
            ? 'text-accent-400 border-b-2 border-accent-500 -mb-px'
            : 'text-ink-500 hover:text-ink-300'
        "
      >
        Products ({{ products.length }})
      </button>

      <button
        @click="tab = 'orders'"
        class="px-6 py-3 font-sans text-xs tracking-[0.2em] uppercase transition-colors cursor-hover"
        :class="
          tab === 'orders'
            ? 'text-accent-400 border-b-2 border-accent-500 -mb-px'
            : 'text-ink-500 hover:text-ink-300'
        "
      >
        Orders ({{ orders.length }})
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="text-ink-400 font-serif text-lg py-12 text-center"
    >
      Loading...
    </div>

    <!-- Products -->
    <div v-else-if="tab === 'products'">
      <div class="flex justify-end mb-6">
        <button
          @click="openNewProduct"
          class="px-6 py-3 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-hover hover:bg-accent-400 transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="border-b border-ink-800 text-left"
            >
              <th class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 py-3 pr-4">
                Image
              </th>

              <th class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 py-3 pr-4">
                Name
              </th>

              <th class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 py-3 pr-4">
                Price
              </th>

              <th class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 py-3 pr-4">
                Category
              </th>

              <th class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 py-3 pr-4">
                Tag
              </th>

              <th class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 py-3 pr-4">
                Sort
              </th>

              <th class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 py-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="product in products"
              :key="product.id"
              class="border-b border-ink-900"
            >
              <td class="py-3 pr-4">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-12 h-16 object-cover"
                />
              </td>

              <td
                class="py-3 pr-4 font-serif text-sm text-ink-200"
              >
                {{ product.name }}
              </td>

              <td
                class="py-3 pr-4 font-sans text-sm text-ink-300"
              >
                {{ formatPrice(product.price) }}
              </td>

              <td
                class="py-3 pr-4 font-sans text-xs text-ink-400"
              >
                {{ product.category }}
              </td>

              <td
                class="py-3 pr-4 font-sans text-xs text-ink-400"
              >
                {{ product.tag || '—' }}
              </td>

              <td
                class="py-3 pr-4 font-sans text-xs text-ink-400"
              >
                {{ product.sort_order }}
              </td>

              <td class="py-3">
                <div class="flex gap-2">
                  <button
                    @click="openEditProduct(product)"
                    class="text-ink-400 hover:text-accent-400 transition-colors cursor-hover"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    @click="deleteProduct(product.id)"
                    class="text-ink-400 hover:text-red-400 transition-colors cursor-hover"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Orders -->
    <div v-else-if="tab === 'orders'">
      <div
        v-if="orders.length === 0"
        class="border border-ink-800 p-12 text-center"
      >
        <p class="font-serif text-ink-400 text-lg">
          No orders yet.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="border border-ink-800 p-5"
        >
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"
          >
            <div>
              <p
                class="font-sans text-xs tracking-[0.15em] uppercase text-ink-500"
              >
                Order {{ String(order.id).slice(0, 8) }}
              </p>

              <p
                class="font-serif text-sm text-ink-300"
              >
                {{ formatDate(order.created_at) }}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <select
                :value="order.status"
                @change="
                  updateOrderStatus(
                    order.id,
                    $event.target.value
                  )
                "
                class="bg-ink-900 border border-ink-700 text-ink-200 font-sans text-xs px-3 py-2 focus:outline-none focus:border-accent-500 cursor-hover"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <p
                class="font-display text-lg text-ink-50"
              >
                {{ formatPrice(order.total) }}
              </p>
            </div>
          </div>

          <div class="flex gap-3 flex-wrap">
            <div
              v-for="(item, i) in order.items"
              :key="i"
              class="flex items-center gap-2 text-sm"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-10 h-12 object-cover"
              />

              <div>
                <p
                  class="font-sans text-xs text-ink-300"
                >
                  {{ item.name }}
                </p>

                <p
                  class="font-sans text-[10px] text-ink-500"
                >
                  Qty: {{ item.qty }} —
                  {{ formatPrice(item.price * item.qty) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showProductForm"
        class="fixed inset-0 z-[95] bg-ink-950/80 backdrop-blur-sm flex items-center justify-center px-6"
        @click.self="showProductForm = false"
      >
        <div
          class="bg-ink-900 border border-ink-700 w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
        >
          <h3
            class="font-display text-2xl text-ink-50 mb-6"
          >
            {{
              editingProduct
                ? 'Edit Product'
                : 'New Product'
            }}
          </h3>

          <div class="space-y-4">
            <div>
              <label
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
              >
                Name
              </label>

              <input
                v-model="form.name"
                type="text"
                class="w-full bg-ink-950 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                >
                  Price ($)
                </label>

                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  class="w-full bg-ink-950 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>

              <div>
                <label
                  class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                >
                  Sort Order
                </label>

                <input
                  v-model.number="form.sort_order"
                  type="number"
                  min="0"
                  class="w-full bg-ink-950 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                >
                  Category
                </label>

                <select
                  v-model="form.category"
                  class="w-full bg-ink-950 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 cursor-hover"
                >
                  <option value="collection">
                    Collection
                  </option>

                  <option value="accessories">
                    Accessories
                  </option>
                </select>
              </div>

              <div>
                <label
                  class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                >
                  Tag
                </label>

                <input
                  v-model="form.tag"
                  type="text"
                  placeholder="e.g. Outerwear"
                  class="w-full bg-ink-950 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
              >
                Image URL
              </label>

              <input
                v-model="form.image"
                type="text"
                placeholder="https://..."
                class="w-full bg-ink-950 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>

            <div
              v-if="form.image"
              class="flex justify-center"
            >
              <img
                :src="form.image"
                alt="Preview"
                class="w-32 h-40 object-cover border border-ink-700"
              />
            </div>

            <p
              v-if="formError"
              class="font-sans text-sm text-red-400"
            >
              {{ formError }}
            </p>

            <div class="flex gap-3 pt-2">
              <button
                @click="saveProduct"
                :disabled="formSaving"
                class="flex-1 py-3 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-hover disabled:opacity-50"
              >
                {{
                  formSaving
                    ? 'Saving...'
                    : 'Save Product'
                }}
              </button>

              <button
                @click="showProductForm = false"
                class="px-6 py-3 border border-ink-700 text-ink-300 font-sans text-xs tracking-[0.2em] uppercase cursor-hover hover:text-ink-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>
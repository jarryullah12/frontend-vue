```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['navigate'])

const { user, profile, signOut, updateProfile } = useAuth()

const orders = ref([])
const loadingOrders = ref(true)
const editingName = ref(false)
const fullName = ref('')
const savingName = ref(false)

const formatPrice = (n) =>
  '$' + Number(n || 0).toLocaleString()

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

onMounted(async () => {
  fullName.value = profile.value?.full_name || ''

  // Load orders from localStorage instead of Supabase
  try {
    const storedOrders = localStorage.getItem('mason_orders')

    if (storedOrders) {
      const allOrders = JSON.parse(storedOrders)

      // Only show orders belonging to current user
      orders.value = allOrders
        .filter((order) => {
          if (!user.value?.id) return false
          return order.user_id === user.value.id
        })
        .sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        )
    } else {
      orders.value = []
    }
  } catch (error) {
    console.error('Error loading orders:', error)
    orders.value = []
  }

  loadingOrders.value = false
})

const saveName = async () => {
  savingName.value = true

  try {
    await updateProfile({
      full_name: fullName.value,
    })

    editingName.value = false
  } catch (e) {
    console.error(e.message)
  } finally {
    savingName.value = false
  }
}

const handleSignOut = async () => {
  await signOut()
  emit('navigate', 'home')
}
</script>

<template>
  <section
    class="min-h-screen bg-ink-950 px-6 md:px-12 py-28 max-w-[1200px] mx-auto"
  >
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16"
    >
      <div>
        <p
          class="font-sans text-xs tracking-[0.3em] uppercase text-accent-400 mb-3"
        >
          My Account
        </p>

        <h1
          class="font-display text-4xl md:text-6xl text-ink-50 leading-[0.9]"
        >
          Hello,
          <span class="italic font-light text-ink-400">
            {{ profile?.full_name || user?.email }}
          </span>
        </h1>
      </div>

      <div class="flex gap-3">
        <button
          v-if="profile?.is_admin"
          @click="emit('navigate', 'admin')"
          class="px-6 py-3 border border-accent-500 text-accent-400 font-sans text-xs tracking-[0.2em] uppercase cursor-hover hover:bg-accent-500 hover:text-ink-950 transition-all duration-300"
        >
          Admin Panel
        </button>

        <button
          @click="handleSignOut"
          class="px-6 py-3 border border-ink-700 text-ink-300 font-sans text-xs tracking-[0.2em] uppercase cursor-hover hover:text-ink-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile -->
      <div class="lg:col-span-1">
        <div class="border border-ink-800 p-6">
          <h2 class="font-display text-xl text-ink-50 mb-6">
            Profile
          </h2>

          <div class="space-y-4">
            <div>
              <p
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 mb-1"
              >
                Email
              </p>

              <p class="font-serif text-sm text-ink-200">
                {{ user?.email }}
              </p>
            </div>

            <div>
              <p
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 mb-1"
              >
                Full Name
              </p>

              <div
                v-if="!editingName"
                class="flex items-center justify-between gap-2"
              >
                <p class="font-serif text-sm text-ink-200">
                  {{ profile?.full_name || 'Not set' }}
                </p>

                <button
                  @click="editingName = true"
                  class="text-ink-500 hover:text-accent-400 transition-colors cursor-hover"
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
              </div>

              <div v-else class="flex gap-2">
                <input
                  v-model="fullName"
                  type="text"
                  class="flex-1 bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-3 py-2 focus:outline-none focus:border-accent-500 transition-colors"
                />

                <button
                  @click="saveName"
                  :disabled="savingName"
                  class="px-3 py-2 bg-accent-500 text-ink-950 font-sans text-xs cursor-hover disabled:opacity-50"
                >
                  {{ savingName ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>

            <div>
              <p
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 mb-1"
              >
                Role
              </p>

              <p
                class="font-serif text-sm"
                :class="
                  profile?.is_admin
                    ? 'text-accent-400'
                    : 'text-ink-200'
                "
              >
                {{
                  profile?.is_admin
                    ? 'Administrator'
                    : 'Customer'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div class="lg:col-span-2">
        <h2 class="font-display text-xl text-ink-50 mb-6">
          Order History
        </h2>

        <div
          v-if="loadingOrders"
          class="text-ink-400 font-serif"
        >
          Loading orders...
        </div>

        <div
          v-else-if="orders.length === 0"
          class="border border-ink-800 p-12 text-center"
        >
          <p class="font-serif text-ink-400 text-lg mb-4">
            No orders yet.
          </p>

          <button
            @click="emit('navigate', 'home')"
            class="font-sans text-xs tracking-[0.2em] uppercase text-accent-400 border-b border-accent-500 pb-1 cursor-hover"
          >
            Start Shopping
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="border border-ink-800 p-5"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"
            >
              <div>
                <p
                  class="font-sans text-xs tracking-[0.15em] uppercase text-ink-500"
                >
                  Order
                  {{ String(order.id).slice(0, 8) }}
                </p>

                <p class="font-serif text-sm text-ink-300">
                  {{ formatDate(order.created_at) }}
                </p>
              </div>

              <div class="flex items-center gap-4">
                <span
                  class="font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5"
                  :class="{
                    'bg-accent-500/20 text-accent-300':
                      order.status === 'pending',

                    'bg-green-500/20 text-green-300':
                      order.status === 'shipped',

                    'bg-blue-500/20 text-blue-300':
                      order.status === 'delivered',

                    'bg-red-500/20 text-red-300':
                      order.status === 'cancelled',
                  }"
                >
                  {{ order.status }}
                </span>

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
                    Qty: {{ item.qty }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
```

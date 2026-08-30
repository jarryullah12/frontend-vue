<script setup>
import { ref, computed } from 'vue'
import { gsap } from 'gsap'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

const {
  items,
  isOpen,
  subtotal,
  count,
  increment,
  decrement,
  remove,
  close,
} = useCart()

const { user, isAuthenticated, profile } = useAuth()

const shipping = computed(() =>
  subtotal.value > 500 || subtotal.value === 0 ? 0 : 25
)

const total = computed(() => subtotal.value + shipping.value)

const stage = ref('cart')
const placingOrder = ref(false)
const orderError = ref('')

const checkout = () => {
  if (!isAuthenticated.value) {
    orderError.value = 'Please sign in to checkout.'
    return
  }

  orderError.value = ''
  stage.value = 'checkout'
}

const placeOrder = async () => {
  if (!isAuthenticated.value || !user.value?.id) {
    orderError.value = 'Please sign in to place your order.'
    return
  }

  if (items.value.length === 0) {
    orderError.value = 'Your cart is empty.'
    return
  }

  placingOrder.value = true
  orderError.value = ''

  try {
    const orderItems = items.value.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      qty: Number(item.qty),
      image: item.image,
      tag: item.tag || '',
    }))

    // Create fake/local order
    const newOrder = {
      id: `order-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`,

      user_id: user.value.id,

      customer: {
        name:
          profile.value?.full_name ||
          user.value?.email ||
          'Customer',

        email: user.value?.email || '',
      },

      items: orderItems,

      subtotal: Number(subtotal.value),
      shipping: Number(shipping.value),
      total: Number(total.value),

      status: 'pending',

      created_at: new Date().toISOString(),
    }

    // Get existing orders
    const existingOrders = JSON.parse(
      localStorage.getItem('mason_orders') || '[]'
    )

    // Add new order
    existingOrders.unshift(newOrder)

    // Save orders
    localStorage.setItem(
      'mason_orders',
      JSON.stringify(existingOrders)
    )

    console.log('Order saved locally:', newOrder)

    stage.value = 'done'
  } catch (e) {
    console.error('Order error:', e)
    orderError.value =
      e.message || 'Failed to place order.'
  } finally {
    placingOrder.value = false
  }
}

const resetAndClose = () => {
  stage.value = 'cart'

  // Empty cart
  items.value = []

  close()
}

const formatPrice = (n) =>
  '$' + Number(n || 0).toLocaleString()

const onEnter = (el, done) => {
  gsap.fromTo(
    el,
    { x: '100%' },
    {
      x: 0,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: done,
    }
  )
}

const onLeave = (el, done) => {
  gsap.to(el, {
    x: '100%',
    duration: 0.4,
    ease: 'power3.in',
    onComplete: done,
  })
}
</script>

<template>
  <transition
    @enter="onEnter"
    @leave="onLeave"
    :css="false"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[90] flex justify-end"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        @click="close"
      ></div>

      <!-- Drawer -->
      <div
        class="relative w-full max-w-md h-full bg-ink-950 border-l border-ink-800 flex flex-col"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-5 border-b border-ink-800"
        >
          <h3 class="font-display text-2xl text-ink-50">
            {{
              stage === 'cart'
                ? 'Your Cart'
                : stage === 'checkout'
                  ? 'Checkout'
                  : 'Order Placed'
            }}
          </h3>

          <button
            @click="close"
            class="text-ink-400 hover:text-ink-50 transition-colors cursor-hover"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Stage: Cart -->
        <div
          v-if="stage === 'cart'"
          class="flex-1 flex flex-col overflow-hidden"
        >
          <!-- Empty cart -->
          <div
            v-if="items.length === 0"
            class="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4"
          >
            <svg
              class="w-16 h-16 text-ink-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 5.2A1 1 0 005.6 20h12.8M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>

            <p class="font-serif text-lg text-ink-400">
              Your cart is empty.
            </p>

            <button
              @click="close"
              class="font-sans text-xs tracking-[0.2em] uppercase text-accent-400 border-b border-accent-500 pb-1 cursor-hover"
            >
              Continue Shopping
            </button>
          </div>

          <!-- Cart items -->
          <div
            v-else
            class="flex-1 overflow-y-auto px-6 py-4 space-y-5"
          >
            <div
              v-for="item in items"
              :key="item.id"
              class="flex gap-4"
            >
              <div
                class="w-24 h-32 flex-shrink-0 overflow-hidden bg-ink-900"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="flex flex-col flex-1 min-w-0">
                <div
                  class="flex justify-between items-start gap-2"
                >
                  <h4
                    class="font-serif text-base text-ink-50 leading-snug"
                  >
                    {{ item.name }}
                  </h4>

                  <button
                    @click="remove(item.id)"
                    class="text-ink-600 hover:text-ink-300 transition-colors flex-shrink-0"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <p
                  class="font-sans text-xs tracking-[0.15em] uppercase text-ink-500 mt-1"
                >
                  {{ item.tag || '' }}
                </p>

                <div
                  class="flex items-center justify-between mt-auto"
                >
                  <div
                    class="flex items-center gap-3 border border-ink-700"
                  >
                    <button
                      @click="decrement(item.id)"
                      class="w-8 h-8 text-ink-300 hover:text-ink-50 transition-colors flex items-center justify-center cursor-hover"
                    >
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-width="2"
                          d="M5 12h14"
                        />
                      </svg>
                    </button>

                    <span
                      class="font-sans text-sm text-ink-50 w-6 text-center"
                    >
                      {{ item.qty }}
                    </span>

                    <button
                      @click="increment(item.id)"
                      class="w-8 h-8 text-ink-300 hover:text-ink-50 transition-colors flex items-center justify-center cursor-hover"
                    >
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 5v14M5 12h14"
                        />
                      </svg>
                    </button>
                  </div>

                  <p
                    class="font-sans text-sm text-ink-200"
                  >
                    {{
                      formatPrice(
                        item.price * item.qty
                      )
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div
            v-if="items.length > 0"
            class="border-t border-ink-800 px-6 py-5 space-y-4"
          >
            <div class="space-y-2">
              <div
                class="flex justify-between font-sans text-sm text-ink-400"
              >
                <span>Subtotal</span>

                <span class="text-ink-200">
                  {{ formatPrice(subtotal) }}
                </span>
              </div>

              <div
                class="flex justify-between font-sans text-sm text-ink-400"
              >
                <span>Shipping</span>

                <span class="text-ink-200">
                  {{
                    shipping === 0
                      ? 'Complimentary'
                      : formatPrice(shipping)
                  }}
                </span>
              </div>

              <div
                class="flex justify-between font-display text-xl text-ink-50 pt-2 border-t border-ink-800"
              >
                <span>Total</span>
                <span>{{ formatPrice(total) }}</span>
              </div>
            </div>

            <p
              v-if="!isAuthenticated"
              class="font-sans text-xs text-ink-500 text-center"
            >
              Sign in to complete your order.
            </p>

            <button
              @click="checkout"
              class="w-full group relative overflow-hidden py-4 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-hover"
            >
              <span class="relative z-10">
                Proceed to Checkout
              </span>

              <div
                class="absolute inset-0 bg-ink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
              ></div>
            </button>
          </div>
        </div>

        <!-- Checkout -->
        <div
          v-else-if="stage === 'checkout'"
          class="flex-1 overflow-y-auto px-6 py-5"
        >
          <div class="space-y-5">
            <div>
              <label
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
              >
                Full Name
              </label>

              <input
                type="text"
                :value="profile?.full_name || ''"
                class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>

            <div>
              <label
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
              >
                Email
              </label>

              <input
                type="email"
                :value="user?.email || ''"
                class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>

            <div>
              <label
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
              >
                Shipping Address
              </label>

              <input
                type="text"
                class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                >
                  City
                </label>

                <input
                  type="text"
                  class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>

              <div>
                <label
                  class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                >
                  Zip
                </label>

                <input
                  type="text"
                  class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>
            </div>

            <!-- Payment -->
            <div class="pt-3 border-t border-ink-800">
              <p
                class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 mb-3"
              >
                Payment
              </p>

              <div>
                <label
                  class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                >
                  Card Number
                </label>

                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>

              <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                  >
                    Expiry
                  </label>

                  <input
                    type="text"
                    placeholder="MM/YY"
                    class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2"
                  >
                    CVC
                  </label>

                  <input
                    type="text"
                    placeholder="123"
                    class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3 focus:outline-none focus:border-accent-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div
              class="border-t border-ink-800 pt-4 space-y-2"
            >
              <div
                class="flex justify-between font-sans text-sm text-ink-400"
              >
                <span>Subtotal</span>

                <span class="text-ink-200">
                  {{ formatPrice(subtotal) }}
                </span>
              </div>

              <div
                class="flex justify-between font-sans text-sm text-ink-400"
              >
                <span>Shipping</span>

                <span class="text-ink-200">
                  {{
                    shipping === 0
                      ? 'Complimentary'
                      : formatPrice(shipping)
                  }}
                </span>
              </div>

              <div
                class="flex justify-between font-display text-xl text-ink-50 pt-2"
              >
                <span>Total</span>

                <span>{{ formatPrice(total) }}</span>
              </div>
            </div>

            <p
              v-if="orderError"
              class="font-sans text-sm text-red-400 text-center"
            >
              {{ orderError }}
            </p>

            <button
              @click="placeOrder"
              :disabled="placingOrder"
              class="w-full group relative overflow-hidden py-4 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-hover disabled:opacity-50"
            >
              <span class="relative z-10">
                {{
                  placingOrder
                    ? 'Placing Order...'
                    : 'Place Order'
                }}
              </span>

              <div
                class="absolute inset-0 bg-ink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
              ></div>
            </button>

            <button
              @click="stage = 'cart'"
              class="w-full text-center font-sans text-xs tracking-[0.2em] uppercase text-ink-400 hover:text-ink-50 transition-colors cursor-hover"
            >
              Back to Cart
            </button>
          </div>
        </div>

        <!-- Confirmation -->
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5"
        >
          <div
            class="w-16 h-16 rounded-full border border-accent-500 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-accent-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h4
            class="font-display text-3xl text-ink-50"
          >
            Thank You.
          </h4>

          <p
            class="font-serif text-lg text-ink-400 max-w-xs leading-relaxed"
          >
            Your order has been placed. A confirmation has been sent to your email.
          </p>

          <button
            @click="resetAndClose"
            class="mt-4 font-sans text-xs tracking-[0.2em] uppercase text-accent-400 border-b border-accent-500 pb-1 cursor-hover"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

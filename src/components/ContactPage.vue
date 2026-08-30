<script setup>
import { ref } from 'vue'

const emit = defineEmits(['navigate'])

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const sending = ref(false)
const sent = ref(false)
const error = ref('')

const submitForm = async () => {
  error.value = ''
  sent.value = false

  if (!name.value || !email.value || !message.value) {
    error.value = 'Please fill in all required fields.'
    return
  }

  sending.value = true

  try {
    // Demo submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    sent.value = true

    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
  } catch (e) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="min-h-screen bg-ink-950 text-ink-50">

    <!-- Header -->
    <div class="max-w-[1600px] mx-auto px-6 md:px-12 pt-32 md:pt-44 pb-24">

      <p class="font-sans text-xs tracking-[0.3em] uppercase text-accent-500 mb-5">
        N° 06 — Contact
      </p>

      <h1 class="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.82]">
        Let's
        <span class="italic font-light text-ink-400">
          Talk.
        </span>
      </h1>

    </div>

    <!-- Contact Area -->
    <div class="max-w-[1200px] mx-auto px-6 md:px-12 pb-32">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

        <!-- Information -->
        <div>

          <p class="font-sans text-xs tracking-[0.25em] uppercase text-accent-500 mb-5">
            Get in Touch
          </p>

          <h2 class="font-display text-4xl md:text-5xl text-ink-50 leading-tight mb-8">
            We would love to
            <span class="italic font-light text-ink-400">
              hear from you.
            </span>
          </h2>

          <p class="font-serif text-lg text-ink-400 leading-relaxed mb-12">
            Have a question about an order, our collections or the Maison
            atelier? Send us a message and our team will get back to you.
          </p>

          <div class="space-y-8">

            <div>
              <p class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 mb-2">
                Email
              </p>

              <a
                href="mailto:hello@maison.com"
                class="font-serif text-lg text-ink-200 hover:text-accent-400 transition-colors"
              >
                hello@maison.com
              </a>
            </div>

            <div>
              <p class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 mb-2">
                Phone
              </p>

              <a
                href="tel:+923356471303"
                class="font-serif text-lg text-ink-200 hover:text-accent-400 transition-colors"
              >
                +923356471303
              </a>
            </div>

            <div>
              <p class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-500 mb-2">
                Location
              </p>

              <p class="font-serif text-lg text-ink-200">
                Bhutto Colony Sargodha road<br />
                Faisalabad
              </p>
            </div>

          </div>

        </div>

        <!-- Form -->
        <div>

          <form
            @submit.prevent="submitForm"
            class="border border-ink-800 p-6 md:p-8 space-y-6"
          >

            <div>
              <label class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2">
                Name *
              </label>

              <input
                v-model="name"
                type="text"
                class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-accent-500 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2">
                Email *
              </label>

              <input
                v-model="email"
                type="email"
                class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-accent-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2">
                Subject
              </label>

              <input
                v-model="subject"
                type="text"
                class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-accent-500 transition-colors"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label class="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-400 block mb-2">
                Message *
              </label>

              <textarea
                v-model="message"
                rows="6"
                class="w-full bg-ink-900 border border-ink-700 text-ink-50 font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-accent-500 transition-colors resize-none"
                placeholder="Write your message..."
              ></textarea>
            </div>

            <p
              v-if="error"
              class="font-sans text-sm text-red-400"
            >
              {{ error }}
            </p>

            <p
              v-if="sent"
              class="font-sans text-sm text-accent-400"
            >
              Thank you. Your message has been sent successfully.
            </p>

            <button
              type="submit"
              :disabled="sending"
              class="w-full py-4 bg-accent-500 text-ink-950 font-sans text-xs tracking-[0.2em] uppercase cursor-hover disabled:opacity-50"
            >
              {{ sending ? 'Sending...' : 'Send Message' }}
            </button>

          </form>

        </div>

      </div>

    </div>

    <!-- Back -->
    <div class="border-t border-ink-800">
      <div class="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
        <button
          @click="emit('navigate', 'home')"
          class="font-sans text-xs tracking-[0.2em] uppercase text-ink-400 hover:text-accent-400 transition-colors"
        >
          ← Back to Store
        </button>
      </div>
    </div>

  </section>
</template>
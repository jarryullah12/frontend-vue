import { ref, computed } from 'vue'

const user = ref(
  JSON.parse(localStorage.getItem('mason_user') || 'null')
)

const profile = ref(
  JSON.parse(localStorage.getItem('mason_profile') || 'null')
)

const loading = ref(false)

const isAuthenticated = computed(() => !!user.value)

const isAdmin = computed(() => profile.value?.is_admin === true)

async function init() {
  loading.value = true

  const savedUser = localStorage.getItem('mason_user')
  const savedProfile = localStorage.getItem('mason_profile')

  user.value = savedUser ? JSON.parse(savedUser) : null
  profile.value = savedProfile ? JSON.parse(savedProfile) : null

  loading.value = false
}

async function signUp(email, password, fullName) {
  const users = JSON.parse(
    localStorage.getItem('mason_users') || '[]'
  )

  const existingUser = users.find((u) => u.email === email)

  if (existingUser) {
    throw new Error('An account with this email already exists.')
  }

  const newUser = {
    id: crypto.randomUUID(),
    email,
    password,
    full_name: fullName || '',
    is_admin: false,
  }

  users.push(newUser)

  localStorage.setItem('mason_users', JSON.stringify(users))

  user.value = {
    id: newUser.id,
    email: newUser.email,
  }

  profile.value = {
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.full_name,
    is_admin: false,
  }

  localStorage.setItem('mason_user', JSON.stringify(user.value))
  localStorage.setItem('mason_profile', JSON.stringify(profile.value))

  return {
    user: user.value,
    profile: profile.value,
  }
}

async function signIn(email, password) {
  const users = JSON.parse(
    localStorage.getItem('mason_users') || '[]'
  )

  const foundUser = users.find(
    (u) => u.email === email && u.password === password
  )

  if (!foundUser) {
    throw new Error('Invalid email or password.')
  }

  user.value = {
    id: foundUser.id,
    email: foundUser.email,
  }

  profile.value = {
    id: foundUser.id,
    email: foundUser.email,
    full_name: foundUser.full_name,
    is_admin: foundUser.is_admin || false,
  }

  localStorage.setItem('mason_user', JSON.stringify(user.value))
  localStorage.setItem('mason_profile', JSON.stringify(profile.value))

  return {
    user: user.value,
    profile: profile.value,
  }
}

async function signOut() {
  user.value = null
  profile.value = null

  localStorage.removeItem('mason_user')
  localStorage.removeItem('mason_profile')
}

async function updateProfile(updates) {
  if (!user.value) return

  profile.value = {
    ...profile.value,
    ...updates,
  }

  localStorage.setItem(
    'mason_profile',
    JSON.stringify(profile.value)
  )

  const users = JSON.parse(
    localStorage.getItem('mason_users') || '[]'
  )

  const index = users.findIndex(
    (u) => u.id === user.value.id
  )

  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...updates,
    }

    localStorage.setItem(
      'mason_users',
      JSON.stringify(users)
    )
  }
}

async function loadProfile() {
  return profile.value
}

export function useAuth() {
  return {
    user,
    profile,
    loading,
    isAdmin,
    isAuthenticated,
    init,
    signUp,
    signIn,
    signOut,
    updateProfile,
    loadProfile,
  }
}
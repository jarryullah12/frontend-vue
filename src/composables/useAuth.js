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

/*
|--------------------------------------------------------------------------
| Default Accounts
|--------------------------------------------------------------------------
*/

const ADMIN_EMAIL = 'jarryullah46@gmail.com'
const ADMIN_PASSWORD = '123456'

const USER_EMAIL = 'hamza46@gmail.com'
const USER_PASSWORD = '123456'

/*
|--------------------------------------------------------------------------
| Create Default Accounts
|--------------------------------------------------------------------------
*/

function ensureDefaultUsers() {
  const users = JSON.parse(
    localStorage.getItem('mason_users') || '[]'
  )

  /*
  |--------------------------------------------------------------------------
  | Admin Account
  |--------------------------------------------------------------------------
  */

  const adminIndex = users.findIndex(
    (u) =>
      u.email?.trim().toLowerCase() ===
      ADMIN_EMAIL.toLowerCase()
  )

  const adminUser = {
    id:
      adminIndex !== -1
        ? users[adminIndex].id
        : crypto.randomUUID(),

    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    full_name: 'Maison Admin',
    is_admin: true,
  }

  if (adminIndex !== -1) {
    users[adminIndex] = {
      ...users[adminIndex],
      ...adminUser,
    }
  } else {
    users.push(adminUser)
  }

  /*
  |--------------------------------------------------------------------------
  | Normal User Account
  |--------------------------------------------------------------------------
  */

  const userIndex = users.findIndex(
    (u) =>
      u.email?.trim().toLowerCase() ===
      USER_EMAIL.toLowerCase()
  )

  const normalUser = {
    id:
      userIndex !== -1
        ? users[userIndex].id
        : crypto.randomUUID(),

    email: USER_EMAIL,
    password: USER_PASSWORD,
    full_name: 'Maison User',
    is_admin: false,
  }

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...normalUser,
    }
  } else {
    users.push(normalUser)
  }

  localStorage.setItem(
    'mason_users',
    JSON.stringify(users)
  )
}

/*
|--------------------------------------------------------------------------
| Init
|--------------------------------------------------------------------------
*/

async function init() {
  loading.value = true

  // Default Admin + User accounts create/update
  ensureDefaultUsers()

  const savedUser = localStorage.getItem('mason_user')
  const savedProfile = localStorage.getItem('mason_profile')

  user.value = savedUser
    ? JSON.parse(savedUser)
    : null

  profile.value = savedProfile
    ? JSON.parse(savedProfile)
    : null

  loading.value = false
}

/*
|--------------------------------------------------------------------------
| Sign Up
|--------------------------------------------------------------------------
*/

async function signUp(email, password, fullName) {
  const users = JSON.parse(
    localStorage.getItem('mason_users') || '[]'
  )

  const cleanEmail = email.trim().toLowerCase()

  const existingUser = users.find(
    (u) =>
      u.email?.trim().toLowerCase() === cleanEmail
  )

  if (existingUser) {
    throw new Error(
      'An account with this email already exists.'
    )
  }

  const newUser = {
    id: crypto.randomUUID(),
    email: email.trim(),
    password,
    full_name: fullName?.trim() || '',
    is_admin: false,
  }

  users.push(newUser)

  localStorage.setItem(
    'mason_users',
    JSON.stringify(users)
  )

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

  localStorage.setItem(
    'mason_user',
    JSON.stringify(user.value)
  )

  localStorage.setItem(
    'mason_profile',
    JSON.stringify(profile.value)
  )

  return {
    user: user.value,
    profile: profile.value,
  }
}

/*
|--------------------------------------------------------------------------
| Sign In
|--------------------------------------------------------------------------
*/

async function signIn(email, password) {
  // Make sure default accounts exist
  ensureDefaultUsers()

  const users = JSON.parse(
    localStorage.getItem('mason_users') || '[]'
  )

  const loginEmail = email.trim().toLowerCase()

  const foundUser = users.find(
    (u) =>
      u.email?.trim().toLowerCase() === loginEmail &&
      u.password === password
  )

  if (!foundUser) {
    throw new Error(
      'Invalid email or password.'
    )
  }

  user.value = {
    id: foundUser.id,
    email: foundUser.email,
  }

  profile.value = {
    id: foundUser.id,
    email: foundUser.email,
    full_name: foundUser.full_name || '',
    is_admin: foundUser.is_admin === true,
  }

  localStorage.setItem(
    'mason_user',
    JSON.stringify(user.value)
  )

  localStorage.setItem(
    'mason_profile',
    JSON.stringify(profile.value)
  )

  return {
    user: user.value,
    profile: profile.value,
  }
}

/*
|--------------------------------------------------------------------------
| Sign Out
|--------------------------------------------------------------------------
*/

async function signOut() {
  user.value = null
  profile.value = null

  localStorage.removeItem('mason_user')
  localStorage.removeItem('mason_profile')
}

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Load Profile
|--------------------------------------------------------------------------
*/

async function loadProfile() {
  return profile.value
}

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

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
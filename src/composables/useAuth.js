import { ref, computed } from 'vue'
import { supabase } from './useSupabase'

const user = ref(null)
const profile = ref(null)
const loading = ref(true)

const isAdmin = computed(() => profile.value?.is_admin === true)
const isAuthenticated = computed(() => !!user.value)

async function loadProfile() {
  if (!user.value) {
    profile.value = null
    return
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .maybeSingle()

  if (error) {
    console.error('Error loading profile:', error.message)
    return
  }
  profile.value = data
}

async function init() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    user.value = session.user
    await loadProfile()
  }
  loading.value = false

  supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      if (event === 'SIGNED_OUT' || !session) {
        user.value = null
        profile.value = null
        return
      }
      if (session.user) {
        user.value = session.user
        await loadProfile()
      }
    })()
  })
}

async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || '' },
    },
  })
  if (error) throw error
  return data
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  user.value = null
  profile.value = null
}

async function updateProfile(updates) {
  if (!user.value) return
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.value.id)
  if (error) throw error
  await loadProfile()
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

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white">
      <div class="p-4">
        <h1 class="text-2xl font-semibold">Hotel Admin</h1>
      </div>
      <nav class="mt-4">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path" 
          class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          :class="{ 'bg-gray-700 text-white': isActive(item.path) }"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <header class="bg-white shadow">
        <div class="px-4 py-6 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">{{ currentPageTitle }}</h2>
          <button 
            @click="logout" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

export default {
  name: 'AdminLayout',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const navItems = [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Rooms', path: '/admin/rooms' },
      { name: 'Bookings', path: '/admin/bookings' },
      { name: 'Users', path: '/admin/users' }
    ];
    
    const isActive = (path) => {
      return router.currentRoute.value.path === path || 
             router.currentRoute.value.path.startsWith(path + '/');
    };
    
    const currentPageTitle = computed(() => {
      const currentPath = router.currentRoute.value.path;
      const currentItem = navItems.find(item => 
        currentPath === item.path || currentPath.startsWith(item.path + '/')
      );
      return currentItem ? currentItem.name : 'Admin Panel';
    });
    
    const logout = () => {
      authStore.logout();
      router.push('/login');
    };
    
    return {
      navItems,
      isActive,
      currentPageTitle,
      logout
    };
  }
};
</script>

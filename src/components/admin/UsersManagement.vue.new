<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Manage Users</h2>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <!-- No users message -->
    <div v-else-if="users.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center">
      <p class="text-gray-500">No users found.</p>
    </div>
    
    <!-- Users Table -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full" :src="user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`" alt="">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span 
                  :class="user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'" 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ user.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.joinedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// User data state
const users = ref([]);
const isLoading = ref(true);

// Fetch users data from localStorage
onMounted(() => {
  fetchUsers();
});

// Function to fetch users from localStorage
function fetchUsers() {
  isLoading.value = true;
  
  try {
    // Get registered users from localStorage
    let registeredUsers = [];
    
    // Get current user from localStorage
    let currentUser = null;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      if (currentUser) {
        registeredUsers.push(currentUser);
      }
    }
    
    // Add admin user if exists
    const adminName = localStorage.getItem('adminName');
    const adminEmail = localStorage.getItem('adminEmail');
    const adminRole = localStorage.getItem('adminRole') || 'Admin';
    
    if (adminEmail && adminName) {
      // Check if admin is already in the list
      const adminExists = registeredUsers.some(u => u.email === adminEmail);
      
      if (!adminExists) {
        registeredUsers.push({
          id: registeredUsers.length + 1,
          name: adminName,
          email: adminEmail,
          role: adminRole,
          active: true,
          joinedAt: new Date()
        });
      }
    }
    
    // Add default admin if no users exist
    if (registeredUsers.length === 0) {
      registeredUsers.push({
        id: 1,
        name: 'Admin User',
        email: 'admin@luxuryhotel.com',
        role: 'Admin',
        active: true,
        joinedAt: new Date()
      });
    }
    
    // Format and set users
    users.value = registeredUsers.map((user, index) => ({
      id: user.id || index + 1,
      name: user.name || 'User ' + (index + 1),
      email: user.email,
      role: user.role || 'User',
      active: user.active !== undefined ? user.active : true,
      joinedAt: user.joinedAt ? new Date(user.joinedAt) : new Date(),
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366f1&color=fff`
    }));
    
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to empty array
    users.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Format date for display
function formatDate(date) {
  try {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Manage Rooms</h2>
      <div class="flex space-x-3">
        <button 
          @click="resetData" 
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reset Data
        </button>
        <button 
          @click="showAddRoomModal = true" 
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add New Room
        </button>
      </div>
    </div>
    
    <!-- Rooms Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="room in rooms" :key="room.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ room.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <img :src="room.image" alt="Room" class="h-10 w-16 object-cover rounded">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ room.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getRoomType(room.name) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ room.price }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ room.capacity }} Person</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ room.available ? 'Available' : 'Booked' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editRoom(room)" 
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button 
                  @click="confirmDeleteRoom(room)" 
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Add/Edit Room Modal -->
    <div v-if="showAddRoomModal || showEditRoomModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-700">{{ showEditRoomModal ? 'Edit Room' : 'Add New Room' }}</h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="showEditRoomModal ? updateRoom() : addRoom()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input 
                  v-model="roomForm.name" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price (per night)</label>
                <input 
                  v-model="roomForm.price" 
                  type="number" 
                  min="0" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <select 
                  v-model="roomForm.capacity" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  v-model="roomForm.available" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option :value="true">Available</option>
                  <option :value="false">Booked</option>
                </select>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                <div class="flex items-center space-x-4">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <input 
                        type="file" 
                        @change="handleMainImageUpload" 
                        accept="image/*"
                        class="hidden"
                        ref="mainImageInput"
                      >
                      <button 
                        type="button" 
                        @click="$refs.mainImageInput.click()"
                        class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 mr-2"
                      >
                        Choose File
                      </button>
                      <span class="text-sm text-gray-500 truncate flex-1">
                        {{ mainImageName || 'No file chosen' }}
                      </span>
                    </div>
                    <input 
                      v-model="roomForm.image" 
                      type="url" 
                      class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Or enter image URL"
                    >
                  </div>
                  <div class="h-16 w-24 overflow-hidden rounded border border-gray-300">
                    <img v-if="roomForm.image" :src="roomForm.image" alt="Main image preview" class="h-full w-full object-cover">
                    <div v-else class="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
                  </div>
                </div>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Image 2</label>
                <div class="flex items-center space-x-4">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <input 
                        type="file" 
                        @change="handleImageTwoUpload" 
                        accept="image/*"
                        class="hidden"
                        ref="imageTwoInput"
                      >
                      <button 
                        type="button" 
                        @click="$refs.imageTwoInput.click()"
                        class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 mr-2"
                      >
                        Choose File
                      </button>
                      <span class="text-sm text-gray-500 truncate flex-1">
                        {{ imageTwoName || 'No file chosen' }}
                      </span>
                    </div>
                    <input 
                      v-model="roomForm.imageTwo" 
                      type="url" 
                      class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Or enter image URL (optional)"
                    >
                  </div>
                  <div class="h-16 w-24 overflow-hidden rounded border border-gray-300">
                    <img v-if="roomForm.imageTwo" :src="roomForm.imageTwo" alt="Second image preview" class="h-full w-full object-cover">
                    <div v-else class="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
                  </div>
                </div>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Image 3</label>
                <div class="flex items-center space-x-4">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <input 
                        type="file" 
                        @change="handleImageThreeUpload" 
                        accept="image/*"
                        class="hidden"
                        ref="imageThreeInput"
                      >
                      <button 
                        type="button" 
                        @click="$refs.imageThreeInput.click()"
                        class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 mr-2"
                      >
                        Choose File
                      </button>
                      <span class="text-sm text-gray-500 truncate flex-1">
                        {{ imageThreeName || 'No file chosen' }}
                      </span>
                    </div>
                    <input 
                      v-model="roomForm.imageThree" 
                      type="url" 
                      class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Or enter image URL (optional)"
                    >
                  </div>
                  <div class="h-16 w-24 overflow-hidden rounded border border-gray-300">
                    <img v-if="roomForm.imageThree" :src="roomForm.imageThree" alt="Third image preview" class="h-full w-full object-cover">
                    <div v-else class="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
                  </div>
                </div>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  v-model="roomForm.description" 
                  rows="3" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                <div class="space-y-2">
                  <div v-for="(amenity, index) in roomForm.amenities" :key="index" class="flex items-center">
                    <input 
                      v-model="roomForm.amenities[index]" 
                      type="text" 
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                    <button 
                      type="button" 
                      @click="removeAmenity(index)" 
                      class="ml-2 p-2 text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                  <button 
                    type="button" 
                    @click="addAmenity" 
                    class="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    + Add Amenity
                  </button>
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {{ showEditRoomModal ? 'Update Room' : 'Add Room' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Confirm Delete</h3>
          <p class="text-gray-600">
            Are you sure you want to delete the room "{{ roomToDelete?.name }}"? This action cannot be undone.
          </p>
        </div>
        <div class="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="deleteRoom" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// Rooms data
const rooms = ref([]);
const isLoading = ref(true);

// Modal states
const showAddRoomModal = ref(false);
const showEditRoomModal = ref(false);
const showDeleteModal = ref(false);

// Image file names
const mainImageName = ref('');
const imageTwoName = ref('');
const imageThreeName = ref('');

// Form for adding/editing rooms
const roomForm = reactive({
  id: null,
  name: '',
  description: '',
  price: 0,
  capacity: 1,
  amenities: [''],
  image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  imageTwo: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  imageThree: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  available: true
});

// Room to delete
const roomToDelete = ref(null);

// File upload handlers
function handleMainImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    mainImageName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      roomForm.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleImageTwoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    imageTwoName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      roomForm.imageTwo = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleImageThreeUpload(event) {
  const file = event.target.files[0];
  if (file) {
    imageThreeName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      roomForm.imageThree = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Load rooms data from localStorage
onMounted(() => {
  fetchRooms();
});

// Function to fetch rooms from localStorage
function fetchRooms() {
  isLoading.value = true;
  
  try {
    // Get rooms from localStorage or use default data if none exists
    let storedRooms = localStorage.getItem('rooms');
    
    if (storedRooms) {
      rooms.value = JSON.parse(storedRooms);
      console.log('Loaded rooms from localStorage:', rooms.value);
      
      // If rooms array is empty, initialize with default data
      if (rooms.value.length === 0) {
        initializeDefaultRooms();
      }
    } else {
      // No rooms in localStorage, initialize with default data
      initializeDefaultRooms();
    }
  } catch (error) {
    console.error('Error fetching rooms:', error);
    // In case of error, initialize with default data
    initializeDefaultRooms();
  } finally {
    isLoading.value = false;
  }
}

// Function to reset data and reinitialize default rooms
function resetData() {
  try {
    // Remove rooms from localStorage
    localStorage.removeItem('rooms');
    console.log('Rooms data cleared from localStorage');
    
    // Initialize with default data
    initializeDefaultRooms();
    
    // Show success message
    alert('Data has been reset successfully!');
  } catch (error) {
    console.error('Error resetting data:', error);
    alert('Failed to reset data. Please try again.');
  }
}

// Initialize with default room data
function initializeDefaultRooms() {
  console.log('Initializing default rooms data');
  rooms.value = [
    {
      id: 1,
      name: 'Deluxe King Room',
      description: 'Spacious room with king-size bed and city view',
      price: 199,
      capacity: 2,
      amenities: [
        'Free Wi-Fi', 
        'Minibar', 
        'Room Service', 
        'TV',
        'Air conditioning',
        'Private bathroom',
        'Wake-up service'
      ],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      imageTwo: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      imageThree: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      available: true
    },
    {
      id: 2,
      name: 'Superior Double Room',
      description: 'Comfortable room with two double beds',
      price: 149,
      capacity: 4,
      amenities: [
        'Free Wi-Fi', 
        'Coffee Maker', 
        'TV',
        'Air conditioning',
        'Private bathroom',
        'Wake-up service'
      ],
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      imageTwo: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      imageThree: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      available: true
    },
    {
      id: 3,
      name: 'Executive Suite',
      description: 'Luxury suite with separate living area and ocean view',
      price: 299,
      capacity: 2,
      amenities: [
        'Free Wi-Fi', 
        'Minibar', 
        'Room Service', 
        'TV', 
        'Jacuzzi',
        'Air conditioning',
        'Private bathroom',
        'Wake-up service'
      ],
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      imageTwo: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      imageThree: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      available: true
    }
  ];
  
  // Save default rooms to localStorage
  saveRoomsToLocalStorage();
  console.log('Default rooms saved to localStorage');
}

// Save rooms to localStorage
function saveRoomsToLocalStorage() {
  localStorage.setItem('rooms', JSON.stringify(rooms.value));
}

// Get room type from name
function getRoomType(name) {
  if (name.includes('Single')) return 'Single';
  if (name.includes('Double')) return 'Double';
  if (name.includes('Triple')) return 'Triple';
  return 'Standard';
}

// Reset form to default values
function resetForm() {
  roomForm.id = null;
  roomForm.name = '';
  roomForm.description = '';
  roomForm.price = 0;
  roomForm.capacity = 1;
  roomForm.amenities = [''];
  roomForm.image = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80';
  roomForm.imageTwo = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
  roomForm.imageThree = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80';
  roomForm.available = true;
  
  // Reset file input names
  mainImageName.value = '';
  imageTwoName.value = '';
  imageThreeName.value = '';
}

// Close any open modal
function closeModal() {
  showAddRoomModal.value = false;
  showEditRoomModal.value = false;
  showDeleteModal.value = false;
  resetForm();
}

// Add a new amenity field
function addAmenity() {
  roomForm.amenities.push('');
}

// Remove an amenity field
function removeAmenity(index) {
  roomForm.amenities.splice(index, 1);
  if (roomForm.amenities.length === 0) {
    addAmenity();
  }
}

// Add a new room
function addRoom() {
  // Filter out empty amenities
  const filteredAmenities = roomForm.amenities.filter(amenity => amenity.trim() !== '');
  
  // Create new room object
  const newRoom = {
    id: Date.now(), // Generate unique ID
    name: roomForm.name,
    description: roomForm.description,
    price: Number(roomForm.price),
    capacity: Number(roomForm.capacity),
    amenities: filteredAmenities,
    image: roomForm.image,
    imageTwo: roomForm.imageTwo,
    imageThree: roomForm.imageThree,
    available: roomForm.available
  };
  
  // Add to rooms array
  rooms.value.push(newRoom);
  
  // Save to localStorage
  saveRoomsToLocalStorage();
  
  // Close modal and reset form
  closeModal();
}

// Edit an existing room
function editRoom(room) {
  // Populate form with room data
  roomForm.id = room.id;
  roomForm.name = room.name;
  roomForm.description = room.description;
  roomForm.price = room.price;
  roomForm.capacity = room.capacity;
  roomForm.amenities = [...room.amenities];
  roomForm.image = room.image;
  roomForm.imageTwo = room.imageTwo || '';
  roomForm.imageThree = room.imageThree || '';
  roomForm.available = room.available;
  
  // Extract file names from image URLs if they exist
  // For data URLs (uploaded files), show 'Uploaded image'
  if (room.image) {
    if (room.image.startsWith('data:')) {
      mainImageName.value = 'Uploaded image';
    } else {
      mainImageName.value = room.image.split('/').pop().split('?')[0];
    }
  }
  
  if (room.imageTwo) {
    if (room.imageTwo.startsWith('data:')) {
      imageTwoName.value = 'Uploaded image';
    } else {
      imageTwoName.value = room.imageTwo.split('/').pop().split('?')[0];
    }
  } else {
    imageTwoName.value = '';
  }
  
  if (room.imageThree) {
    if (room.imageThree.startsWith('data:')) {
      imageThreeName.value = 'Uploaded image';
    } else {
      imageThreeName.value = room.imageThree.split('/').pop().split('?')[0];
    }
  } else {
    imageThreeName.value = '';
  }
  
  // Show edit modal
  showEditRoomModal.value = true;
}

// Update an existing room
function updateRoom() {
  // Filter out empty amenities
  const filteredAmenities = roomForm.amenities.filter(amenity => amenity.trim() !== '');
  
  // Create updated room object
  const updatedRoom = {
    id: roomForm.id,
    name: roomForm.name,
    description: roomForm.description,
    price: Number(roomForm.price),
    capacity: Number(roomForm.capacity),
    amenities: filteredAmenities,
    image: roomForm.image,
    imageTwo: roomForm.imageTwo,
    imageThree: roomForm.imageThree,
    available: roomForm.available
  };
  
  // Update in rooms array
  const index = rooms.value.findIndex(room => room.id === roomForm.id);
  if (index !== -1) {
    rooms.value[index] = updatedRoom;
    
    // Save to localStorage
    saveRoomsToLocalStorage();
  }
  
  // Close modal and reset form
  closeModal();
}

// Confirm delete room
function confirmDeleteRoom(room) {
  roomToDelete.value = room;
  showDeleteModal.value = true;
}

// Delete a room
function deleteRoom() {
  if (!roomToDelete.value) return;
  
  // Remove from rooms array
  const index = rooms.value.findIndex(room => room.id === roomToDelete.value.id);
  if (index !== -1) {
    rooms.value.splice(index, 1);
    
    // Save to localStorage
    saveRoomsToLocalStorage();
  }
  
  // Close modal
  closeModal();
}
</script>

import { createRouter, createWebHistory } from 'vue-router'
import NewHomePage from '../components/NewHomePage.vue'
import SearchResults from '../components/SearchResults.vue'
import RoomsAndSuites from '../components/RoomsAndSuites.vue'
import RoomsList from '../components/RoomsList.vue'
import BookingConfirmation from '../components/BookingConfirmation.vue'
import BookedRooms from '../components/BookedRooms.vue'
import ContactUs from '../components/ContactUs.vue'
import MainLayout from '../components/MainLayout.vue'
import RoomDetails from '../components/RoomDetails.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Logout from '../components/Logout.vue'

// Admin components
import AdminLayout from '../components/admin/AdminLayout.vue'
import Dashboard from '../components/admin/Dashboard.vue'
import RoomsManagement from '../components/admin/RoomsManagement.vue'
import BookingsManagement from '../components/admin/BookingsManagement.vue'
import UsersManagement from '../components/admin/UsersManagement.vue'
import AdminLogin from '../components/admin/AdminLogin.vue'
import AdminRegister from '../components/admin/AdminRegister.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: NewHomePage
      },
      {
        path: 'search',
        name: 'SearchResults',
        component: SearchResults
      },
      {
        path: 'rooms',
        name: 'RoomsAndSuites',
        component: RoomsAndSuites
      },
      {
        path: 'rooms-list',
        name: 'RoomsList',
        component: RoomsList
      },
      // Booking confirmation removed - using booked-rooms directly
      {
        path: 'booked-rooms',
        name: 'BookedRooms',
        component: BookedRooms,
        meta: { requiresAuth: true }
      },
      {
        path: 'contact',
        name: 'ContactUs',
        component: ContactUs
      },
      {
        path: 'room/:id',
        name: 'RoomDetails',
        component: RoomDetails,
        props: true
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'logout',
        name: 'Logout',
        component: Logout
      }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/register',
    name: 'AdminRegister',
    component: AdminRegister
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: Dashboard
      },
      {
        path: 'rooms',
        name: 'RoomsManagement',
        component: RoomsManagement
      },
      {
        path: 'bookings',
        name: 'BookingsManagement',
        component: BookingsManagement
      },
      {
        path: 'users',
        name: 'UsersManagement',
        component: UsersManagement
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication and admin access
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  
  // If route requires authentication and user is not authenticated
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to login page
    next({ name: 'Login' })
  } 
  // If route requires admin access and user is not an admin
  else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    // Redirect to home page
    next({ name: 'Home' })
  } 
  else {
    next()
  }
})

export default router

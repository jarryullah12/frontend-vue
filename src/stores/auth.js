import { defineStore } from '../lib/pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Initialize state with safe defaults
    let isAuthenticated = false;
    let isAdmin = false;
    let user = null;
    let registeredAdmins = [];
    
    try {
      // Try to load from localStorage
      isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      const userJson = localStorage.getItem('user');
      if (userJson) {
        user = JSON.parse(userJson);
      }
      
      const adminsJson = localStorage.getItem('registeredAdmins');
      if (adminsJson) {
        registeredAdmins = JSON.parse(adminsJson);
      }
      
      console.log('Auth state loaded successfully:', { isAuthenticated, isAdmin });
    } catch (error) {
      console.error('Error loading auth state from localStorage:', error);
    }
    
    return {
      isAuthenticated,
      isAdmin,
      user,
      registeredAdmins
    };
  },
  actions: {
    registerAdmin(adminData) {
      try {
        // Get existing admins from localStorage
        let admins = JSON.parse(localStorage.getItem('registeredAdmins')) || [];
        
        // Create a new admin user
        const newAdmin = {
          id: admins.length + 1,
          name: adminData.name,
          email: adminData.email,
          password: adminData.password, // In a real app, this would be hashed
          role: adminData.role || 'Admin',
          avatar: adminData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminData.name)}&background=6366f1&color=fff`
        };
        
        // Add to admins array
        admins.push(newAdmin);
        
        // Save to localStorage
        localStorage.setItem('registeredAdmins', JSON.stringify(admins));
        
        // Update state
        this.registeredAdmins = admins;
        
        return { success: true };
      } catch (error) {
        console.error('Error registering admin:', error);
        return { success: false, message: 'Registration failed' };
      }
    },
    
    login(credentials) {
      try {
        console.log('Attempting login with credentials:', credentials.email);
        
        // First check registered admins
        const adminUser = this.registeredAdmins.find(
          admin => admin.email === credentials.email && admin.password === credentials.password
        );
        
        if (adminUser) {
          console.log('Admin user found:', adminUser.email);
          this.isAuthenticated = true;
          this.isAdmin = true;
          this.user = {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role
          };
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('user', JSON.stringify(this.user));
          
          return { success: true, isAdmin: true };
        }
        
        // Check for registered user from Register component
        try {
          const registeredUserJson = localStorage.getItem('registeredUser');
          if (registeredUserJson) {
            const registeredUser = JSON.parse(registeredUserJson);
            console.log('Checking registered user:', registeredUser.email);
            
            if (registeredUser.email === credentials.email && registeredUser.password === credentials.password) {
              console.log('Registered user found and credentials match');
              this.isAuthenticated = true;
              this.isAdmin = false;
              this.user = {
                id: 2000,
                name: registeredUser.username || 'Registered User',
                email: registeredUser.email,
                role: 'User'
              };
              
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('isAdmin', 'false');
              localStorage.setItem('user', JSON.stringify(this.user));
              
              return { success: true, isAdmin: false };
            }
          } else {
            console.log('No registered user found in localStorage');
          }
        } catch (error) {
          console.error('Error checking registered user:', error);
        }
        
        // Check default admin credentials
        if (credentials.email === 'admin@luxuryhotel.com' && credentials.password === 'admin123') {
          console.log('Default admin login successful');
          this.isAuthenticated = true;
          this.isAdmin = true;
          this.user = {
            id: 999,
            name: 'Admin User',
            email: 'admin@luxuryhotel.com',
            role: 'Admin'
          };
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('user', JSON.stringify(this.user));
          
          return { success: true, isAdmin: true };
        } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
          // Regular user login
          console.log('Default user login successful');
          this.isAuthenticated = true;
          this.isAdmin = false;
          this.user = {
            id: 1000,
            name: 'Regular User',
            email: 'user@example.com',
            role: 'User'
          };
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('isAdmin', 'false');
          localStorage.setItem('user', JSON.stringify(this.user));
          
          return { success: true, isAdmin: false };
        }
        
        // Check all registered users in localStorage
        try {
          const usersJson = localStorage.getItem('users');
          if (usersJson) {
            const users = JSON.parse(usersJson);
            const foundUser = users.find(user => user.email === credentials.email);
            
            if (foundUser) {
              console.log('User found in users list, but cannot verify password (no password stored)');
              // In a real app, you would verify the password here
            }
          }
        } catch (error) {
          console.error('Error checking users list:', error);
        }
        
        // Invalid credentials
        console.log('No matching user found, login failed');
        return { success: false, message: 'Invalid email or password' };
      } catch (error) {
        console.error('Error during login process:', error);
        return { success: false, message: 'An error occurred during login' };
      }
    },
    
    logout() {
      try {
        console.log('Logging out user');
        
        // Update store state
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.user = null;
        
        // Clear localStorage items
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('user');
        
        // Force a page reload to ensure all components update
        // This helps with components that might have cached the auth state
        console.log('Logout successful');
        
        return { success: true };
      } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, error: error.message };
      }
    },
  },
});

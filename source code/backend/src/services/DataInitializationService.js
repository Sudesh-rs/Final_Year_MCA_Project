// services/DataInitializationService.js
const User = require('../models/User'); // Adjust the path if necessary
const bcrypt = require('bcrypt');

class DataInitializationService {
  async initializeAdminUser() {
    const adminEmail = 'sudeshsawant9210@gmail.com';
    const adminPassword = 'Sudesh@9210';
    const adminName = 'Sudesh';

    try {
      // Hash the admin password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Atomically create or update the admin user by email
      const update = {
        fullName: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ROLE_ADMIN',
      };

      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      const adminUser = await User.findOneAndUpdate({ email: adminEmail }, update, options);

      if (adminUser) {
        console.log('Admin user created/updated successfully:', {
          email: adminUser.email,
          fullName: adminUser.fullName,
          role: adminUser.role,
          updatedAt: adminUser.updatedAt,
        });
      } else {
        console.log('Failed to create or update admin user');
      }
    } catch (error) {
      console.error('Error during admin initialization:', error);
    }
  }
}

module.exports = new DataInitializationService();

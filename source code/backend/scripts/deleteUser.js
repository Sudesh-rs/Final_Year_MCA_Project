const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

// Ensure correct model path
const User = require(path.join(__dirname, '..', 'src', 'models', 'User'));

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI not set in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const email = 'sudeshsawant9210@gmail.com';
    const res = await User.findOneAndDelete({ email });

    if (!res) {
      console.log('No user found with email', email);
    } else {
      console.log('Deleted user:', {
        email: res.email,
        fullName: res.fullName,
        role: res.role,
        _id: res._id,
      });
    }
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();

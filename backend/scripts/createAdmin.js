import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    const hashedPassword = await bcrypt.hash('admin123', 12);

    if (existingAdmin) {
      existingAdmin.name = 'Admin';
      existingAdmin.passwordHash = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.iiestian = true;
      existingAdmin.roll = existingAdmin.roll || 'admin001';
      await existingAdmin.save();
      console.log('Admin user updated successfully');
      process.exit(0);
    }

    const admin = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      passwordHash: hashedPassword,
      role: 'admin',
      iiestian: true,
      roll: 'admin001'
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();

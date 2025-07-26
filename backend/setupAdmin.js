
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const School = require('./src/models/School');

async function setupAdmin() {
  try {
    console.log('Starting admin setup...');
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in .env file');
      console.log('Please add MONGODB_URI to your .env file');
      console.log('Example: MONGODB_URI=mongodb://localhost:27017/classsync');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let school = await School.findOne({ name: 'Demo School' });
    if (!school) {
      school = new School({
        name: 'Demo School',
        timetableConfig: {
          periodCount: 8,
          periodDurationMinutes: 45,
          startHour: 8,
          startMinute: 0
        }
      });
      await school.save();
      console.log('Created Demo School');
    } else {
      console.log('Demo School already exists');
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@demo.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Removing existing admin to create fresh one...');
      await User.deleteOne({ email: 'admin@demo.com' });
    }

    // Create admin user with proper password hashing
    const adminPassword = 'Admin@123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const adminUser = new User({
      name: 'Admin',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'admin',
      schoolId: school._id,
      isActive: true
    });

    await adminUser.save();
    console.log('Created admin user');

    //Verify the setup
    console.log('\nSetup Summary:');
    console.log(`   School: ${school.name} (ID: ${school._id})`);
    console.log(`   Admin Email: ${adminUser.email}`);
    console.log(`   Admin Role: ${adminUser.role}`);
    console.log(`   Password: ${adminPassword}`);

    const isPasswordValid = await bcrypt.compare(adminPassword, hashedPassword);
    if (isPasswordValid) {
      console.log('Password verification test passed');
    } else {
      console.log('Password verification test failed');
    }

    //Create demo teacher
    const existingTeacher = await User.findOne({ email: 'teacher@demo.com' });
    if (existingTeacher) {
      console.log('Removing existing teacher to create fresh one...');
      await User.deleteOne({ email: 'teacher@demo.com' });
    }

    const teacherPassword = 'piyush@123';
    const hashedTeacherPassword = await bcrypt.hash(teacherPassword, saltRounds);

    const teacherUser = new User({
      name: 'Demo Teacher',
      email: 'teacher@demo.com',
      password: hashedTeacherPassword,
      role: 'teacher',
      schoolId: school._id,
      isActive: true
    });

    await teacherUser.save();
    console.log('Created demo teacher user');

    console.log('\nSetup completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('   Admin: admin@demo.com / Admin@123');
    console.log('   Teacher: teacher@demo.com / piyush@123');
    
    process.exit(0);

  } catch (error) {
    console.error('Setup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

setupAdmin();
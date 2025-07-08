const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const LeaveRequest = require('../src/models/LeaveRequest');
const ScheduleSlot = require('../src/models/ScheduleSlot');
const Substitution = require('../src/models/Substitution');
const jwt = require('jsonwebtoken');

// Token generation helper
function generateToken(user) {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
}

let adminToken, schoolId;

beforeEach(async () => {
  // Generate unique school ID for this test
  schoolId = new mongoose.Types.ObjectId();

  // Create Admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin',
    schoolId,
    password: 'adminpass123' // Required to avoid validation error
  });

  adminToken = generateToken(admin);

  // Create Teachers
  const teacher1 = await User.create({
    name: 'T1',
    email: 't1@test.com',
    role: 'teacher',
    schoolId,
    password: 'teacherpass1'
  });

  const teacher2 = await User.create({
    name: 'T2',
    email: 't2@test.com',
    role: 'teacher',
    schoolId,
    password: 'teacherpass2'
  });

  // Leave Requests
  await LeaveRequest.create([
    {
      teacherId: teacher1._id,
      fromDate: new Date(),
      toDate: new Date(),
      reason: 'Sick',
      status: 'pending',
      schoolId
    },
    {
      teacherId: teacher2._id,
      fromDate: new Date(),
      toDate: new Date(),
      reason: 'Workshop',
      status: 'approved',
      schoolId
    }
  ]);

  // Schedule Slots
  await ScheduleSlot.create([
    {
      teacherId: teacher1._id,
      schoolId,
      weekday: 1,
      periodIndex: 2,
      subject: 'Math',
      classSection: '8A'
    },
    {
      teacherId: teacher1._id,
      schoolId,
      weekday: 2,
      periodIndex: 3,
      subject: 'Math',
      classSection: '8A'
    },
    {
      teacherId: teacher2._id,
      schoolId,
      weekday: 3,
      periodIndex: 1,
      subject: 'English',
      classSection: '9B'
    }
  ]);

  // Substitution (✅ FIX: added schoolId here)
  await Substitution.create({
    originalTeacherId: teacher1._id,
    substituteTeacherId: teacher2._id,
    scheduleSlotId: new mongoose.Types.ObjectId(), // dummy
    reason: 'Leave',
    schoolId,
    date: new Date() 
  });
});

describe('Dashboard Summary API', () => {
  test('Admin should receive dashboard summary', async () => {
    const res = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.totalTeachers).toBe(2);
    expect(res.body.summary.pendingLeaves).toBe(1);
    expect(res.body.summary.approvedLeaves).toBe(1);
    expect(res.body.summary.totalSubstitutions).toBe(1);
    expect(Array.isArray(res.body.summary.mostLoadedTeachers)).toBe(true);
  });

  test('Should block unauthorized users', async () => {
    const res = await request(app).get('/api/dashboard/admin');
    expect(res.statusCode).toBe(401); // No token
  });

  test('Should block teachers from accessing dashboard', async () => {
    const teacher = await User.create({
      name: 'TeacherX',
      email: 'tx@test.com',
      role: 'teacher',
      schoolId,
      password: 'teacherxpass'
    });

    const token = generateToken(teacher);

    const res = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403); // Forbidden
  });
});

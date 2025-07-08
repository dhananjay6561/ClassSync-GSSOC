const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const User = require('../src/models/User');
const LeaveRequest = require('../src/models/LeaveRequest');

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
};

describe('Leave API Tests', () => {
  let teacherToken, adminToken, teacherId, schoolId;

  beforeEach(async () => {
    schoolId = new mongoose.Types.ObjectId();

    const teacher = await User.create({
      name: 'Test Teacher',
      email: 'teacher@test.com',
      role: 'teacher',
      schoolId,
      password: 'testpassword123',
    });

    teacherId = teacher._id;
    teacherToken = generateToken(teacher);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      schoolId,
      password: 'adminpassword123',
    });

    adminToken = generateToken(admin);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await LeaveRequest.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should allow teacher to apply for leave', async () => {
    const res = await request(app)
      .post('/api/leaves/apply')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        fromDate: '2025-06-10',
        toDate: '2025-06-12',
        reason: 'Personal',
      });

    console.log('Leave Apply Response:', res.body);  // Debug print
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('leaveRequest');
    expect(res.body.leaveRequest).toHaveProperty('teacherId');

  });

  it('should allow admin to approve leave', async () => {
    const leave = await LeaveRequest.create({
      teacherId,
      schoolId,
      fromDate: new Date('2025-06-10'),
      toDate: new Date('2025-06-12'),
      reason: 'Test',
    });

    const res = await request(app)
      .put(`/api/leaves/${leave._id}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'approved',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.leaveRequest.status).toBe('approved');
  });
});

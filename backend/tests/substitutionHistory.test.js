const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const ScheduleSlot = require('../src/models/ScheduleSlot');
const Substitution = require('../src/models/Substitution');
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
}

describe('Substitution History API', () => {
  let adminToken, teacherToken, schoolId;

  beforeEach(async () => {
    schoolId = new mongoose.Types.ObjectId();

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@school.com',
      password: 'testpass',
      role: 'admin',
      schoolId
    });

    const teacher1 = await User.create({
      name: 'Mr. A',
      email: 'a@school.com',
      password: 'testpass',
      role: 'teacher',
      schoolId
    });

    const teacher2 = await User.create({
      name: 'Ms. B',
      email: 'b@school.com',
      password: 'testpass',
      role: 'teacher',
      schoolId
    });

    const slot = await ScheduleSlot.create({
      teacherId: teacher1._id,
      schoolId,
      weekday: 2,
      periodIndex: 3,
      subject: 'History',
      classSection: '9A'
    });

    await Substitution.create({
      originalTeacherId: teacher1._id,
      substituteTeacherId: teacher2._id,
      scheduleSlotId: slot._id,
      reason: 'Sick Leave',
      schoolId,
      date: new Date('2025-06-15')
    });

    adminToken = generateToken(admin);
    teacherToken = generateToken(teacher1);
  });

  test('Admin can view substitution history', async () => {
    const res = await request(app)
      .get('/api/substitutions/history')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.history[0].originalTeacher.name).toBe('Mr. A');
    expect(res.body.history[0].substituteTeacher.name).toBe('Ms. B');
  });

  test('Should reject teacher access', async () => {
    const res = await request(app)
      .get('/api/substitutions/history')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('Should filter by date range', async () => {
    const res = await request(app)
      .get('/api/substitutions/history?from=2025-07-01&to=2025-07-31')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });
});

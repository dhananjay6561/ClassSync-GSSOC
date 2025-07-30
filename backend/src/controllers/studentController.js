const User = require('../models/User');
const ScheduleSlot = require('../models/ScheduleSlot');
const bcrypt = require('bcrypt');

// Get the logged-in student's profile
exports.getMyProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.userId).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(student);
  } catch (err) {
    console.error('Get My Profile Error:', err);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

// Update the logged-in student's profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const studentId = req.user.userId;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      fieldsToUpdate.password = await bcrypt.hash(password, salt);
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { $set: fieldsToUpdate },
      { new: true }
    ).select('-password');

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json(updatedStudent);
  } catch (err) {
    console.error('Update My Profile Error:', err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

// Get the student's weekly schedule
exports.getMySchedule = async (req, res) => {
  try {
    const student = await User.findById(req.user.userId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const schedule = await ScheduleSlot.find({ 
      schoolId: student.schoolId,
      classSection: student.classSection 
    }).populate('teacherId', 'name');

    res.json(schedule);
  } catch (err) {
    console.error('Get My Schedule Error:', err);
    res.status(500).json({ message: 'Failed to fetch schedule.' });
  }
};

// Get dashboard data for the student
exports.getDashboardData = async (req, res) => {
  try {
    const student = await User.findById(req.user.userId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });

    const todaySchedule = await ScheduleSlot.find({
      schoolId: student.schoolId,
      classSection: student.classSection,
      dayOfWeek: dayOfWeek
    }).populate('teacherId', 'name').sort('startTime');

    res.json({
      todaySchedule
    });
  } catch (err) {
    console.error('Get Dashboard Data Error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
};

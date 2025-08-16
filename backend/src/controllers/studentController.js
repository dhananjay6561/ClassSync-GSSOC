const User = require('../models/User');
const ScheduleSlot = require('../models/ScheduleSlot');
const bcrypt = require('bcrypt');
const School = require('../models/School');

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

    const school = await School.findById(student.schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    }

    const schedule = await ScheduleSlot.find({
      schoolId: student.schoolId,
      classSection: student.classSection
    }).populate('teacherId', 'name');

    const scheduleWithTeacher = schedule.map(slot => {
      const { teacherId, ...rest } = slot.toObject();
      const { startHour, startMinute, periodDurationMinutes } = school.timetableConfig;
      
      const now = new Date();
      const today = now.getDate();
      const dayOfWeek = now.getDay();
      
      const date = new Date();
      date.setDate(today - dayOfWeek + slot.weekday);

      const startTime = new Date(date);
      startTime.setHours(startHour, startMinute, 0, 0);
      startTime.setMinutes(startTime.getMinutes() + slot.periodIndex * periodDurationMinutes);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + periodDurationMinutes);

      return {
        ...rest,
        teacher: teacherId,
        startTime,
        endTime
      };
    });

    res.json(scheduleWithTeacher);
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

    const school = await School.findById(student.schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    }

    const today = new Date();
    const dayOfWeek = today.getDay();

    const todaySchedule = await ScheduleSlot.find({
      schoolId: student.schoolId,
      classSection: student.classSection,
      weekday: dayOfWeek
    }).populate('teacherId', 'name').sort('periodIndex');

    const scheduleWithTeacher = todaySchedule.map(slot => {
      const { teacherId, ...rest } = slot.toObject();
      const { startHour, startMinute, periodDurationMinutes } = school.timetableConfig;

      const startTime = new Date();
      startTime.setHours(startHour, startMinute, 0, 0);
      startTime.setMinutes(startTime.getMinutes() + slot.periodIndex * periodDurationMinutes);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + periodDurationMinutes);

      return {
        ...rest,
        teacher: teacherId,
        startTime,
        endTime
      };
    });

    res.json(scheduleWithTeacher);
  } catch (err) {
    console.error('Get Dashboard Data Error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
};

const User = require('../models/User');
const ScheduleSlot = require('../models/ScheduleSlot');
const bcrypt = require('bcrypt');
const { sendLoginCredentials } = require('../services/emailService');

// Get all students for the teacher's classes
exports.getAllStudentsForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const schoolId = req.schoolId;

    // Find all unique classSections taught by the teacher
    const teacherClasses = await ScheduleSlot.distinct('classSection', { teacherId, schoolId });

    // Find all students in those classSections
    const students = await User.find({
      schoolId,
      role: 'student',
      classSection: { $in: teacherClasses }
    }).select('name email classSection rollNumber').sort('classSection rollNumber');

    res.json(students);
  } catch (err) {
    console.error('Get All Students for Teacher Error:', err);
    res.status(500).json({ message: 'Failed to fetch students.' });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, classSection, rollNumber } = req.body;
    const schoolId = req.schoolId;

    if (!name || !email || !password || !classSection || !rollNumber) {
      return res.status(400).json({ message: 'Name, email, password, class section, and roll number are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      schoolId,
      classSection,
      rollNumber,
    });

    await newUser.save();

    await sendLoginCredentials(email, password);

    const studentToReturn = await User.findById(newUser._id).select('name email createdAt classSection rollNumber');

    res.status(201).json(studentToReturn);
  } catch (err) {
    console.error('Create Student by Teacher Error:', err);
    res.status(500).json({ message: 'Failed to create student.' });
  }
};

// Update a student's details
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, classSection, rollNumber } = req.body;
    const schoolId = req.schoolId;

    if (!name || !classSection || !rollNumber) {
      return res.status(400).json({ message: 'Name, class section, and roll number are required fields.' });
    }

    const student = await User.findOneAndUpdate(
      { _id: id, schoolId, role: 'student' },
      { $set: { name, classSection, rollNumber } },
      { new: true }
    ).select('name email createdAt classSection rollNumber');

    if (!student) {
      return res.status(404).json({ message: 'Student not found or you do not have permission to edit.' });
    }

    res.json(student);
  } catch (err) {
    console.error('Update Student by Teacher Error:', err);
    res.status(500).json({ message: 'Failed to update student.' });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.schoolId;

    const student = await User.findOneAndDelete({
      _id: id,
      schoolId,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found or you do not have permission to delete.' });
    }

    res.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    console.error('Delete Student by Teacher Error:', err);
    res.status(500).json({ message: 'Failed to delete student.' });
  }
};
